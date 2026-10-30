// Altiora: deterministic, read-only capability selection. No network, installs or model calls.
const RULES = [
  {id:'ads', label:'anuncios y producción audiovisual', pattern:/\b(anuncio(s)?|publicidad|reels?|tiktok|spot|cinematograf\w*|video(s)?|audiovisual\w*|postproduccion|motion graphics|comercial(es)?)\b/gu, lead:'creative-ads-director', specialists:['visual-producer','motion-designer','qa-reviewer'], skills:['advertising-concept','storyboarding','ai-video-direction']},
  {id:'growth', label:'captación y crecimiento', pattern:/\b(venta(s)?|crecimiento|captacion|leads?|whatsapp|conversion(es)?|campana(s)?|marketing|clientes|embudo)\b/gu, lead:'commerce-growth-director', specialists:['growth-analyst','business-strategist'], skills:['product-winner-scorecard','whatsapp-lead-to-sale','marketing-analytics']},
  {id:'brand', label:'marca y posicionamiento', pattern:/\b(branding|marca(s)?|identidad|naming|logo(s)?|posicionamiento|brand)\b/gu, lead:'brand-strategist', specialists:['creative-director'], skills:['brand-strategy','brand-positioning','creative-direction']},
  {id:'web', label:'web y experiencias inmersivas', pattern:/\b(web(s)?|landing|sitio(s)?|inmersiv\w*|threejs|nextjs|webgl|react|pagina(s)?|scroll|ecommerce|tienda online)\b/gu, lead:'experience-director', specialists:['ux-researcher','web-engineer','qa-reviewer'], skills:['elite-web-experience-os','conversion-ux','nextjs-architecture']},
  {id:'ops', label:'automatización y sistemas', pattern:/\b(automatiz\w*|workflow(s)?|n8n|crm|integracion(es)?|webhook(s)?|api(s)?|operacion(es)?)\b/gu, lead:'experience-director', specialists:['web-engineer','qa-reviewer'], skills:['altiora-agent-orchestrator','secure-development','verification-before-completion']},
  {id:'quality', label:'diagnóstico y control de calidad', pattern:/\b(error(es)?|bug(s)?|auditoria|seguridad|qa|performance|rendimiento|fallo(s)?|debug|prueba(s)?|test(s)?)\b/gu, lead:'qa-reviewer', specialists:['web-engineer'], skills:['systematic-debugging','verification-before-completion','security-testing']},
  {id:'research', label:'investigación de repositorios y capacidades', pattern:/\b(repositorio(s)?|github|skill(s)?|agente(s)?|subagente(s)?|herramienta(s)?|libreria(s)?|biblioteca(s)?|investigacion|comparar)\b/gu, lead:'altiora-research', specialists:['experience-director'], skills:['altiora-repository-research','aem-skill-factory','altiora-agent-orchestrator']}
];
const STOP = new Set(['para','como','quiero','necesito','necesitamos','crear','hacer','una','uno','unos','unas','este','esta','estas','estos','por','con','del','los','las','que','mas','pero','de','la','el','en','un','y','a','o','se','al','sobre','mi','mis','nuestro','nuestra','todo','todas','todos','mejor','altiora','cliente']);
export const normalize = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const tokens = s => [...new Set(normalize(s).match(/[a-z0-9-]+/g) ?? [])].filter(x=>x.length>=3 && !STOP.has(x));
function relevantScore(queryTokens,text, key='') {
  const haystack=normalize(text);
  const path=normalize(key).replace(/-/g,' ');
  return queryTokens.reduce((n,t) => n + (new RegExp('(?:^|\\W)'+t+'(?:\\W|$)').test(path) ? 4 : 0) + (new RegExp('(?:^|\\W)'+t+'(?:\\W|$)').test(haystack) ? 2 : 0),0);
}
function rankedSkills(task,skills) {
  const t=tokens(task);
  return skills.filter(s=>!s.manual).map(s=>({...s, score:relevantScore(t,s.description,s.name)}))
    .filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name));
}
function selectExternal(task,external) {
  const t=tokens(task);
  return external.filter(r=>r.decision!=='hold').map(r=>({
    id:r.id,url:r.url,revision:r.revision,decision:r.decision,
    installed:r.installed===true, license:r.license??r.observed_license??'VERIFY',
    score:relevantScore(t,r.purpose,r.id)
  })).filter(r=>r.score>=2).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id))
    .slice(0,2).map(({score,...r})=>({...r,status:'REFERENCE_ONLY',approval_required:true}));
}
export function planTask(task,{skills=[],agents=[],external=[]}={}) {
  if(typeof task!=='string'||task.trim().length===0||task.length>5000) throw Error('Encargo obligatorio (1–5000 caracteres)');
  const text=normalize(task);
  const matches=RULES.map(rule=>({...rule,hits:[...text.matchAll(rule.pattern)].length}))
    .filter(r=>r.hits>0).sort((a,b)=>b.hits-a.hits||RULES.findIndex(x=>x.id===a.id)-RULES.findIndex(x=>x.id===b.id));
  const primary=matches[0]??null;
  const available=new Map(skills.filter(s=>!s.manual).map(s=>[s.name,s]));
  const agentIds=new Set(agents.map(a=>a.id));
  const selected=(primary?.skills??[]).filter(s=>available.has(s)).slice(0,3);
  const semantic=rankedSkills(task,skills);
  if(!primary) for(const s of semantic) {if(selected.length>=3)break;if(s.score>=4)selected.push(s.name);}
  else if(selected.length<3) for(const s of semantic){if(selected.length>=3)break;if(!selected.includes(s.name)&&s.score>=4)selected.push(s.name);}
  const missing=(primary?.skills??[]).filter(s=>!available.has(s));
  const lead=primary && agentIds.has(primary.lead)?primary.lead:'experience-director';
  const specialists=(primary?.specialists??[]).filter(a=>agentIds.has(a)).slice(0,3);
  const gap=missing.length>0||selected.length===0;
  const repeatable=/\b(repetir|reutiliz|sistem|automatiz|siempre|cada|frecuent)/.test(text);
  const needsReview=!primary||gap;
  const routes=matches.slice(0,3).map(m=>m.id);
  return {
    schema_version:1, task:task.trim(), intent:primary?.id??'unclassified',
    matched_intents:routes, confidence:primary?'RULE_MATCH':'UNVERIFIED',
    lead:agentIds.has(lead)?lead:null, specialists,
    skill_selection:selected.map(name=>({name,path:'skills/'+name+'/SKILL.md',status:'AVAILABLE_NOT_EXECUTED'})),
    missing_expected_skills:missing,
    capability_decision:!needsReview?'REUSE':repeatable?'EVALUATE_FACTORY_DRAFT':'RESEARCH_AND_SCOPE',
    factory:needsReview?'skills/aem-skill-factory/SKILL.md':null,
    external_candidates:selectExternal(task,external),
    execution_mode:'PLAN_ONLY',
    next_steps: [
      'Leer AGENTS.md, brief y skills elegidas; verificar encargo y permisos',
      ...(primary?.id==='ads'?['Consultar creative-ads-os/WORK_ROUTER.md']:[]),
      ...(needsReview?['Auditar solapamiento; investigar la capacidad faltante y proponer REUSE/IMPROVE/CREATE/DEFER antes de crear una skill']:[]),
      'Delegar solo si hay tareas independientes y herramientas de subagentes disponibles; registrar responsable y evidencia',
      'Ejecutar validaciones de la entrega y revisión humana de los hitos críticos'
    ],
    protected_actions:['instalar software de terceros','ejecutar código externo no auditado','publicar','gastar dinero','enviar mensajes a clientes','cambiar accesos o permisos','fusionar a main sin revisión'],
    caveat:'Este resultado es una recomendación estática: no activa agentes, no prueba que una skill funcione y no ejecuta repositorios.'
  };
}
