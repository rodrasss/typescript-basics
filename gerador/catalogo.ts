// Catálogo de peças para montar as "personas" de fundos. Tudo aqui é FICTÍCIO:
// nomes de fundos, gestoras, emissores, tickers e pessoas foram inventados para treino.

export type TipoFundo =
  | 'RF_DI'
  | 'RF_CP'
  | 'FIM_MACRO'
  | 'FIM_LS'
  | 'FIA'
  | 'FIC_FIM'
  | 'PREV'
  | 'FIDC'
  | 'FII'
  | 'FIP'
  | 'CAMBIAL'
  | 'IE'
  | 'EXCLUSIVO'
  | 'FIAGRO'
  | 'INFRA';

export interface PrazoResgate { cot: number; corridos: boolean; liq: number; }

export interface PerfilTipo {
  tipo: TipoFundo;
  rotulo: string;
  sufixo: string;
  classe: string;
  publico: string[];
  pl: [number, number];
  cota: [number, number];
  retornoDia: [number, number];
  taxaAdm: [number, number];
  taxaGes: [number, number];
  custodia: [number, number];
  perf: { chance: number; benchmarks: string[] };
  comeCotas: boolean;
  condominio: 'aberto' | 'fechado';
  /** prazos de resgate (condomínio aberto): cotização em D+cot após o pedido; liquidação D+liq (úteis) após a cotização */
  cotizacaoResgate: PrazoResgate[];
  /** texto de regras de saída para condomínio fechado */
  saidaFechado?: string;
  tributacao: string;
}

