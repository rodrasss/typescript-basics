// Calibração da régua de materialidade a partir das opiniões dos analistas.
// Entrada: um arquivo JSONL com uma opinião por linha (veja base-de-opinioes/README.md).
// Saída: por dimensão, o que os analistas aceitaram e reprovaram, e o limite que melhor separa os dois grupos.
//
// Uso: npm run calibrar -- [base-de-opinioes/opinioes.jsonl]

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { REGUA } from './regua.ts';

export type DimensaoOp = 'cota' | 'caixa' | 'provisoes';
export type ParecerOp = 'APROVADO' | 'REPROVADO' | 'PENDENTE';

export interface Opiniao {
  /** identificador do caso (fundo e dia) */
  caso: string;
  data?: string;
  dimensao: DimensaoOp;
  /** cota: cotas equivalentes; caixa e provisões: reais */
  diferenca: number;
  parecerIA: ParecerOp;
  parecerAnalista: ParecerOp;
  comentario?: string;
  reguaVersao?: string;
}

export interface ResumoDimensao {
  dimensao: DimensaoOp;
  unidade: 'cotas equivalentes' | 'reais';
  limiteAtual: number;
  n: number;
  aprovadas: number;
  reprovadas: number;
  pendentes: number;
  maiorAprovada: number | null;
  menorReprovada: number | null;
  /** aprovadas pelos analistas com diferença igual ou acima do limite atual (a régua está apertada demais?) */
  aprovadasAcimaDoLimite: number;
  /** reprovadas pelos analistas com diferença abaixo do limite atual (a régua está frouxa demais?) */
  reprovadasAbaixoDoLimite: number;
  /** limite que menos erra ao separar aprovadas (abaixo) de reprovadas (a partir dele) */
  limiteSugerido: number | null;
  /** quantas opiniões o limite sugerido ainda classifica errado (0 = os grupos se separam) */
  errosNoLimiteSugerido: number;
  concordanciaComIA: number | null;
}

const LIMITE_ATUAL: Record<DimensaoOp, number> = { cota: REGUA.cotasMinimas, caixa: REGUA.caixaToleranciaReais, provisoes: REGUA.provisaoMaxReais };
const UNIDADE: Record<DimensaoOp, ResumoDimensao['unidade']> = { cota: 'cotas equivalentes', caixa: 'reais', provisoes: 'reais' };

/** Limite que menos erra: diferença < limite deveria ser aprovada; diferença >= limite, reprovada. */
export function melhorLimite(aprovadas: number[], reprovadas: number[], limiteAtual: number): { limite: number | null; erros: number } {
  if (!aprovadas.length || !reprovadas.length) return { limite: null, erros: 0 };
  const valores = [...new Set([...aprovadas, ...reprovadas])].sort((a, b) => a - b);
  const candidatos = new Set<number>([0, valores[valores.length - 1] + 1]);
  valores.forEach((v, i) => { if (i > 0) candidatos.add((valores[i - 1] + v) / 2); });
  let melhor: { limite: number; erros: number } | null = null;
  for (const t of candidatos) {
    const erros = aprovadas.filter((v) => v >= t).length + reprovadas.filter((v) => v < t).length;
    if (!melhor || erros < melhor.erros || (erros === melhor.erros && Math.abs(t - limiteAtual) < Math.abs(melhor.limite - limiteAtual))) melhor = { limite: t, erros };
  }
  return { limite: Number(melhor!.limite.toFixed(2)), erros: melhor!.erros };
}

