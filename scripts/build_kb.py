#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Compilador e Fatiador da Base de Conhecimento Orion TN (Schema V3.1.0 -> RAG Granular)
Versão: 1.0.0
Data: 10/11/2026

Funções:
1. Lê e valida 100% das 471 rotinas de 'doc conhecimento final/OrionTN pos.md'.
2. Valida o schema canônico (Schema V3.0 + ADR-003 Bunny.net + ADR-004 0800).
3. Classifica cada rotina em seu módulo funcional correspondente.
4. Gera arquivos atômicos individuais em 'kb/rotinas/{modulo}/{id}-{slug}.md'.
5. Gera documentos de suporte: 'kb/_indice.md', 'kb/_glossario.md' e 'kb/modulos/{modulo}/_contexto.md'.
6. Gera relatório estatístico de integridade.
"""

import os
import re
import sys
import yaml
import unicodedata
from collections import Counter, defaultdict

MASTER_FILE = os.path.join("doc conhecimento final", "OrionTN pos.md")
KB_DIR = "kb"
ROTINAS_DIR = os.path.join(KB_DIR, "rotinas")
MODULOS_DIR = os.path.join(KB_DIR, "modulos")
GLOSSARIO_STANDARD = os.path.join(".agents", "memory", "standards", "glossario_siplan.md")

MODULE_NAMES = {
    "notas": "Notas e Escrituras",
    "caixa": "Orion Caixa e Financeiro",
    "firmas": "Reconhecimento de Firmas e Cartões",
    "selos": "Selo Digital e Papéis de Segurança",
    "centrais": "Centrais Notariais (CENSEC, DOI, COAF)",
    "livros": "Livros Notariais e Folhas",
    "certidoes": "Certidões e Buscas",
    "acesso": "Acesso, Usuários e Segurança",
    "config": "Configurações, Impressão e Parâmetros",
    "comunicacao": "Comunicação (Cartflow e Orion Connect)",
    "geral": "Geral e Rotinas Administrativas"
}

CATEGORY_NAMES = {
    "R": "procedimento_geral",
    "V": "videoaula_tutorial",
    "M": "manual_operacional",
    "D": "demonstracao_pratica",
    "C": "troubleshooting_0800"
}


def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', text)[:50]


def classify_routine(data):
    rid = str(data.get('id', ''))
    title = str(data.get('titulo', '')).lower()
    tags = [str(t).lower() for t in data.get('tags', [])]
    obj = str(data.get('objetivo', '')).lower()
    all_text = f"{title} {' '.join(tags)} {obj}"
    
    # 1. Regras estritas por prefixo da Seção 5 (ADR-004)
    if rid.startswith('C-FIN'): return 'caixa'
    if rid.startswith('C-SELO'): return 'selos'
    if rid.startswith('C-ATOS'): return 'notas'
    if rid.startswith('C-FIRMA'): return 'firmas'
    if rid.startswith('C-CENTRAL'): return 'centrais'
    if rid.startswith('C-LIVRO'): return 'livros'
    if rid.startswith('C-MINUTA'): return 'notas'
    if rid.startswith('C-CERT'): return 'certidoes'
    if rid.startswith('C-ACESSO'): return 'acesso'
    if rid.startswith('C-CONFIG'): return 'config'
    if rid.startswith('C-GERAL'): return 'geral'
    
    # 2. Comunicação e Integrações Web 6.0
    if any(k in all_text for k in ['cartflow', 'orion connect', 'mural de comunicado']):
        return 'comunicacao'
        
    # 3. Firmas, Autógrafo e Cartão de Assinatura (incluindo V-CCA)
    if rid.startswith('V-CCA') or any(k in all_text for k in ['cartao de assinatura', 'cartão de assinatura', 'reconhecimento de firma', 'sinal publico', 'sinal público', 'ficha de firma', 'autógrafo', 'autografo', 'biometria']):
        return 'firmas'
        
    # 4. Certidões e Buscas
    if any(k in all_text for k in ['pedido de certid', 'solicitar certid', 'busca de atos', 'pesquisa de ficha']):
        return 'certidoes'
        
    # 5. Livros Notariais e Folhas
    if any(k in all_text for k in ['termo de abertura', 'termo de encerramento', 'livro de protocolo', 'livro protocolo', 'folhas do livro', 'livro notarial']):
        return 'livros'
        
    # 6. Acesso e Usuários
    if any(k in all_text for k in ['perfil de acesso', 'permissao', 'permissão', 'cadastro de usuario', 'cadastro de usuário', 'troca de senha']):
        return 'acesso'
        
    # 7. Minutas, Protocolos, Escrituras e Atos Notariais (Prevalecem sobre menções secundárias a CENSEC/DOI nas tags)
    if any(k in all_text for k in ['minuta', 'word', 'protocolo', 'escritura', 'procuracao', 'procuração', 'testamento', 'substabelecimento', 'orcamento rapido', 'orçamento rápido', 'importar parte', 'editor']):
        return 'notas'
        
    # 8. Centrais Notariais Obrigatórias
    if any(k in all_text for k in ['censec', 'coaf', 'doi', 'cnib', 'onr', 'saec', 'e-notariado', 'rcto', 'cesdi', 'cep', 'signo', 'sirc', 'indisponibilidade']):
        return 'centrais'
        
    # 9. Selo Digital e Estoque de Insumos
    if any(k in all_text for k in ['orion stock', 'estoque de produto', 'papel de seguran', 'aquisicao de produto', 'aquisição de produto', 'selo digital']):
        return 'selos'
        
    # 10. Orion Caixa e Demonstrações Financeiras (Seção D é quase 100% Caixa)
    if rid.startswith('D-') or any(k in all_text for k in ['caixa', 'mensalista', 'deposito previo', 'depósito prévio', 'recibo', 'livro caixa web', 'lcw', 'faturamento', 'comiss', 'sangria', 'formas de pagamento', 'cheque', 'bancaria', 'bancária', 'provedor de pagamento', 'iss']):
        return 'caixa'
        
    # 11. Configurações, Parâmetros e Etiquetas
    if any(k in all_text for k in ['etiqueta', 'impressora', 'scanner', 'configura', 'parâmetro', 'area de atuacao', 'área de atuação', 'tabela']):
        return 'config'
        
    return 'geral'


def validate_routine(data, body, index):
    errors = []
    rid = data.get('id')
    if not rid:
        errors.append(f"Rotina #{index}: campo 'id' ausente.")
    
    if not data.get('titulo'):
        errors.append(f"Rotina {rid}: campo 'titulo' ausente.")
        
    tags = data.get('tags')
    if not tags or not isinstance(tags, list) or len(tags) < 2:
        errors.append(f"Rotina {rid}: 'tags' inválidas ou insuficientes.")
        
    if not data.get('objetivo'):
        errors.append(f"Rotina {rid}: campo 'objetivo' ausente.")
        
    sinonimos = data.get('sinonimos')
    if not sinonimos or not isinstance(sinonimos, list):
        errors.append(f"Rotina {rid}: 'sinonimos' ausente ou não é lista.")
        
    perguntas = data.get('perguntas_usuario')
    if not perguntas or not isinstance(perguntas, list):
        errors.append(f"Rotina {rid}: 'perguntas_usuario' ausente.")
        
    sintomas = data.get('sintomas_comuns')
    if not sintomas or not isinstance(sintomas, list):
        errors.append(f"Rotina {rid}: 'sintomas_comuns' ausente.")
        
    video = data.get('video')
    if not isinstance(video, dict):
        errors.append(f"Rotina {rid}: nó 'video' ausente ou inválido.")
    else:
        if 'video_id' in video:
            errors.append(f"Rotina {rid}: VIOLAÇÃO ADR-003: campo proibido 'video_id' presente.")
        if video.get('tem_video') is True:
            for f in ['bunny_library_id', 'bunny_video_id', 'video_title', 'video_url']:
                if f not in video:
                    errors.append(f"Rotina {rid}: campo de vídeo obrigatório '{f}' ausente.")
                    
    # Validação do corpo Markdown
    if '#### Descrição:' not in body:
        errors.append(f"Rotina {rid}: cabeçalho '#### Descrição:' ausente no corpo.")
    if '#### Passo a passo:' not in body:
        errors.append(f"Rotina {rid}: cabeçalho '#### Passo a passo:' ausente no corpo.")
        
    return errors


def build_knowledge_base():
    print(f"[*] Iniciando compilação da Base de Conhecimento Orion TN...")
    print(f"[*] Arquivo mestre de entrada: {MASTER_FILE}")
    
    if not os.path.exists(MASTER_FILE):
        print(f"[!] ERRO: Arquivo mestre '{MASTER_FILE}' não encontrado!")
        sys.exit(1)
        
    with open(MASTER_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Regex canônica para fatiamento de rotinas
    pattern = re.compile(r'(?m)^---\s*\n(id:\s*.*?)\n---\s*\n(.*?)(?=\n---\s*\nid:|\Z)', re.DOTALL)
    matches = list(pattern.finditer(content))
    total_rotinas = len(matches)
    print(f"[*] Total de rotinas detectadas: {total_rotinas}")
    
    if total_rotinas != 471:
        print(f"[!] ALERTA: Esperava-se 471 rotinas, mas foram encontradas {total_rotinas}!")
        
    import shutil
    shutil.rmtree(ROTINAS_DIR, ignore_errors=True)
    shutil.rmtree(MODULOS_DIR, ignore_errors=True)
    os.makedirs(ROTINAS_DIR, exist_ok=True)
    os.makedirs(MODULOS_DIR, exist_ok=True)
    
    all_errors = []
    routines_catalog = []
    module_counter = Counter()
    section_counter = Counter()
    modules_data = defaultdict(list)
    
    for i, m in enumerate(matches):
        raw_yaml = m.group(1)
        raw_body = m.group(2).strip()
        
        try:
            data = yaml.safe_load(raw_yaml)
        except Exception as e:
            all_errors.append(f"Erro de sintaxe YAML no bloco #{i}: {e}")
            continue
            
        errors = validate_routine(data, raw_body, i)
        if errors:
            all_errors.extend(errors)
            
        rid = str(data.get('id', f'rotina-{i}'))
        prefix = rid.split('-')[0].upper()
        section_counter[prefix] += 1
        
        modulo = classify_routine(data)
        module_counter[modulo] += 1
        categoria = CATEGORY_NAMES.get(prefix, "procedimento")
        
        # Injeção enriquecida de metadados para busca e atributos RAG
        data['modulo'] = modulo
        data['modulo_nome'] = MODULE_NAMES.get(modulo, modulo)
        data['secao'] = prefix
        data['categoria'] = categoria
        data['versao_sistema'] = "Orion TN 6.0"
        
        slug = slugify(data.get('titulo', ''))
        filename = f"{rid}-{slug}.md"
        
        mod_dir = os.path.join(ROTINAS_DIR, modulo)
        os.makedirs(mod_dir, exist_ok=True)
        file_path = os.path.join(mod_dir, filename)
        
        # Remonta o arquivo Markdown individual
        clean_yaml = yaml.dump(data, allow_unicode=True, sort_keys=False, width=1000)
        file_content = f"---\n{clean_yaml}---\n\n{raw_body}\n"
        
        with open(file_path, 'w', encoding='utf-8') as out_f:
            out_f.write(file_content)
            
        routines_catalog.append({
            "id": rid,
            "titulo": data.get('titulo', ''),
            "modulo": modulo,
            "modulo_nome": MODULE_NAMES.get(modulo, modulo),
            "secao": prefix,
            "categoria": categoria,
            "tem_video": data.get('video', {}).get('tem_video', False),
            "video_url": data.get('video', {}).get('video_url', ''),
            "objetivo": data.get('objetivo', ''),
            "sinonimos": data.get('sinonimos', []),
            "tags": data.get('tags', []),
            "rel_path": f"rotinas/{modulo}/{filename}"
        })
        
        modules_data[modulo].append(routines_catalog[-1])

    if all_errors:
        print(f"[!] Foram encontrados {len(all_errors)} erros de validação:")
        for err in all_errors[:10]:
            print(f"    - {err}")
        if len(all_errors) > 10:
            print(f"    ... e mais {len(all_errors)-10} erros.")
        sys.exit(1)
        
    print(f"[✓] 100% das {total_rotinas} rotinas validadas com SUCESSO (0 erros)!")
    print(f"[✓] 471 arquivos individuais criados em '{ROTINAS_DIR}/<modulo>/'.")
    
    # 1. Geração de kb/_indice.md (Router / Catálogo Geral no formato llms.txt)
    print(f"[*] Gerando catálogo mestre 'kb/_indice.md'...")
    generate_index(routines_catalog)
    
    # 2. Geração de kb/_glossario.md
    print(f"[*] Copiando/Gerando 'kb/_glossario.md' a partir dos padrões...")
    generate_glossario()
    
    # 3. Geração de kb/modulos/{modulo}/_contexto.md
    print(f"[*] Gerando documentos de contexto por módulo em 'kb/modulos/'...")
    generate_module_contexts(modules_data)
    
    # Resumo
    print("\n========================================================")
    print("RESUMO DA COMPILAÇÃO DA BASE DE CONHECIMENTO ORION TN:")
    print("========================================================")
    print(f"Total de Rotinas Homologadas: {total_rotinas}")
    print("\nDistribuição por Módulo Funcional:")
    for mod, count in module_counter.most_common():
        print(f"  - {MODULE_NAMES.get(mod, mod):38} ({mod}): {count:3} rotinas")
    print("\nDistribuição por Seção Canônica:")
    for sec, count in sorted(section_counter.items()):
        print(f"  - Seção {sec}: {count:3} rotinas ({CATEGORY_NAMES.get(sec, 'outro')})")
    print("========================================================\n")


def generate_index(catalog):
    index_path = os.path.join(KB_DIR, "_indice.md")
    lines = [
        "# Catálogo Mestre de Rotinas do Sistema Orion TN",
        "",
        "> **Arquivo de Roteamento de Vocabulário & Descoberta RAG (llms.txt Pattern)**  ",
        f"> **Total de Rotinas Homologadas:** {len(catalog)} rotinas  ",
        "> **Versão do Sistema:** Orion TN 6.0 (Homologação V3.1.0)  ",
        "",
        "Este catálogo sumariza todos os módulos, rotinas, objetivos e sinônimos cadastrados no sistema. Utilize este índice para mapear sinônimos do usuário e localizar o documento atômico exato da rotina antes de gerar a resposta.",
        "",
        "---",
        ""
    ]
    
    by_mod = defaultdict(list)
    for r in catalog:
        by_mod[r['modulo']].append(r)
        
    for mod in sorted(by_mod.keys()):
        mod_name = MODULE_NAMES.get(mod, mod)
        routines = by_mod[mod]
        lines.append(f"## Módulo: {mod_name} (`{mod}`) - {len(routines)} Rotinas")
        lines.append("")
        lines.append("| ID | Título da Rotina | Seção | Vídeo | Sinônimos Chave | Arquivo Relativo |")
        lines.append("| :--- | :--- | :---: | :---: | :--- | :--- |")
        for r in routines:
            sinonimos_str = ", ".join(r['sinonimos'][:3])
            has_vid = "Sim (Bunny)" if r['tem_video'] else "Não"
            lines.append(f"| `{r['id']}` | **{r['titulo']}** | {r['secao']} | {has_vid} | *{sinonimos_str}* | [`{r['id']}`]({r['rel_path']}) |")
        lines.append("")
        lines.append("---")
        lines.append("")
        
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))
    print(f"[✓] 'kb/_indice.md' gerado com sucesso ({len(catalog)} rotinas mapeadas).")


def generate_glossario():
    target_path = os.path.join(KB_DIR, "_glossario.md")
    if os.path.exists(GLOSSARIO_STANDARD):
        with open(GLOSSARIO_STANDARD, 'r', encoding='utf-8') as f:
            content = f.read()
    else:
        content = "# Glossário Oficial Siplan / Orion TN\n\nArquivo de termos canônicos.\n"
        
    header = (
        "# Glossário e Terminologia Oficial: Ecossistema Orion TN\n\n"
        "> **Referência Semântica Obrigatória:** Vocabulário controlado, siglas notariais, centrais oficiais e normas da Corregedoria Geral de Justiça.\n\n"
        "---\n\n"
    )
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(header + content)
    print(f"[✓] 'kb/_glossario.md' atualizado.")


def generate_module_contexts(modules_data):
    for mod, mod_title in MODULE_NAMES.items():
        mod_dir = os.path.join(MODULOS_DIR, mod)
        os.makedirs(mod_dir, exist_ok=True)
        context_file = os.path.join(mod_dir, "_contexto.md")
        
        routines = modules_data.get(mod, [])
        video_count = sum(1 for r in routines if r['tem_video'])
        
        lines = [
            f"# Contexto Operacional e Regras de Negócio: Módulo {mod_title}",
            "",
            f"**Identificador do Módulo:** `{mod}`  ",
            f"**Total de Rotinas Vinculadas:** {len(routines)} rotinas ({video_count} com tutoriais em vídeo Bunny.net)  ",
            f"**Ambiente:** Orion TN 6.0 (SiplanControl-M)  ",
            "",
            "---",
            "",
            "## 1. Visão Geral do Módulo",
            f"O módulo **{mod_title}** gerencia as operações específicas deste segmento no ecossistema do cartório de notas e protesto. Todos os procedimentos deste módulo devem seguir o padrão de Pirâmide Invertida e elementos visuais estritamente em **negrito**.",
            "",
            "## 2. Regras Transversais e Boas Práticas",
            "- **Integridade Cadastral:** Sempre validar documentos de identificação oficial e dados tributários.",
            "- **Respaldo e Selagem:** Atos lavrados ou finalizados exigem vinculação de selo digital de fiscalização (quando aplicável).",
            "- **Desambiguação Obrigatória:** Se o usuário perguntar termos genéricos como 'cadastrar' ou 'emitir recibo', confirme se a ação pertence a este módulo ou a módulos correlatos antes de prosseguir.",
            "",
            "## 3. Catálogo Rápido de Rotinas do Módulo",
            ""
        ]
        
        for r in routines:
            lines.append(f"- **{r['id']}**: {r['titulo']} (Ref: `{r['rel_path']}`)")
            
        lines.append("")
        with open(context_file, 'w', encoding='utf-8') as f:
            f.write("\n".join(lines))
            
    print(f"[✓] Contextos modulares criados para todos os {len(MODULE_NAMES)} módulos.")


if __name__ == '__main__':
    build_knowledge_base()