export const PERFIS: Record<TipoFundo, PerfilTipo> = {
  RF_DI: {
    tipo: 'RF_DI', rotulo: 'Renda Fixa Referenciado DI', sufixo: 'FIF RF Referenciado DI',
    classe: 'Classe de Renda Fixa — Referenciada DI', publico: ['Público geral', 'Público geral (plataformas digitais)'],
    pl: [80e6, 2.5e9], cota: [1.2, 6.5], retornoDia: [0.00049, 0.00054], taxaAdm: [0.0005, 0.0015], taxaGes: [0.0010, 0.0040],
    custodia: [0.0001, 0.0003], perf: { chance: 0, benchmarks: [] }, comeCotas: true, condominio: 'aberto',
    cotizacaoResgate: [{ cot: 0, corridos: false, liq: 0 }], tributacao: 'Longo prazo; come-cotas semestral (maio/novembro) a 15%',
  },
  RF_CP: {
    tipo: 'RF_CP', rotulo: 'Renda Fixa Crédito Privado', sufixo: 'FIF RF Crédito Privado LP',
    classe: 'Classe de Renda Fixa — Crédito Privado', publico: ['Investidores qualificados', 'Público geral'],
    pl: [60e6, 1.8e9], cota: [1.1, 4.8], retornoDia: [0.00040, 0.00070], taxaAdm: [0.0005, 0.0015], taxaGes: [0.0040, 0.0090],
    custodia: [0.0001, 0.0004], perf: { chance: 0.25, benchmarks: ['CDI'] }, comeCotas: true, condominio: 'aberto',
    cotizacaoResgate: [{ cot: 30, corridos: true, liq: 1 }, { cot: 15, corridos: true, liq: 1 }, { cot: 60, corridos: true, liq: 1 }],
    tributacao: 'Longo prazo; come-cotas semestral (maio/novembro) a 15%',
  },
  FIM_MACRO: {
    tipo: 'FIM_MACRO', rotulo: 'Multimercado Macro', sufixo: 'FIF Multimercado',
    classe: 'Classe Multimercado', publico: ['Investidores qualificados', 'Público geral'],
    pl: [50e6, 1.5e9], cota: [1.5, 12], retornoDia: [-0.006, 0.007], taxaAdm: [0.0005, 0.002], taxaGes: [0.008, 0.019],
    custodia: [0.0001, 0.0004], perf: { chance: 0.9, benchmarks: ['CDI'] }, comeCotas: true, condominio: 'aberto',
    cotizacaoResgate: [{ cot: 30, corridos: true, liq: 1 }, { cot: 1, corridos: false, liq: 1 }],
    tributacao: 'Longo prazo; come-cotas semestral (maio/novembro) a 15%',
  },
  FIM_LS: {
    tipo: 'FIM_LS', rotulo: 'Multimercado Long & Short', sufixo: 'FIF Multimercado Long Short',
    classe: 'Classe Multimercado', publico: ['Investidores qualificados'],
    pl: [40e6, 900e6], cota: [1.3, 9], retornoDia: [-0.008, 0.009], taxaAdm: [0.0005, 0.002], taxaGes: [0.01, 0.019],
    custodia: [0.0001, 0.0004], perf: { chance: 0.95, benchmarks: ['CDI'] }, comeCotas: true, condominio: 'aberto',
    cotizacaoResgate: [{ cot: 30, corridos: true, liq: 2 }, { cot: 15, corridos: true, liq: 2 }],
    tributacao: 'Longo prazo; come-cotas semestral (maio/novembro) a 15%',
  },
  FIA: {
    tipo: 'FIA', rotulo: 'Ações', sufixo: 'FIF Ações',
    classe: 'Classe de Ações', publico: ['Público geral', 'Investidores qualificados'],
    pl: [30e6, 1.2e9], cota: [1.1, 25], retornoDia: [-0.022, 0.024], taxaAdm: [0.0005, 0.002], taxaGes: [0.01, 0.019],
    custodia: [0.0001, 0.0005], perf: { chance: 0.7, benchmarks: ['Ibovespa', 'SMLL'] }, comeCotas: false, condominio: 'aberto',
    cotizacaoResgate: [{ cot: 30, corridos: true, liq: 2 }, { cot: 1, corridos: false, liq: 2 }],
    tributacao: 'Classe de ações: sem come-cotas; IR de 15% no resgate',
  },
  FIC_FIM: {
    tipo: 'FIC_FIM', rotulo: 'FIC Multimercado (fundo de fundos)', sufixo: 'FIC FIF Multimercado',
    classe: 'Classe Multimercado — Investimento em Cotas', publico: ['Investidores qualificados', 'Público geral'],
    pl: [40e6, 1e9], cota: [1.2, 8], retornoDia: [-0.004, 0.005], taxaAdm: [0.0005, 0.002], taxaGes: [0.004, 0.01],
    custodia: [0.0001, 0.0003], perf: { chance: 0.3, benchmarks: ['CDI'] }, comeCotas: true, condominio: 'aberto',
    cotizacaoResgate: [{ cot: 30, corridos: true, liq: 1 }, { cot: 45, corridos: true, liq: 1 }],
    tributacao: 'Longo prazo; come-cotas semestral (maio/novembro) a 15%',
  },
  PREV: {
    tipo: 'PREV', rotulo: 'Previdência (FIE — PGBL/VGBL)', sufixo: 'FIE FIF Previdenciário Multimercado',
    classe: 'Classe Previdenciária', publico: ['Exclusivo para planos PGBL/VGBL de seguradora'],
    pl: [100e6, 3e9], cota: [1.5, 7], retornoDia: [-0.003, 0.004], taxaAdm: [0.0005, 0.002], taxaGes: [0.006, 0.014],
    custodia: [0.0001, 0.0003], perf: { chance: 0.2, benchmarks: ['CDI'] }, comeCotas: false, condominio: 'aberto',
    cotizacaoResgate: [{ cot: 1, corridos: false, liq: 1 }],
    tributacao: 'Previdência: tributação no plano (seguradora); sem come-cotas',
  },
  FIDC: {
    tipo: 'FIDC', rotulo: 'FIDC (direitos creditórios)', sufixo: 'FIDC Responsabilidade Limitada',
    classe: 'Classe de FIDC — subclasse única (monocota)', publico: ['Investidores qualificados', 'Investidores profissionais'],
    pl: [50e6, 800e6], cota: [1000, 1500], retornoDia: [0.0004, 0.0008], taxaAdm: [0.0015, 0.0035], taxaGes: [0.005, 0.015],
    custodia: [0.0002, 0.0006], perf: { chance: 0, benchmarks: [] }, comeCotas: false, condominio: 'fechado',
    cotizacaoResgate: [], saidaFechado: 'Condomínio fechado: sem resgate; amortizações conforme cronograma do suplemento.',
    tributacao: 'Regime específico de FIDC (Lei 14.754/2023), sem come-cotas na classe fechada com enquadramento',
  },
  FII: {
    tipo: 'FII', rotulo: 'FII (imobiliário)', sufixo: 'FII Responsabilidade Limitada',
    classe: 'Classe de FII — Tijolo', publico: ['Público geral (cotas negociadas na B3)'],
    pl: [100e6, 2e9], cota: [80, 120], retornoDia: [-0.0003, 0.0006], taxaAdm: [0.001, 0.002], taxaGes: [0.006, 0.01],
    custodia: [0.0001, 0.0002], perf: { chance: 0, benchmarks: [] }, comeCotas: false, condominio: 'fechado',
    cotizacaoResgate: [], saidaFechado: 'Condomínio fechado: sem resgate; liquidez via B3.',
    tributacao: 'FII: rendimentos isentos para PF nas condições legais; ganho de capital 20%',
  },
  FIP: {
    tipo: 'FIP', rotulo: 'FIP Multiestratégia', sufixo: 'FIP Multiestratégia',
    classe: 'Classe de FIP — Multiestratégia', publico: ['Investidores qualificados', 'Investidores profissionais'],
    pl: [80e6, 1.5e9], cota: [800, 2200], retornoDia: [-0.0002, 0.0004], taxaAdm: [0.001, 0.003], taxaGes: [0.012, 0.02],
    custodia: [0.0001, 0.0003], perf: { chance: 0, benchmarks: [] }, comeCotas: false, condominio: 'fechado',
    cotizacaoResgate: [], saidaFechado: 'Condomínio fechado: sem resgate; chamadas de capital e amortizações conforme deliberação.',
    tributacao: 'FIP: regime específico (entidade de investimento)',
  },
  CAMBIAL: {
    tipo: 'CAMBIAL', rotulo: 'Cambial Dólar', sufixo: 'FIF Cambial Dólar',
    classe: 'Classe Cambial', publico: ['Público geral'],
    pl: [40e6, 700e6], cota: [2, 9], retornoDia: [-0.012, 0.012], taxaAdm: [0.0005, 0.002], taxaGes: [0.003, 0.008],
    custodia: [0.0001, 0.0003], perf: { chance: 0, benchmarks: [] }, comeCotas: true, condominio: 'aberto',
    cotizacaoResgate: [{ cot: 0, corridos: false, liq: 1 }],
    tributacao: 'Longo prazo; come-cotas semestral (maio/novembro) a 15%',
  },
  IE: {
    tipo: 'IE', rotulo: 'Investimento no Exterior (ações globais)', sufixo: 'FIC FIF Ações Investimento no Exterior',
    classe: 'Classe de Ações — Investimento no Exterior', publico: ['Investidores qualificados', 'Público geral'],
    pl: [40e6, 900e6], cota: [1.1, 6], retornoDia: [-0.018, 0.018], taxaAdm: [0.0005, 0.002], taxaGes: [0.005, 0.012],
    custodia: [0.0001, 0.0003], perf: { chance: 0.35, benchmarks: ['MSCI ACWI em reais'] }, comeCotas: false, condominio: 'aberto',
    cotizacaoResgate: [{ cot: 3, corridos: false, liq: 2 }, { cot: 5, corridos: false, liq: 2 }],
    tributacao: 'Classe de ações: sem come-cotas; IR de 15% no resgate',
  },
  EXCLUSIVO: {
    tipo: 'EXCLUSIVO', rotulo: 'Fundo exclusivo (família/empresa)', sufixo: 'FIF Multimercado Crédito Privado — Classe Exclusiva',
    classe: 'Classe Multimercado — Exclusiva para investidor profissional', publico: ['Cotista único (classe exclusiva)'],
    pl: [30e6, 600e6], cota: [1.2, 15], retornoDia: [-0.0015, 0.002], taxaAdm: [0.0004, 0.0012], taxaGes: [0.002, 0.006],
    custodia: [0.0001, 0.0002], perf: { chance: 0, benchmarks: [] }, comeCotas: true, condominio: 'aberto',
    cotizacaoResgate: [{ cot: 1, corridos: false, liq: 1 }],
    tributacao: 'Fundo fechado/exclusivo: tributação periódica conforme Lei 14.754/2023 (simplificado neste caso como come-cotas semestral)',
  },
  FIAGRO: {
    tipo: 'FIAGRO', rotulo: 'Fiagro (cadeias agroindustriais)', sufixo: 'Fiagro — Direitos Creditórios',
    classe: 'Classe de Fiagro', publico: ['Público geral (cotas negociadas na B3)'],
    pl: [80e6, 1.2e9], cota: [9, 110], retornoDia: [0.0003, 0.0009], taxaAdm: [0.001, 0.002], taxaGes: [0.007, 0.011],
    custodia: [0.0001, 0.0003], perf: { chance: 0, benchmarks: [] }, comeCotas: false, condominio: 'fechado',
    cotizacaoResgate: [], saidaFechado: 'Condomínio fechado: sem resgate; liquidez via B3.',
    tributacao: 'Fiagro: rendimentos isentos para PF nas condições legais',
  },
  INFRA: {
    tipo: 'INFRA', rotulo: 'Infraestrutura (debêntures incentivadas)', sufixo: 'FIF Incentivado em Infraestrutura RF',
    classe: 'Classe de Renda Fixa — Infraestrutura (Lei 12.431)', publico: ['Público geral'],
    pl: [60e6, 1.4e9], cota: [1.1, 3.5], retornoDia: [-0.0015, 0.0022], taxaAdm: [0.0005, 0.0015], taxaGes: [0.005, 0.009],
    custodia: [0.0001, 0.0003], perf: { chance: 0, benchmarks: [] }, comeCotas: false, condominio: 'aberto',
    cotizacaoResgate: [{ cot: 30, corridos: true, liq: 1 }],
    tributacao: 'Incentivado (Lei 12.431): isento para PF, sem come-cotas',
  },
};

