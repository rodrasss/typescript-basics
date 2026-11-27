// Utilitários: PRNG determinístico, arredondamentos, formatação e calendário (2026, simulado).

export type Rng = () => number;

export function criarRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const entre = (rng: Rng, min: number, max: number): number => min + (max - min) * rng();
export const inteiro = (rng: Rng, min: number, max: number): number => Math.floor(entre(rng, min, max + 1));
export function escolher<T>(rng: Rng, lista: readonly T[]): T {
  return lista[Math.floor(rng() * lista.length)];
}
export function embaralhar<T>(rng: Rng, lista: readonly T[]): T[] {
  const r = [...lista];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}
export function amostra<T>(rng: Rng, lista: readonly T[], n: number): T[] {
  return embaralhar(rng, lista).slice(0, n);
}
export const chance = (rng: Rng, p: number): boolean => rng() < p;

export const r2 = (v: number): number => Math.round((v + Number.EPSILON * Math.sign(v)) * 100) / 100;
export const r6 = (v: number): number => Math.round(v * 1e6) / 1e6;
export const r8 = (v: number): number => Math.round(v * 1e8) / 1e8;
export function truncar8(v: number): number {
  // trunca (em direção a zero) na 8ª casa; use só em quocientes/produtos "livres", nunca em somas de valores já com 8 casas
  return Math.trunc(v * 1e8) / 1e8;
}
export function arredondar8(v: number): number {
  return Number(v.toFixed(8));
}

const brl = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtR = (v: number): string => `R$ ${brl.format(r2(v))}`;
export const fmtN = (v: number, casas = 2): string =>
  new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }).format(v);
export const fmtCota = (v: number): string => fmtN(v, 8);
export const fmtPct = (v: number, casas = 2): string => `${fmtN(v * 100, casas)}%`;
export const fmtBps = (v: number): string => `${fmtN(v * 10000, 4)} bps`;

// ---------- Calendário (feriados nacionais 2025-2027, simulado a partir do calendário ANBIMA) ----------
const FERIADOS = new Set([
  '2025-01-01', '2025-03-03', '2025-03-04', '2025-04-18', '2025-04-21', '2025-05-01', '2025-06-19', '2025-09-07',
  '2025-10-12', '2025-11-02', '2025-11-15', '2025-11-20', '2025-12-25',
  '2026-01-01', '2026-02-16', '2026-02-17', '2026-04-03', '2026-04-21', '2026-05-01', '2026-06-04',
  '2026-09-07', '2026-10-12', '2026-11-02', '2026-11-20', '2026-12-25',
  '2027-01-01',
]);

export const iso = (d: Date): string => d.toISOString().slice(0, 10);
export const data = (s: string): Date => new Date(`${s}T12:00:00Z`);
export function somaDias(s: string, n: number): string {
  const d = data(s);
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
}
export const ehDiaUtil = (s: string): boolean => {
  const w = data(s).getUTCDay();
  return w !== 0 && w !== 6 && !FERIADOS.has(s);
};
export function somaDiasUteis(s: string, n: number): string {
  let d = s;
  let k = 0;
  const passo = n >= 0 ? 1 : -1;
  while (k < Math.abs(n)) {
    d = somaDias(d, passo);
    if (ehDiaUtil(d)) k++;
  }
  return d;
}
export const diaUtilAnterior = (s: string): string => somaDiasUteis(s, -1);
export function diasCorridos(de: string, ate: string): number {
  return Math.round((data(ate).getTime() - data(de).getTime()) / 86400000);
}
export function diasUteisNoMes(s: string): number {
  const [y, m] = s.split('-');
  let n = 0;
  for (let d = 1; d <= 31; d++) {
    const x = `${y}-${m}-${String(d).padStart(2, '0')}`;
    if (data(x).getUTCMonth() + 1 !== Number(m)) break;
    if (ehDiaUtil(x)) n++;
  }
  return n;
}
export function diasUteisDecorridosNoMes(s: string): number {
  // dias úteis do mês até s, inclusive
  const [y, m] = s.split('-');
  let n = 0;
  for (let d = 1; d <= Number(s.slice(8)); d++) {
    const x = `${y}-${m}-${String(d).padStart(2, '0')}`;
    if (ehDiaUtil(x)) n++;
  }
  return n;
}
export function ultimoDiaUtilDoMes(s: string): string {
  let d = `${s.slice(0, 8)}28`;
  let ult = d;
  for (let i = 0; i < 5; i++) {
    if (d.slice(5, 7) !== s.slice(5, 7)) break;
    if (ehDiaUtil(d)) ult = d;
    d = somaDias(d, 1);
  }
  return ult;
}
export const fmtData = (s: string): string => `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}`;
const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
export const diaDaSemana = (s: string): string => DIAS[data(s).getUTCDay()];

// ---------- datas auxiliares ----------
export function proximoUtil(s: string): string {
  let d = s;
  while (!ehDiaUtil(d)) d = somaDias(d, 1);
  return d;
}
export function diasUteisEntre(de: string, ate: string): number {
  // dias úteis em (de, ate]
  let n = 0;
  for (let d = somaDias(de, 1); d <= ate; d = somaDias(d, 1)) if (ehDiaUtil(d)) n++;
  return n;
}
/**
 * Dia útil em que o pedido deve ser feito para cotizar em `cotizacao`, segundo o prazo do regulamento.
 * Devolve null quando a data é inalcançável (ex.: prazo em dias corridos e o pedido cairia num fim de semana).
 */
export function solicitacaoPara(cotizacao: string, cot: number, corridos: boolean): string | null {
  if (cot === 0) return cotizacao;
  if (!corridos) return somaDiasUteis(cotizacao, -cot);
  // corridos: o pedido é feito num dia útil s tal que proximoUtil(s + cot dias) = cotizacao
  for (let k = 0; k < 6; k++) {
    const s = somaDias(cotizacao, -cot - k);
    if (ehDiaUtil(s) && proximoUtil(somaDias(s, cot)) === cotizacao) return s;
  }
  return null;
}

// ---------- come-cotas: penúltimo dia útil de maio e de novembro ----------
export function penultimoDiaUtilDoMes(s: string): string {
  return diaUtilAnterior(ultimoDiaUtilDoMes(s));
}
/** Datas de come-cotas (penúltimo dia útil de maio e de novembro) nos anos informados. */
export function datasComeCotas(anos: number[]): string[] {
  return anos.flatMap((a) => ['05', '11'].map((m) => penultimoDiaUtilDoMes(`${a}-${m}-15`)));
}
/** Data do come-cotas anterior (seis meses antes) a uma data de come-cotas. */
export function comeCotasAnterior(data: string): string {
  const ano = Number(data.slice(0, 4));
  return data.slice(5, 7) === '05' ? penultimoDiaUtilDoMes(`${ano - 1}-11-15`) : penultimoDiaUtilDoMes(`${ano}-05-15`);
}
export const ehDiaDeComeCotas = (s: string): boolean => datasComeCotas([Number(s.slice(0, 4))]).includes(s);
