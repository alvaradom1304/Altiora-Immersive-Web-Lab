// Altiora Universal Capability Router: deterministic, offline, read-only by default.
// No third-party code is fetched, installed or executed. No background agents are launched.
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadAgents, loadSkills} from './skill-catalog.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const ROUTES = [
  {
    id: 'video-postproduction',
    triggers: [/edit(ar|a|ing)?\s+(el\s+|mis\s+|my\s+)?(video|clips?|reels?)/, /postproducc/, /mont(a|á)je/, /motion graphics/, /un(i|í|e)r (las )?(tomas|clips)/, /export(ar|a).*(mp4|video)/],
    lead: 'creative-ads-director',
    collaborators: ['motion-designer','visual-producer'],
    reviewer: 'qa-reviewer',
    skills: ['ai-video-direction','motion-design','creative-quality-assurance'],
    sources: ['remotion-dev/remotion','FFmpeg/FFmpeg','NVIDIA/SkillSpector'],
    deliverable: 'Montaje original con fuentes editables, MP4 verificable y manifiesto de derechos.'
  },
  {
    id: 'external-repository-security',
    triggers: [/repositor/, /github/, /skills? (extern|malicios|tercero)/, /skillspector/, /supply.chain/, /dependenc/, /revis(ar|a|ión).*seguridad/],
    lead: 'altiora-engineering',
    collaborators: ['altiora-research'],
    reviewer: 'altiora-review',
    skills: ['altiora-repository-research','dependency-security','altiora-quality-review'],
    sources: ['NVIDIA/SkillSpector','aquasecurity/trivy','ossf/scorecard'],
    deliverable: 'Comparativa basada en evidencia y revisión de seguridad; sin instalación automática.'
  },
  {
    id: 'ads-creative',
    triggers: [/anuncios?/, /publicidad/, /camp(a|añ)a/, /tiktok/, /reels?/, /marketing creativ/, /creativ(o|a) (publicitari|ads)/],
    lead: 'creative-ads-director',
    collaborators: ['market-intelligence-director','visual-producer'],
    reviewer: 'qa-reviewer',
    skills: ['advertising-concept','creative-deconstruction-originality','ai-video-direction'],
    sources: [],
    deliverable: 'Conceptos originales, demostración sustentada y criterios de prueba comercial.'
  },
  {
    id: 'immersive-web',
    triggers: [/sitio web/, /p(a|á)gina web/, /webgl/, /scrollytelling/, /three.?js/, /experienc(ia|e) inmersiv/, /interacci(o|ó)n web/],
    lead: 'experience-director',
    collaborators: ['creative-director','web-engineer'],
    reviewer: 'qa-reviewer',
    skills: ['elite-web-experience-os','immersive-web-design','web-performance'],
    sources: [],
    deliverable: 'Experiencia diferenciada, accesible, medible y con alternativa de bajo consumo.'
  },
  {
    id: 'commercial-growth',
    triggers: [/captaci(o|ó)n/, /whatsapp.*venta/, /ventas?/, /conversi(o|ó)n/, /estrategia comercial/, /producto ganador/, /clientes nuevos/],
    lead: 'commerce-growth-director',
    collaborators: ['business-strategist','growth-analyst'],
    reviewer: 'qa-reviewer',
    skills: ['product-winner-scorecard','whatsapp-lead-to-sale','growth-experiment-analysis'],
    sources: [],
    deliverable: 'Hipótesis, KPIs y experimento de adquisición con baseline verificable.'
  },
  {
    id: 'software-engineering',
    triggers: [/c(o|ó)digo/, /programaci(o|ó)n/, /desarroll(ar|o|o de)/, /pull request/, /\bbug\b/, /\bapi\b/, /automatizaci(o|ó)n/],
    lead: 'altiora-engineering',
    collaborators: ['altiora-research'],
    reviewer: 'altiora-review',
    skills: ['writing-plans','systematic-debugging','verification-before-completion'],
    sources: [],
    deliverable: 'Cambio acotado con pruebas, revisión y evidencia reproducible.'
  }
];
export function normalize(text) {
  return String(text ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
}
export function chooseRoute(task) {
  const query=normalize(task);
  if(!query) throw Error('La tarea no puede estar vacía');
  const scored=ROUTES.map((route,index)=>({
    route, index, hits: route.triggers.filter(r=>r.test(query)).length
  })).filter(x=>x.hits>0);
  scored.sort((a,b)=>b.hits-a.hits||a.index-b.index);
  return scored[0]?.route ?? null;
}
export function makePlan(task, skills, agents) {
  if (!Array.isArray(skills) || !Array.isArray(agents)) throw TypeError('Se requieren catálogos');
  const route=chooseRoute(task);
  const availableSkills=new Set(skills.map(x=>typeof x==='string'?x:x.name));
  const availableAgents=new Set(agents.map(x=>typeof x==='string'?x:x.id));
  if (!route) return {
    status:'CAPABILITY_GAP', task, intent:'unclassified', lead:null, collaborators:[], reviewer:null,
    skills:[], delegation:[], source_candidates:[], proposal:'RESEARCH_THEN_SKILL_FACTORY',
    next:'Auditar skills existentes antes de crear una propuesta evaluable; nunca instalar fuentes externas de forma automática.',
    actual_executions:0
  };
  const lead=availableAgents.has(route.lead)?route.lead:null;
  const collaborators=route.collaborators.filter(x=>availableAgents.has(x));
  const reviewer=availableAgents.has(route.reviewer)?route.reviewer:null;
  const chosen=route.skills.filter(x=>availableSkills.has(x)).slice(0,3);
  const missing=[...new Set([...(lead?[]:[route.lead]),...route.skills.filter(x=>!availableSkills.has(x))])];
  return {
    status:missing.length?'NEEDS_REVIEW':'REUSE',task,intent:route.id,lead,collaborators,reviewer,
    skills:chosen,missing_catalog_entries:missing,
    delegation:[...new Set([lead,...collaborators].filter(Boolean))].map(role=>({
      role, action:'read role prompt, claim scoped task if execution is available, return evidence'
    })),
    source_candidates:route.sources.map(id=>({id,installed:false,verified_for_this_task:false})),
    proposal:missing.length?'AUDIT_EXISTING_THEN_SKILL_FACTORY':null,
    expected_result:route.deliverable,
    controls:['read AGENTS.md and client brief','no unreviewed external execution','security gate + license check before adoption','independent QA','no publication, spend or secrets access without specific authorization'],
    actual_executions:0
  };
}
async function createProposal(task, plan) {
  if (plan.status !== 'CAPABILITY_GAP' && !plan.missing_catalog_entries?.length) return null;
  const slug=normalize(task).replace(/[^a-z0-9 ]/g,'').split(' ').filter(Boolean).slice(0,7).join('-').slice(0,55) || 'unspecified';
  const path=resolve(ROOT,'docs/capability-proposals',slug+'.md');
  const safe=String(task).replace(/[\r\n]+/g,' ').replace(/</g,'&lt;').slice(0,500);
  const document=[
    '# Propuesta de capacidad (NO instalada, NO validada)','',
    '> Necesidad original: '+safe,'',
    'Estado: DRAFT / NEEDS_REVIEW. No es una skill activa ni un agente ejecutado.','',
    '## Auditoría de reutilización',
    '- Revisar skills/ y team/; probar primero las capacidades existentes.',
    '- Si no cubren el caso, activar skills/aem-skill-factory/SKILL.md y skills/skill-creator/SKILL.md.',
    '- Documentar el diferencial, los inputs, outputs, riesgos y casos negativos.','',
    '## Criterios para promover',
    '- Procedimiento específico, licencia/procedencia y dueño de la capacidad.',
    '- Pruebas semánticas y regresión (no solo frontmatter).',
    '- Si se trae código externo: docs/security/third-party-skill-gate.md.',
    '- Crear PR revisable; generar puentes mediante npm run agents:build y ejecutar npm run check.','',
    '## Métricas por demostrar',
    '- Calidad aceptada, tasa de retrabajo, ahorro medido, creatividad y resultado comercial.',
    '- Baseline actual: UNKNOWN. Nada de estas métricas está probado.'
  ].join('\n')+'\n';
  await mkdir(resolve(ROOT,'docs/capability-proposals'),{recursive:true});
  await writeFile(path,document,{flag:'wx'});
  return 'docs/capability-proposals/'+slug+'.md';
}
async function main(){
  const args=process.argv.slice(2);
  const draft=args.includes('--draft');
  const task=args.filter(x=>x!=='--draft' && x!=='--json').join(' ').trim();
  if(!task){console.error('Uso: npm run route -- [--json] [--draft] "tarea"');process.exitCode=2;return;}
  const plan=makePlan(task,await loadSkills(ROOT),await loadAgents(ROOT));
  if(draft) {
    try {plan.draft_path=await createProposal(task,plan);}
    catch(e){console.error('No se creó propuesta: '+e.message);process.exitCode=1;return;}
  }
  console.log(JSON.stringify(plan,null,2));
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) await main();