export const NOMES_FUNDO = [
  'Jequitibá', 'Sabiá', 'Carcará', 'Ipê Roxo', 'Buriti', 'Aroeira', 'Juazeiro', 'Mandacaru', 'Tucano', 'Guará',
  'Pitanga', 'Jatobá', 'Cambuí', 'Siriema', 'Quaresmeira', 'Seriguela', 'Pequi', 'Baobá', 'Araucária', 'Capivara',
  'Bem-te-vi', 'Jacarandá', 'Caatinga', 'Cajueiro', 'Sucupira', 'Imbuia', 'Paineira', 'Maritaca', 'Tangará', 'Jabuticaba',
  'Taiúva', 'Cerejeira do Mato', 'Guapuruvu', 'Pau-Brasil', 'Angico', 'Embaúba', 'Canjerana', 'Uirapuru', 'Sanhaço', 'Ariranha',
  'Tamanduá', 'Arara Azul', 'Pirarucu', 'Tuiuiú', 'Cumaru', 'Umbuzeiro', 'Ingá', 'Peroba', 'Cedro Rosa', 'Murici',
  'Corrupião', 'Jandaia', 'Saíra', 'Tiriba', 'Gavião Real', 'Pintassilgo', 'Graúna', 'Socó', 'Biguá', 'Garça Moura',
];

