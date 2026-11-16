#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sincronizador Incremental da Base de Conhecimento Orion TN com OpenAI Vector Store
Tecnologia: OpenAI Platform Responses API / Assistants API (Vector Stores + file_search)
Versão: 1.0.0
Data: 10/11/2026

Características Técnicas:
1. Sincronização incremental baseada em hash SHA-256 (só faz upload do que foi modificado).
2. Chunking estático calibrado: max_chunk_size_tokens=1800, chunk_overlap_tokens=0 (1 rotina = 1 chunk atômico).
3. Injeção de atributos filtráveis nativos no Vector Store (id, modulo, secao, tem_video, categoria).
4. Gerenciamento em lote (file_batches) com polling e barra de progresso.
5. Suporte a Vector Store existente ou criação automática de nova Vector Store.
"""

import os
import sys
import json
import yaml
import hashlib
import argparse
from glob import glob

try:
    from openai import OpenAI
except ImportError:
    print("[!] A biblioteca 'openai' não está instalada. Execute: pip install openai")
    sys.exit(1)

KB_DIR = "kb"
STATE_FILE = os.path.join(KB_DIR, ".sync_state.json")
STATIC_CHUNK_SIZE = 1800
STATIC_OVERLAP = 0


def calculate_sha256(filepath):
    hasher = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def load_sync_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {"vector_store_id": None, "files": {}}


def save_sync_state(state):
    with open(STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def extract_attributes(filepath):
    """Extrai atributos limpos do YAML frontmatter para filtros nativos no Vector Store."""
    attrs = {
        "tipo": "rotina"
    }
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                data = yaml.safe_load(parts[1])
                if isinstance(data, dict):
                    if data.get('id'):
                        attrs['id'] = str(data['id'])
                    if data.get('modulo'):
                        attrs['modulo'] = str(data['modulo'])
                    if data.get('secao'):
                        attrs['secao'] = str(data['secao'])
                    if 'tem_video' in data.get('video', {}):
                        attrs['tem_video'] = bool(data['video']['tem_video'])
                    if data.get('categoria'):
                        attrs['categoria'] = str(data['categoria'])
    except Exception as e:
        print(f"    [!] Aviso ao ler atributos de {filepath}: {e}")
        
    # Documentos auxiliares recebem tipos especiais
    basename = os.path.basename(filepath)
    if basename == "_indice.md":
        attrs = {"tipo": "indice_geral", "modulo": "geral"}
    elif basename == "_glossario.md":
        attrs = {"tipo": "glossario", "modulo": "geral"}
    elif basename == "_contexto.md":
        mod = os.path.basename(os.path.dirname(filepath))
        attrs = {"tipo": "contexto_modular", "modulo": mod}
        
    return attrs


def main():
    parser = argparse.ArgumentParser(description="Sincronizador OpenAI Vector Store - Orion TN")
    parser.add_argument("--api-key", help="OpenAI API Key (ou defina a variável OPENAI_API_KEY)")
    parser.add_argument("--vector-store-id", help="ID da Vector Store existente (ex: vs_abc123)")
    parser.add_argument("--force", action="store_true", help="Força reupload de 100% dos arquivos")
    parser.add_argument("--dry-run", action="store_true", help="Apenas simula o fatiamento e checagem de hashes")
    args = parser.parse_args()

    api_key = args.api_key or os.getenv("OPENAI_API_KEY")
    if not api_key and not args.dry_run:
        print("[!] ERRO: OPENAI_API_KEY não encontrada.")
        print("    Passe via argumento --api-key ou defina no ambiente: export OPENAI_API_KEY='sk-...'")
        print("    Você também pode rodar com '--dry-run' para testar a checagem local sem chamar a API.")
        sys.exit(1)

    print("=================================================================")
    print("SINCRONIZADOR OPENAI VECTOR STORE - SISTEMA ORION TN")
    print("=================================================================")
    
    # 1. Coleta de todos os arquivos .md da base
    all_files = []
    # Documentos estruturais
    for doc in ["_indice.md", "_glossario.md"]:
        p = os.path.join(KB_DIR, doc)
        if os.path.exists(p):
            all_files.append(p)
    # Contextos de módulos
    all_files.extend(glob(os.path.join(KB_DIR, "modulos", "*", "_contexto.md")))
    # Rotinas atômicas
    all_files.extend(glob(os.path.join(KB_DIR, "rotinas", "*", "*.md")))

    print(f"[*] Total de arquivos identificados em '{KB_DIR}/': {len(all_files)}")
    if len(all_files) == 0:
        print("[!] Nenhum arquivo encontrado! Execute primeiro: python scripts/build_kb.py")
        sys.exit(1)

    state = load_sync_state()
    vs_id = args.vector_store_id or state.get("vector_store_id")

    # 2. Identificação de arquivos novos, modificados e inalterados
    to_upload = []
    unchanged = []
    
    for filepath in all_files:
        norm_path = filepath.replace("\\", "/")
        current_hash = calculate_sha256(filepath)
        cached_info = state["files"].get(norm_path)
        
        if args.force or not cached_info or cached_info.get("hash") != current_hash:
            to_upload.append((filepath, norm_path, current_hash))
        else:
            unchanged.append(filepath)

    print(f"[*] Status dos arquivos locais:")
    print(f"    - Modificados / Novos para Upload: {len(to_upload)}")
    print(f"    - Inalterados (Hash Idêntico):    {len(unchanged)}")

    if len(to_upload) == 0:
        print("[✓] Todos os arquivos já estão 100% sincronizados com a Vector Store!")
        return

    if args.dry_run:
        print("\n[i] Modo DRY-RUN ativado. Nenhuma chamada à API OpenAI foi executada.")
        print(f"[i] Primeiros 5 arquivos que seriam enviados:")
        for fp, np, h in to_upload[:5]:
            attrs = extract_attributes(fp)
            print(f"    - {np} (Hash: {h[:8]}...) -> Atributos: {attrs}")
        return

    # 3. Inicialização do Cliente OpenAI
    client = OpenAI(api_key=api_key)

    # 4. Obtenção ou Criação da Vector Store
    if not vs_id:
        print(f"[*] Criando nova Vector Store na OpenAI Platform...")
        vs = client.vector_stores.create(
            name="Orion TN KB V3.2 (Granular - 1 Rotina / Chunk)",
            expires_after={"anchor": "last_active_at", "days": 365}
        )
        vs_id = vs.id
        state["vector_store_id"] = vs_id
        print(f"[✓] Nova Vector Store criada com sucesso! ID: {vs_id}")
    else:
        print(f"[*] Utilizando Vector Store configurada: {vs_id}")

    # 5. Upload dos arquivos para a OpenAI Files API
    print(f"\n[*] Iniciando upload de {len(to_upload)} arquivos para a OpenAI...")
    uploaded_batch_files = []
    
    for i, (fp, np, file_hash) in enumerate(to_upload):
        basename = os.path.basename(fp)
        attrs = extract_attributes(fp)
        
        # Se havia um file_id antigo associado, deleta para evitar lixo
        old_fid = state["files"].get(np, {}).get("file_id")
        if old_fid:
            try:
                client.vector_stores.files.delete(vector_store_id=vs_id, file_id=old_fid)
                client.files.delete(file_id=old_fid)
            except Exception:
                pass

        with open(fp, "rb") as f:
            file_obj = client.files.create(file=f, purpose="assistants")
            
        uploaded_batch_files.append({
            "file_id": file_obj.id,
            "attributes": attrs,
            "chunking_strategy": {
                "type": "static",
                "static": {
                    "max_chunk_size_tokens": STATIC_CHUNK_SIZE,
                    "chunk_overlap_tokens": STATIC_OVERLAP
                }
            },
            "norm_path": np,
            "hash": file_hash
        })
        
        if (i + 1) % 50 == 0 or (i + 1) == len(to_upload):
            print(f"    Progresso do Upload: {i + 1}/{len(to_upload)} arquivos enviados...")

    # 6. Vinculação em Lote na Vector Store (Batch API)
    # A API da OpenAI aceita até 500 arquivos por lote. Nossos 484 arquivos cabem em 1 lote!
    print(f"\n[*] Vinculando arquivos à Vector Store '{vs_id}' em lote com chunking calibrado...")
    batch_payload = [
        {
            "file_id": item["file_id"],
            "attributes": item["attributes"],
            "chunking_strategy": item["chunking_strategy"]
        }
        for item in uploaded_batch_files
    ]
    
    # Divide em fatias de até 500 caso ultrapasse no futuro
    chunk_size_batch = 500
    for idx in range(0, len(batch_payload), chunk_size_batch):
        slice_payload = batch_payload[idx:idx + chunk_size_batch]
        print(f"[*] Enviando batch de {len(slice_payload)} arquivos para indexação e embedding...")
        
        batch = client.vector_stores.file_batches.create_and_poll(
            vector_store_id=vs_id,
            files=slice_payload
        )
        print(f"[✓] Status do Batch: {batch.status} (Arquivos: {batch.file_counts.completed} concluídos, {batch.file_counts.failed} falhas)")
        
        if batch.file_counts.failed > 0:
            print(f"[!] ATENÇÃO: {batch.file_counts.failed} arquivos falharam no processamento vetorial!")

    # 7. Atualização do estado persistido
    for item in uploaded_batch_files:
        state["files"][item["norm_path"]] = {
            "file_id": item["file_id"],
            "hash": item["hash"],
            "attributes": item["attributes"]
        }
    save_sync_state(state)
    
    print("\n=================================================================")
    print("[✓] SINCRONIZAÇÃO CONCLUÍDA COM SUCESSO!")
    print(f"[✓] Vector Store ID Oficial: {vs_id}")
    print(f"[✓] Total de Arquivos Ativos na Base: {len(state['files'])}")
    print("=================================================================")
    print("\nComo configurar sua chamada na OpenAI Platform Responses API:")
    print("```python")
    print("tools = [{")
    print('    "type": "file_search",')
    print(f'    "vector_store_ids": ["{vs_id}"],')
    print('    "max_num_results": 5,')
    print('    "ranking_options": {')
    print('        "score_threshold": 0.30,')
    print('        "hybrid_search": {"rrf_text_weight": 1.3, "rrf_embedding_weight": 1.0}')
    print('    }')
    print("}]")
    print("```\n")


if __name__ == '__main__':
    main()
