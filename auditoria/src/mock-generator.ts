/**
 * Gerador Autônomo de Dados Válidos de Teste para o Orion TN
 * Produz CPFs e CNPJs com dígitos verificadores matematicamente válidos (módulo 11)
 * para destravar validações cadastrais de front-end e back-end.
 */

export function generateValidCPF(): string {
  const rnd = (n: number) => Math.floor(Math.random() * n);
  const digits = Array.from({ length: 9 }, () => rnd(10));

  // 1º dígito verificador
  let d1 = digits.reduce((sum, val, idx) => sum + val * (10 - idx), 0);
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;
  digits.push(d1);

  // 2º dígito verificador
  let d2 = digits.reduce((sum, val, idx) => sum + val * (11 - idx), 0);
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;
  digits.push(d2);

  const raw = digits.join('');
  return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`;
}

export function generateValidCNPJ(): string {
  const rnd = (n: number) => Math.floor(Math.random() * n);
  const digits = [
    rnd(10), rnd(10), rnd(10), rnd(10), rnd(10), rnd(10), rnd(10), rnd(10),
    0, 0, 0, 1 // filial 0001
  ];

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let d1 = digits.reduce((sum, val, idx) => sum + val * w1[idx], 0);
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;
  digits.push(d1);

  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let d2 = digits.reduce((sum, val, idx) => sum + val * w2[idx], 0);
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;
  digits.push(d2);

  const raw = digits.join('');
  return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}/${raw.slice(8, 12)}-${raw.slice(12, 14)}`;
}

const FIRST_NAMES = [
  'Carlos', 'Ana', 'Marcos', 'Juliana', 'Fernando', 'Mariana',
  'Roberto', 'Beatriz', 'Eduardo', 'Camila', 'Rodrigo', 'Patricia'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira',
  'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro'
];

export function generateMockPerson() {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last1 = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const last2 = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const name = `${first} ${last1} ${last2} (Auditoria Teste)`;

  return {
    nome: name,
    cpf: generateValidCPF(),
    rg: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    orgaoExpedidor: 'SSP/SP',
    nacionalidade: 'Brasileira',
    estadoCivil: 'Solteiro(a)',
    profissao: 'Escrevente de Teste',
    email: `auditor.${first.toLowerCase()}@teste-orion.local`,
    telefone: '(11) 98765-4321',
    endereco: {
      logradouro: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01001-000'
    }
  };
}

/** Marca que identifica, no banco de homologação, todo registro criado pelo auto-seed (ADR-021). */
export const AUDIT_MOCK_MARK = 'AUDIT-MOCK';

export type MockFieldKind =
  | 'cpf'
  | 'cnpj'
  | 'cep'
  | 'email'
  | 'phone'
  | 'date'
  | 'date-iso'
  | 'percent'
  | 'money'
  | 'number'
  | 'year'
  | 'uf'
  | 'city'
  | 'text';

export interface MockFieldSpec {
  label: string;
  /** `type` do input (`text`, `number`, `date`...) */
  inputType?: string;
  placeholder?: string;
  name?: string;
  maxLength?: number;
}

const stripAccents = (t: string) =>
  String(t || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Classifica o campo pelo tipo do input e pelo rótulo/placeholder/name. */
export function inferMockFieldKind(spec: MockFieldSpec): MockFieldKind {
  const hay = stripAccents(`${spec.label} ${spec.placeholder || ''} ${spec.name || ''}`);
  if (spec.inputType === 'date') return 'date-iso';
  if (spec.inputType === 'email' || /e-?mail/.test(hay)) return 'email';
  if (/\bcpf\b/.test(hay)) return 'cpf';
  if (/\bcnpj\b/.test(hay)) return 'cnpj';
  if (/\bcep\b/.test(hay)) return 'cep';
  if (spec.inputType === 'tel' || /telefone|celular|fone/.test(hay)) return 'phone';
  if (/\bdata\b|vigencia|nascimento|\bdt\b/.test(hay)) return 'date';
  if (/\bano\b/.test(hay)) return 'year';
  if (/%|aliquota|percentual|porcentagem|\biss\b|\bitbi\b|desconto|juros|multa/.test(hay)) return 'percent';
  if (/valor|preco|custo|r\$|emolumento|taxa/.test(hay)) return 'money';
  if (/\buf\b|\bestado\b/.test(hay)) return 'uf';
  if (/cidade|municipio/.test(hay)) return 'city';
  if (spec.inputType === 'number' || /\bnumero\b|\bcodigo\b|\bqtd\b|quantidade|ordem|\bdias\b|\bprazo\b/.test(hay)) return 'number';
  return 'text';
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Valor de teste válido e coerente com o domínio cartorário para um campo. Texto livre leva a marca
 * `AUDIT-MOCK` para o registro ser identificável no banco de homologação.
 */
export function generateMockFieldValue(spec: MockFieldSpec): { kind: MockFieldKind; value: string } {
  const kind = inferMockFieldKind(spec);
  const now = new Date();
  let value: string;
  switch (kind) {
    case 'cpf': value = generateValidCPF(); break;
    case 'cnpj': value = generateValidCNPJ(); break;
    case 'cep': value = '01001-000'; break;
    case 'email': value = 'audit-mock@teste-orion.local'; break;
    case 'phone': value = '(11) 98765-4321'; break;
    case 'date': value = `${pad2(now.getDate())}/${pad2(now.getMonth() + 1)}/${now.getFullYear()}`; break;
    case 'date-iso': value = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`; break;
    case 'year': value = String(now.getFullYear()); break;
    case 'percent': value = '2,00'; break;
    case 'money': value = '100,00'; break;
    case 'number': value = '1'; break;
    case 'uf': value = 'SP'; break;
    case 'city': value = 'São Paulo'; break;
    default: value = `${AUDIT_MOCK_MARK} ${spec.label.replace(/[*:]+$/g, '').trim()}`.trim();
  }
  if (spec.maxLength && spec.maxLength > 0 && value.length > spec.maxLength) value = value.slice(0, spec.maxLength);
  return { kind, value };
}

export function generateMockProperty() {
  const matricula = `${Math.floor(10000 + Math.random() * 90000)}`;
  return {
    matricula,
    cartorioRI: '1º Oficial de Registro de Imóveis',
    inscricaoMunicipal: `SQL-${Math.floor(100000 + Math.random() * 900000)}`,
    logradouro: 'Avenida Paulista',
    numero: '1000',
    complemento: 'Apto 101',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01310-100',
    valorVenal: '350000,00',
    valorTransacao: '400000,00'
  };
}