export const COMPLEMENTOS = ['', '', '', ' Prime', ' Plus', ' Institucional', ' Advisory', ' II', ' III', ' Família', ' Estratégia', ' Total'];

export interface Gestora { nome: string; perfil: string; cidade: string; }
export const GESTORAS: Gestora[] = [
  { nome: 'Cumeeira Capital', perfil: 'boutique fundada por ex-operadores de tesouraria, cultura de mesa e muita boleta no fim do dia', cidade: 'São Paulo/SP' },
  { nome: 'Barlavento Investimentos', perfil: 'gestora macro com equipe enxuta e forte uso de derivativos', cidade: 'Rio de Janeiro/RJ' },
  { nome: 'Alvorada Sul Gestão', perfil: 'gestora gaúcha conservadora, focada em crédito privado de emissores de primeira linha', cidade: 'Porto Alegre/RS' },
  { nome: 'Marola Asset', perfil: 'gestora jovem de ações, muito ativa em eventos societários e small caps', cidade: 'Florianópolis/SC' },
  { nome: 'Pedra Branca Gestão', perfil: 'multi-family office que estrutura fundos exclusivos para famílias do agro', cidade: 'Goiânia/GO' },
  { nome: 'Quaresmeira Capital', perfil: 'especialista em crédito estruturado (FIDC e CRA)', cidade: 'São Paulo/SP' },
  { nome: 'Siriema Investimentos', perfil: 'gestora de fundos imobiliários com portfólio de galpões e lajes', cidade: 'São Paulo/SP' },
  { nome: 'Remanso Asset', perfil: 'gestora de previdência ligada a uma seguradora de médio porte', cidade: 'Curitiba/PR' },
  { nome: 'Varanda Capital', perfil: 'gestora de private equity com participações em empresas familiares do interior', cidade: 'Belo Horizonte/MG' },
  { nome: 'Garoa Investimentos', perfil: 'gestora de fundos de fundos (alocação) com comitê mensal de seleção', cidade: 'São Paulo/SP' },
  { nome: 'Ancoradouro Capital', perfil: 'gestora com foco em infraestrutura e debêntures incentivadas', cidade: 'Recife/PE' },
  { nome: 'Lume Gestão de Recursos', perfil: 'gestora de ações globais que investe via fundos offshore', cidade: 'São Paulo/SP' },
  { nome: 'Taquara Asset', perfil: 'gestora de crédito agro com originação própria', cidade: 'Londrina/PR' },
  { nome: 'Maré Alta Investimentos', perfil: 'gestora long & short com histórico de boletas fora do horário', cidade: 'Rio de Janeiro/RJ' },
  { nome: 'Cerrado Vivo Gestão', perfil: 'gestora de Fiagro e CRA, muito próxima de cooperativas', cidade: 'Cuiabá/MT' },
  { nome: 'Farol do Norte Capital', perfil: 'gestora de renda fixa líquida para plataformas digitais', cidade: 'São Paulo/SP' },
  { nome: 'Coivara Partners', perfil: 'gestora multiestratégia criada por ex-sócios de banco de investimento', cidade: 'São Paulo/SP' },
  { nome: 'Itapuã Gestão', perfil: 'gestora baiana de crédito privado e infraestrutura regional', cidade: 'Salvador/BA' },
  { nome: 'Serra do Mar Asset', perfil: 'gestora cambial e de juros com operação muito sistematizada', cidade: 'Santos/SP' },
  { nome: 'Bromélia Investimentos', perfil: 'gestora familiar com processos manuais e planilhas próprias', cidade: 'Campinas/SP' },
];

