// Pontua as respostas dos agentes contra o gabarito.
// Uso: npx tsx gerador/avaliar.ts --dir <pasta-de-trabalho> [--gold <pasta-com-os-json-do-gabarito>] [--md <saida.md>]
// O gabarito é lido de arquivos (e não regenerado), para que a pontuação use exatamente os casos que os agentes viram.

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Caso } from './gerar.ts';
import { gravidadeEfetiva } from './caso.ts';
import type { Achado } from './caso.ts';

interface AchadoAgente { titulo?: string; dimensoes?: string[]; lado_correto?: string; causa_raiz?: string; gravidade?: string; acao?: string; }
interface RespostaAgente { parecer?: string; ressalva?: boolean; resumo?: string; achados?: AchadoAgente[]; observacoes_sobre_a_entrada?: string[] | string; }

function arg(nome: string, padrao: string): string {
  const i = process.argv.indexOf(`--${nome}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : padrao;
}
const dir = resolve(arg('dir', 'avaliacao/trabalho'));
const saida = arg('md', '');
const gold = resolve(arg('gold', 'casos'));
const casos = new Map<string, Caso>(
  readdirSync(gold).filter((f) => f.endsWith('.json')).map((f) => { const c = JSON.parse(readFileSync(join(gold, f), 'utf8')) as Caso; return [c.id, c] as [string, Caso]; }),
);

const norm = (s?: string): string => (s ?? '').trim().toLowerCase();
const relevante = (a: Achado): boolean => gravidadeEfetiva(a) !== 'informativo';

interface Linha { id: string; cenarios: string; gold: string; agente: string; parecerOk: boolean; ressalvaOk: boolean; achadosOk: number; achadosGold: number; falsos: number; detalhe: string[]; obs: string[]; }
const linhas: Linha[] = [];
const faltantes: string[] = [];
for (const arq of readdirSync(join(dir, 'respostas')).filter((f) => f.endsWith('.json')).sort()) {
  const id = arq.replace('.json', '');
  const c = casos.get(id);
  if (!c) continue;
  let r: RespostaAgente;
  try { r = JSON.parse(readFileSync(join(dir, 'respostas', arq), 'utf8')) as RespostaAgente; } catch { faltantes.push(`${id} (JSON inválido)`); continue; }
  const gold = c.gabarito.achados.filter(relevante);
  const ag = (r.achados ?? []).filter((a) => a.gravidade !== 'informativo');
  const usados = new Set<number>();
  let ok = 0;
  const detalhe: string[] = [];
  for (const g of gold) {
    const j = ag.findIndex((a, i) => !usados.has(i) && norm(a.lado_correto) === norm(g.ladoCorreto) && (a.dimensoes ?? []).some((d) => g.dimensoes.includes(d as never)));
    if (j >= 0) { usados.add(j); ok++; } else {
      detalhe.push(`GOLD não encontrado — ${g.cenario}: lado=${g.ladoCorreto}, dims=${g.dimensoes.join('/')}; causa: ${g.causaRaiz}`);
    }
  }
  const falsos = ag.length - usados.size;
  ag.forEach((a, i) => { if (!usados.has(i)) detalhe.push(`AGENTE extra — lado=${a.lado_correto}, dims=${(a.dimensoes ?? []).join('/')}; causa: ${a.causa_raiz}`); });
  const obs = r.observacoes_sobre_a_entrada === undefined ? [] : Array.isArray(r.observacoes_sobre_a_entrada) ? r.observacoes_sobre_a_entrada : [r.observacoes_sobre_a_entrada];
  linhas.push({
    id, cenarios: c.gabarito.cenarios.join('+'), gold: c.gabarito.parecer + (c.gabarito.ressalva ? '*' : ''), agente: `${r.parecer ?? '?'}${r.ressalva ? '*' : ''}`,
    parecerOk: norm(r.parecer) === norm(c.gabarito.parecer), ressalvaOk: Boolean(r.ressalva) === c.gabarito.ressalva,
    achadosOk: ok, achadosGold: gold.length, falsos, detalhe, obs,
  });
}

const n = linhas.length;
const pct = (a: number, b: number): string => (b ? `${((100 * a) / b).toFixed(0)}%` : 'n/d');
const tot = (f: (l: Linha) => number): number => linhas.reduce((a, l) => a + f(l), 0);
const L: string[] = [];
L.push('# Avaliação às cegas', '', `Casos respondidos: ${n}${faltantes.length ? ` (inválidos: ${faltantes.join(', ')})` : ''}`, '');
L.push(`- Parecer correto: **${linhas.filter((l) => l.parecerOk).length}/${n}** (${pct(linhas.filter((l) => l.parecerOk).length, n)})`);
L.push(`- Ressalva correta: ${linhas.filter((l) => l.ressalvaOk).length}/${n}`);
L.push(`- Achados do gabarito encontrados (lado e dimensão): **${tot((l) => l.achadosOk)}/${tot((l) => l.achadosGold)}** (${pct(tot((l) => l.achadosOk), tot((l) => l.achadosGold))})`);
L.push(`- Achados extras (falsos positivos): ${tot((l) => l.falsos)}`, '');
L.push('| Caso | Cenário(s) | Gabarito | Agente | Achados | Extras |', '|---|---|---|---|---|---|');
for (const l of linhas) L.push(`| ${l.id} | ${l.cenarios} | ${l.gold} | ${l.agente}${l.parecerOk ? '' : ' ✗'} | ${l.achadosOk}/${l.achadosGold} | ${l.falsos} |`);
const erros = linhas.filter((l) => !l.parecerOk || l.achadosOk < l.achadosGold || l.falsos > 0);
if (erros.length) {
  L.push('', '## Divergências para análise', '');
  for (const l of erros) { L.push(`### ${l.id} — ${l.cenarios} (gabarito ${l.gold}, agente ${l.agente})`, '', ...l.detalhe.map((d) => `- ${d}`), ''); }
}
const comObs = linhas.filter((l) => l.obs.length);
if (comObs.length) {
  L.push('', '## Observações dos agentes sobre a entrada', '');
  for (const l of comObs) { L.push(`### ${l.id}`, ...l.obs.map((o) => `- ${o}`), ''); }
}
const texto = L.join('\n') + '\n';
if (saida) writeFileSync(resolve(saida), texto);
console.log(texto.split('\n').slice(0, 12).join('\n'));
void existsSync;
