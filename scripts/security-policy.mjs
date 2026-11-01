// Política pura para resultados de SkillSpector y catálogo de repos externos.
export function assessScan(report) {
  if (!report || typeof report !== 'object' || Array.isArray(report)) return {allowed:false,reason:'Informe inválido'};
  const risk=report.risk_assessment;
  if (!risk || typeof risk !== 'object') return {allowed:false,reason:'risk_assessment ausente'};
  if (!['SAFE','CAUTION','DO_NOT_INSTALL'].includes(risk.recommendation)) return {allowed:false,reason:'Recomendación desconocida'};
  if (!Number.isFinite(risk.score) || risk.score<0 || risk.score>100) return {allowed:false,reason:'Puntuación inválida'};
  const issues=Array.isArray(report.issues)?report.issues.length:null;
  if (issues===null) return {allowed:false,reason:'Hallazgos no enumerados'};
  return {allowed:risk.recommendation==='SAFE',reason:risk.recommendation==='SAFE'?'Escaneo estático reportó SAFE; todavía requiere revisión humana y de licencias.':`Bloqueado: ${risk.recommendation}`,score:risk.score,severity:risk.severity,findings:issues};
}
export function checkSource(source) {
  const problems=[];
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(source?.id||'')) problems.push('id');
  if (source?.url!==`https://github.com/${source?.id}`) problems.push('url');
  if (!/^[0-9a-f]{40}$/.test(source?.revision||'')) problems.push('revision');
  if (!['priority','pilot','reference','hold'].includes(source?.decision)) problems.push('decision');
  if (typeof source?.license!=='string' || source.license.length<2) problems.push('license');
  if (source?.installed!==false) problems.push('installed must remain false until installation evidence');
  if (source?.scan_status!=='NOT_RUN') problems.push('scan_status must be NOT_RUN until scan evidence');
  return problems;
}
