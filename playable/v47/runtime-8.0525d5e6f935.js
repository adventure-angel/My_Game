window.StarCandyBoot.stage('载入程序 8/10');

// Opt-in, local-only diagnostics. No network endpoint, fingerprint, account or raw stack trace.
class StarCandyPlaytestLog {
 constructor(){
  this.key='starCandyPlaytestV1';this.enabled=false;this.events=[];this.session=globalThis.crypto?.randomUUID?.()||String(Date.now());this.sequence=0;this.storageOK=true;
  try{const raw=JSON.parse(localStorage.getItem(this.key)||'null');if(raw?.version===1){this.enabled=raw.enabled===true;this.events=Array.isArray(raw.events)?raw.events.map(e=>this.clean(e)).filter(Boolean):[];this.prune();}}catch(_){this.storageOK=false;}
  this.record('session_start');
  window.addEventListener('error',e=>this.record('error',{code:e.target&&e.target!==window?'asset_load':'script'}),true);
  window.addEventListener('unhandledrejection',()=>this.record('error',{code:'promise'}));
 }
 clean(e){
  const names=['session_start','recording_enabled','route_view','level_start','level_resume','level_end','level_leave','session_hidden','session_return','skill_use','room_place','room_light','room_event','partner_unlock','backup_export','backup_import','purchase_unavailable','ad_unavailable','save_issue','prologue_end','error'];
  if(!e||!names.includes(e.name)||!Number.isFinite(e.at)||e.at>Date.now()+300000||typeof e.id!=='string'||e.id.length>100)return null;
  const p={};
  for(const k of ['level','partner','score','moves','durationSec','stars','item','coins'])if(Number.isFinite(e.props?.[k]))p[k]=Math.max(0,Math.min(1e9,Math.round(e.props[k])));
  for(const k of ['won','firstClear','trial','skipped','resumed'])if(typeof e.props?.[k]==='boolean')p[k]=e.props[k];
  const choices={route:['splash','home','map','partners','records','challenge','game','result','prologue'],mode:['story','time'],code:['asset_load','script','promise','unavailable','invalid','damaged','conflict','preview_only'],product:['mirror','monthCard','yuan1','yuan6','yuan12','yuan30','yuan68','yuan128','yuan328','yuan648'],reason:['navigation','new_round','page_hidden']};
  for(const [k,values] of Object.entries(choices))if(values.includes(e.props?.[k]))p[k]=e.props[k];
  if(typeof e.props?.run==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(e.props.run))p.run=e.props.run;
  return {id:e.id,at:e.at,name:e.name,props:p};
 }
 prune(){const cutoff=Date.now()-7*86400000;this.events=this.events.filter(e=>e.at>=cutoff).slice(-300);}
 save(){this.prune();try{localStorage.setItem(this.key,JSON.stringify({version:1,enabled:this.enabled,events:this.events}));this.storageOK=true;}catch(_){this.storageOK=false;}}
 record(name,props={}){if(!this.enabled)return;const e=this.clean({id:this.session+'-'+(++this.sequence),at:Date.now(),name,props});if(e){this.events.push(e);this.save();}}
 toggle(){this.enabled=!this.enabled;if(!this.enabled){this.events=[];try{localStorage.removeItem(this.key);}catch(_){this.storageOK=false;}}this.save();if(this.enabled)this.record('recording_enabled');}
 clear(){this.events=[];this.save();}
 report(){this.prune();return {format:'star-candy-playtest-report',version:1,build:StarCandyRelease.build,createdAt:new Date().toISOString(),collection:'opt-in-local-only',notes:'本机最近7天、最多300条，不代表全体玩家或留存率；隐藏和离开不是失败。',events:this.events};}
}
const StarCandyPlaytest=new StarCandyPlaytestLog();

