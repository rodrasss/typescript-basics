// Monta a amostra de avaliação "às cegas": só a ENTRADA (sem gabarito) vai para a pasta dos agentes resolvedores.
// Uso: npx tsx gerador/amostra.ts --dir <pasta-de-trabalho> [--grupos 8]

import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gerarTodos } from './gerar.ts';
import { renderEntrada, renderCompleto } from './render.ts';
import { CENARIOS } from './cenarios.ts';
import { criarRng, embaralhar } from './util.ts';

function arg(nome: string, padrao: string): string {
  const i = process.argv.indexOf(`--${nome}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : padrao;
}

const dir = resolve(arg('dir', 'avaliacao/trabalho'));
const nGrupos = Number(arg('grupos', '8'));
const casos = gerarTodos(200, 2026);

const max = Number(arg('max', '0'));
// amostra enxuta: prioriza os mecanismos mais sensíveis (passivo, vigência de regras, performance, ambiguidade)
const PRIORIDADE = [
  'tudo_bate', 'tudo_bate_com_ruido', 'resgate_cotizado_antecipadamente', 'resgate_liquidado_nao_baixado', 'resgate_pago_com_cota_errada',
  'aplicacao_nao_convertida', 'aplicacao_apos_corte_convertida', 'pagamento_taxa_nao_registrado', 'provisao_nao_baixada_apos_pagamento',
  'taxa_reduzida_nao_aplicada', 'ambos_com_taxa_antiga', 'minimo_mensal_ignorado', 'performance_sem_reversao', 'performance_data_base_errada',
  'performance_sem_linha_dagua', 'taxa_cvm_faixa_errada', 'erros_que_se_compensam', 'ativo_iliquido_sem_referencia', 'despesa_nao_prevista',
  'come_cotas_nao_aplicado', 'arredondamento_vs_truncamento', 'curva_vs_mercado_exclusivo',
];
const escolhidos = new Map<string, (typeof casos)[number]>();
if (max > 0) {
  for (const id of PRIORIDADE) {
    const c = casos.find((x) => x.gabarito.cenarios[0] === id && !escolhidos.has(x.id));
    if (c && escolhidos.size < max) escolhidos.set(c.id, c);
  }
  for (const c of casos.filter((x) => x.gabarito.achados.length >= 3)) if (escolhidos.size < max) escolhidos.set(c.id, c);
}
for (const cen of max > 0 ? [] : CENARIOS) {
  const c = casos.find((x) => x.gabarito.cenarios[0] === cen.id && !escolhidos.has(x.id));
  if (c) escolhidos.set(c.id, c);
}
if (max === 0) {
  for (const c of casos.filter((x) => x.gabarito.achados.length >= 3).slice(0, 7)) escolhidos.set(c.id, c);
  for (const c of casos.filter((x) => x.gabarito.cenarios[0] === 'tudo_bate' && !escolhidos.has(x.id)).slice(0, 3)) escolhidos.set(c.id, c);
}

if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
mkdirSync(join(dir, 'cegos'), { recursive: true });
mkdirSync(join(dir, 'respostas'), { recursive: true });
mkdirSync(join(dir, 'revisao'), { recursive: true });
const rng = criarRng(7);
const ids = embaralhar(rng, [...escolhidos.keys()].sort());
const grupos: string[][] = Array.from({ length: nGrupos }, () => []);
ids.forEach((id, i) => grupos[i % nGrupos].push(id));
for (const id of ids) writeFileSync(join(dir, 'cegos', `${id}.md`), renderEntrada(escolhidos.get(id)!));

// revisão com gabarito: um caso por cenário, em três famílias
const porFamilia: Record<string, string[]> = { cota: [], caixa: [], provisoes: [] };
for (const cen of CENARIOS) {
  const c = casos.find((x) => x.gabarito.cenarios[0] === cen.id);
  if (!c) continue;
  writeFileSync(join(dir, 'revisao', `${c.id}.md`), renderCompleto(c));
  porFamilia[cen.dim === 'cota' ? 'cota' : cen.dim === 'caixa' ? 'caixa' : 'provisoes'].push(c.id);
}
writeFileSync(join(dir, 'manifesto.json'), JSON.stringify({ solvers: grupos, revisores: porFamilia }, null, 2));
console.log(`${ids.length} casos cegos em ${grupos.length} grupos; revisão: ${Object.entries(porFamilia).map(([k, v]) => `${k}=${v.length}`).join(' ')}`);