export function calibrar(opinioes: Opiniao[]): ResumoDimensao[] {
  return (['cota', 'caixa', 'provisoes'] as DimensaoOp[]).map((dimensao) => {
    const ops = opinioes.filter((o) => o.dimensao === dimensao);
    const aprovadas = ops.filter((o) => o.parecerAnalista === 'APROVADO').map((o) => o.diferenca);
    const reprovadas = ops.filter((o) => o.parecerAnalista === 'REPROVADO').map((o) => o.diferenca);
    const limiteAtual = LIMITE_ATUAL[dimensao];
    const { limite, erros } = melhorLimite(aprovadas, reprovadas, limiteAtual);
    return {
      dimensao, unidade: UNIDADE[dimensao], limiteAtual, n: ops.length, aprovadas: aprovadas.length, reprovadas: reprovadas.length,
      pendentes: ops.filter((o) => o.parecerAnalista === 'PENDENTE').length,
      maiorAprovada: aprovadas.length ? Math.max(...aprovadas) : null,
      menorReprovada: reprovadas.length ? Math.min(...reprovadas) : null,
      aprovadasAcimaDoLimite: aprovadas.filter((v) => v >= limiteAtual && !(dimensao === 'caixa' && v === 0)).length,
      reprovadasAbaixoDoLimite: reprovadas.filter((v) => v < limiteAtual).length,
      limiteSugerido: limite, errosNoLimiteSugerido: erros,
      concordanciaComIA: ops.length ? ops.filter((o) => o.parecerAnalista === o.parecerIA).length / ops.length : null,
    };
  });
}

export function lerOpinioes(texto: string): Opiniao[] {
  return texto.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//')).map((l, i) => {
    const o = JSON.parse(l) as Opiniao;
    if (!['cota', 'caixa', 'provisoes'].includes(o.dimensao) || typeof o.diferenca !== 'number') throw new Error(`linha ${i + 1}: dimensao/diferenca inválidas`);
    return o;
  });
}

export function relatorio(resumo: ResumoDimensao[]): string {
  const f = (v: number | null): string => (v === null ? '—' : String(v));
  const L: string[] = [`# Calibração da régua (limites atuais: ${REGUA.versao}, provisória)`, ''];
  for (const r of resumo) {
    L.push(`## ${r.dimensao} (${r.unidade})`, '');
    if (!r.n) { L.push('Sem opiniões para esta dimensão.', ''); continue; }
    L.push(`- Opiniões: ${r.n} (aprovadas ${r.aprovadas}, reprovadas ${r.reprovadas}, pendentes ${r.pendentes}); concordância com a IA: ${r.concordanciaComIA === null ? '—' : `${(r.concordanciaComIA * 100).toFixed(0)}%`}`);
    L.push(`- Limite atual: ${r.limiteAtual}. Maior diferença aprovada: ${f(r.maiorAprovada)}. Menor diferença reprovada: ${f(r.menorReprovada)}.`);
    if (r.aprovadasAcimaDoLimite) L.push(`- ${r.aprovadasAcimaDoLimite} diferença(s) igual(is) ou acima do limite atual foram **aprovadas** pelos analistas: a régua pode estar apertada demais.`);
    if (r.reprovadasAbaixoDoLimite) L.push(`- ${r.reprovadasAbaixoDoLimite} diferença(s) abaixo do limite atual foram **reprovadas** pelos analistas: a régua pode estar frouxa demais.`);
    if (r.limiteSugerido === null) L.push('- Ainda não há aprovadas e reprovadas suficientes para sugerir um limite.');
    else if (r.errosNoLimiteSugerido === 0) L.push(`- **Limite sugerido: ${r.limiteSugerido}** (separa todas as opiniões; o responsável pelo processo decide se adota).`);
    else L.push(`- Limite que menos erra: ${r.limiteSugerido}, ainda com ${r.errosNoLimiteSugerido} opinião(ões) fora: as opiniões se sobrepõem; vale ler os comentários e talvez separar por tipo de fundo.`);
    L.push('');
  }
  return L.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const padrao = existsSync(resolve('base-de-opinioes/opinioes.jsonl')) ? 'base-de-opinioes/opinioes.jsonl' : 'base-de-opinioes/exemplo.jsonl';
  const arquivo = resolve(process.argv[2] ?? padrao);
  if (!existsSync(arquivo)) { console.error(`Arquivo não encontrado: ${arquivo}`); process.exit(1); }
  if (!process.argv[2] && padrao.endsWith('exemplo.jsonl')) console.log('(usando o exemplo fictício; passe o caminho do seu arquivo de opiniões)\n');
  console.log(relatorio(calibrar(lerOpinioes(readFileSync(arquivo, 'utf8')))));
}