export const ANALISTAS = ['Marina', 'Rafael', 'Juliana', 'Thiago', 'Beatriz', 'Lucas', 'Camila', 'Gustavo', 'Larissa', 'Pedro', 'Aline', 'Felipe', 'Renata', 'Bruno', 'Patrícia', 'Diego'];
export const GESTORES_PF = ['Otávio', 'Helena', 'Caio', 'Lívia', 'Rodrigo', 'Fernanda', 'Henrique', 'Sofia', 'Murilo', 'Cecília', 'Vinícius', 'Isadora'];

export const COTISTAS: Record<TipoFundo, string[]> = {
  RF_DI: ['cerca de 48 mil cotistas pessoa física vindos de plataformas digitais', 'tesourarias de empresas médias que usam o fundo como caixa', 'clientes de varejo alta renda que aplicam e resgatam quase todo dia'],
  RF_CP: ['cerca de 6 mil cotistas qualificados via assessorias', 'family offices e alguns fundos de fundos de terceiros', 'clientes private que buscam CDI+ com prazo de resgate longo'],
  FIM_MACRO: ['fundos de fundos de grandes plataformas (concentração de 40% em 3 FoFs)', 'investidores qualificados via assessorias de investimento', 'sócios da própria gestora e clientes private'],
  FIM_LS: ['cerca de 2 mil investidores qualificados', 'um fundo de pensão fechado com 18% das cotas', 'clientes private de dois bancos de varejo'],
  FIA: ['cerca de 12 mil cotistas pessoa física', 'um FoF de ações de terceiros com 22% do PL', 'clientes de varejo que entraram na alta de 2024'],
  FIC_FIM: ['carteiras administradas e clientes private com perfil moderado', 'cerca de 3 mil cotistas qualificados', 'clientes de um escritório de assessoria do interior paulista'],
  PREV: ['planos PGBL/VGBL de uma seguradora (cotista único: a seguradora, representando ~35 mil participantes)', 'planos VGBL de uma seguradora regional (cotista único)'],
  FIDC: ['dois fundos de crédito e uma seguradora', 'investidores profissionais e um family office'],
  FII: ['cerca de 85 mil cotistas pessoa física negociando na B3', 'cerca de 30 mil cotistas, com 12% em um FoF imobiliário'],
  FIP: ['8 investidores profissionais (fundos de pensão e family offices) com capital comprometido', 'family offices e um endowment universitário'],
  CAMBIAL: ['pessoas físicas que usam o fundo como proteção cambial para viagens e importações', 'pequenas empresas importadoras'],
  IE: ['investidores qualificados buscando diversificação global', 'clientes private com perfil arrojado e um FoF global'],
  EXCLUSIVO: ['uma família de produtores de soja de Sorriso (MT)', 'a holding patrimonial de uma família de industriais do Vale do Itajaí (SC)', 'a tesouraria de uma cooperativa de crédito do Paraná', 'um empresário do setor de transportes de Ribeirão Preto (SP) e sua holding'],
  FIAGRO: ['cerca de 40 mil cotistas pessoa física via B3', 'cerca de 22 mil cotistas, muitos produtores rurais do Centro-Oeste'],
  INFRA: ['cerca de 9 mil cotistas pessoa física buscando isenção de IR', 'clientes de varejo alta renda e um FoF incentivado'],
};

