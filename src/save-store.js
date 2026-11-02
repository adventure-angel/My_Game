// Local playtest storage. It is NOT an account, a cloud save or an entitlement ledger.
class StarCandySaveStore {
 constructor(){
  this.key='starCandyV2';this.status='ready';this.lastRaw=null;this.lastSavedAt=0;this.lastBackupAt=0;this.revision=0;this.blocked=false;
  this.writer=globalThis.crypto?.randomUUID?.()||('page-'+Date.now()+'-'+Math.random().toString(36).slice(2));
  this.cached=null;this.lastBody='';
  this.lockMode=navigator.locks?.request?'pending':'compare-only';this.releaseLock=null;this.onReady=null;
  window.addEventListener('storage',e=>{if((e.key===this.key||e.key===null)&&e.newValue!==this.lastRaw){this.blocked=true;this.setStatus('conflict');}});
  if(this.lockMode==='pending')this.acquireLock();
  window.addEventListener('pagehide',()=>queueMicrotask(()=>{if(this.releaseLock){this.releaseLock();this.releaseLock=null;this.lockMode='pending';}}));
  window.addEventListener('pageshow',e=>{if(e.persisted&&this.lockMode==='pending')this.acquireLock();});
 }
 acquireLock(){
  try{navigator.locks.request('star-candy-save-writer',{mode:'exclusive',ifAvailable:true},async lock=>{
   if(!lock){this.lockMode='other-window';this.blocked=true;this.setStatus('conflict');return;}
   this.lockMode='exclusive';if(this.onReady)this.onReady();
   await new Promise(resolve=>{this.releaseLock=resolve;});
  }).catch(()=>{this.lockMode='compare-only';if(this.onReady)this.onReady();});}
  catch(_){this.lockMode='compare-only';if(this.onReady)this.onReady();}
 }
 static parse(text){
  if(!text||text.length>262144)return null;
  try{
   const p=JSON.parse(text);
   if(!p||![2,3,4,5].includes(p.version)||!Array.isArray(p.stars)||![12,36,72].includes(p.stars.length)||!p.stars.every(n=>Number.isInteger(n)&&n>=0&&n<=3))return null;
   if(!Number.isInteger(p.unlocked)||p.unlocked<1||p.unlocked>(p.stars.length===72?72:36))return null;
   if(p._local!==undefined&&(!p._local||!Number.isSafeInteger(p._local.revision)||p._local.revision<0||!Number.isFinite(p._local.savedAt)))return null;
   return p;
  }catch(_){return null;}
 }
 setStatus(value){this.status=value;window.dispatchEvent(new CustomEvent('starcandy-storage-status',{detail:value}));}
 load(){
  try{
   this.lastRaw=localStorage.getItem(this.key);
   if(this.lastRaw===null){this.setStatus(this.blocked?'conflict':'ready');return null;}
   const p=StarCandySaveStore.parse(this.lastRaw);
   if(!p){this.blocked=true;this.setStatus('damaged');return null;}
   this.cached=p;this.revision=p._local?.revision||0;this.lastSavedAt=p._local?.savedAt||0;
   const {_local,...body}=p;this.lastBody=JSON.stringify(body);this.setStatus(this.blocked?'conflict':'saved');return p;
  }catch(_){this.blocked=true;this.setStatus('unavailable');return null;}
 }
 write(payload,reason='auto'){
  if(this.blocked||this.lockMode==='pending'||this.lockMode==='other-window')return false;
  try{
   if(localStorage.getItem(this.key)!==this.lastRaw){this.blocked=true;this.setStatus('conflict');return false;}
   const {_local,...body}=payload,serialized=JSON.stringify(body);
   if(serialized===this.lastBody&&this.lastRaw!==null){this.setStatus('saved');return true;}
   const now=Date.now(),next={...body,_local:{revision:this.revision+1,savedAt:now,writer:this.writer}},text=JSON.stringify(next);
   if(!StarCandySaveStore.parse(text)){this.setStatus('invalid');return false;}
   if(this.lastRaw&&StarCandySaveStore.parse(this.lastRaw)&&(now-this.lastBackupAt>=60000||reason!=='auto')){
    const previous=localStorage.getItem(this.key+'.backup1');
    if(StarCandySaveStore.parse(previous))localStorage.setItem(this.key+'.backup2',previous);
    localStorage.setItem(this.key+'.backup1',this.lastRaw);this.lastBackupAt=now;
   }
   localStorage.setItem(this.key,text);
   if(localStorage.getItem(this.key)!==text){this.blocked=true;this.setStatus('conflict');return false;}
   this.lastRaw=text;this.lastBody=serialized;this.cached=next;this.revision=next._local.revision;this.lastSavedAt=now;this.setStatus('saved');return true;
  }catch(_){this.setStatus('unavailable');return false;}
 }
 backups(){
  const out=[];
  try{for(const id of ['backup1','backup2','before-import']){const raw=localStorage.getItem(this.key+'.'+id),p=StarCandySaveStore.parse(raw);if(p)out.push({id,raw,payload:p});}}catch(_){}
  return out;
 }
 replace(payload,expectedRaw){
  // The caller has shown an import preview; preserve the exact old bytes before replacing.
  try{
   if(this.lockMode==='pending'||this.lockMode==='other-window'){this.setStatus('conflict');return false;}
   const current=localStorage.getItem(this.key);
   if(current!==expectedRaw){this.blocked=true;this.setStatus('conflict');return false;}
   if(current!==null){localStorage.setItem(this.key+'.before-import',current);if(localStorage.getItem(this.key+'.before-import')!==current)throw Error('backup');}
   this.lastRaw=current;this.lastBody='';this.blocked=false;
   const parsed=StarCandySaveStore.parse(current);this.revision=Math.max(this.revision,parsed?._local?.revision||0);
   return this.write(payload,'import');
  }catch(_){this.setStatus('unavailable');return false;}
 }
 retry(){
  try{if(localStorage.getItem(this.key)!==this.lastRaw){this.blocked=true;this.setStatus('conflict');return false;}if(this.status==='damaged'||this.status==='conflict')return false;this.blocked=false;return true;}catch(_){this.setStatus('unavailable');return false;}
 }
 currentRaw(){try{return localStorage.getItem(this.key);}catch(_){return undefined;}}
}
const StarCandySave=new StarCandySaveStore();