export interface Fato {
  texto: string;
  /** só vale para fundos de condomínio aberto */
  aberto?: boolean;
  /** se informado, só vale para esses tipos */
  tipos?: TipoFundo[];
  /** não vale para esses tipos */
  exceto?: TipoFundo[];
  /** só vale se o fundo é aberto ao público geral */
  publicoGeral?: boolean;
}

const TIPOS_CREDITO: TipoFundo[] = ['RF_CP', 'INFRA', 'FIDC', 'FIAGRO', 'EXCLUSIVO', 'PREV'];
const TIPOS_VAREJO: TipoFundo[] = ['RF_DI', 'RF_CP', 'FIM_MACRO', 'FIM_LS', 'FIA', 'FIC_FIM', 'CAMBIAL', 'IE', 'INFRA'];
const TIPOS_NEGOCIACAO: TipoFundo[] = ['RF_DI', 'RF_CP', 'FIM_MACRO', 'FIM_LS', 'FIA', 'FIC_FIM', 'PREV', 'CAMBIAL', 'IE', 'EXCLUSIVO', 'INFRA'];

export const MARCOS_HISTORIA: Fato[] = [
  { texto: 'adaptou o regulamento à Resolução CVM 175 em 2025, separando taxa de administração e taxa de gestão' },
  { texto: 'incorporou um fundo irmão menor em 2022, o que gerou um longo período de conciliação de cotistas' },
  { texto: 'trocou de gestor responsável em 2023 depois da saída do fundador' },
  { texto: 'aprovou em assembleia, em 2024, a redução das taxas, já em vigor desde aquele ano', aberto: true },
  { texto: 'teve um forte resgate em 2021, quando perdeu quase 30% do PL em uma semana', aberto: true, exceto: ['PREV', 'EXCLUSIVO'] },
  { texto: 'migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização' },
  { texto: 'foi destaque em rankings de 2023, o que trouxe uma onda de aplicações de varejo', tipos: TIPOS_VAREJO, publicoGeral: true },
  { texto: 'teve um evento de crédito em 2023 em um dos emissores da carteira, recuperado em 2025', tipos: TIPOS_CREDITO },
  { texto: 'mudou a política de investimento em 2025 para permitir derivativos com finalidade de hedge', tipos: ['FIA', 'PREV', 'IE', 'INFRA', 'RF_CP', 'FIC_FIM'] },
  { texto: 'reduziu o prazo de cotização em 2024 para competir em plataformas', tipos: ['RF_CP', 'FIM_MACRO', 'FIM_LS', 'FIA', 'FIC_FIM', 'IE', 'INFRA'] },
  { texto: 'fez uma nova emissão de cotas em 2024 para comprar mais um ativo', tipos: ['FII', 'FIAGRO'] },
  { texto: 'trocou de custodiante em 2024, com migração de carteira e de cadastros', tipos: ['FIDC', 'FIAGRO', 'FII', 'FIP'] },
  { texto: 'passou por uma reestruturação societária em uma das investidas em 2023', tipos: ['FIP'] },
  { texto: 'teve a estrutura da família revisada em 2024, com mudança de holding cotista', tipos: ['EXCLUSIVO'] },
];

export const PARTICULARIDADES_GERAIS: Fato[] = [
  { texto: 'a equipe da gestora trabalha com planilhas próprias e às vezes manda informação por e-mail antes da confirmação formal' },
  { texto: 'o fundo tem histórico de divergências pequenas de arredondamento que nunca chegaram a impactar a cota' },
  { texto: 'a gestora costuma mandar boletas depois das 17h, especialmente às sextas-feiras', tipos: TIPOS_NEGOCIACAO },
  { texto: 'o fundo é acompanhado de perto pelo distribuidor, que liga quando a cota atrasa', aberto: true, exceto: ['PREV', 'EXCLUSIVO'] },
  { texto: 'o fundo tem aplicações e resgates quase todos os dias', aberto: true },
  { texto: 'as reuniões do comitê de investimentos acontecem na primeira terça-feira de cada mês' },
  { texto: 'a gestora publica uma carta mensal aos cotistas até o 5º dia útil' },
  { texto: 'o administrador revisa o manual de precificação uma vez por ano' },
  { texto: 'o fundo está fechado para novas aplicações de varejo e só aceita aportes de cotistas existentes', aberto: true, tipos: ['FIM_MACRO', 'FIM_LS', 'FIA', 'RF_CP', 'FIC_FIM'] },
];

export function fatosPara(lista: Fato[], tipo: TipoFundo, condominio: 'aberto' | 'fechado', anoInicio: number, publico = ''): Fato[] {
  return lista.filter((f) => {
    if (f.publicoGeral && !/geral/i.test(publico)) return false;
    if (f.aberto && condominio !== 'aberto') return false;
    if (f.tipos && !f.tipos.includes(tipo)) return false;
    if (f.exceto && f.exceto.includes(tipo)) return false;
    const ano = f.texto.match(/\b(20\d\d)\b/);
    return !ano || Number(ano[1]) > anoInicio;
  });
}
