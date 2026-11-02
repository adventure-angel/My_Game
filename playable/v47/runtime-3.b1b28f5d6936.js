window.StarCandyBoot.stage('载入程序 3/10');

/* Aura belongs to candy; delayed fields belong to board positions. */
class ElementSystem {
 constructor(engine){this.engine=engine;this.turn=0;this.used=0;this.fields=[];this.events=[];}
 static ids=['fire','water','rock','grass','lightning','ice','wind'];
 static reactionLimit=2;
 neighbors(i){return [i-7,i-1,i+1,i+7].filter(j=>this.engine.adjacent(i,j));}
 nearby(i,predicate=()=>true){return this.engine.cells.map((c,j)=>({j,d:Math.abs(j%7-i%7)+Math.abs(Math.floor(j/7)-Math.floor(i/7))})).filter(o=>o.j!==i&&predicate(this.engine.cells[o.j],o.j)).sort((a,b)=>a.d-b.d||a.j-b.j).map(o=>o.j);}
 begin(){this.turn++;this.used=0;this.events=[];}
 attach(i,e){const c=this.engine.cells[i];if(c)c.aura={e,until:this.turn+2};}
 field(i,type,e){if(this.fields.some(f=>f.i===i)||this.fields.length>=4)return;this.fields.push({i,type,e,born:this.turn,until:this.turn+2,left:type==='burn'?2:1});}
 pulse(entries,clear=new Set(),protectedCells=new Map()){
  const old=this.engine.cells.map(c=>c.aura?.e),seen=new Set();
  const add=i=>{if(i>=0&&i<49&&!protectedCells.has(i))clear.add(i);};
  for(const {i,e} of entries){
   if(seen.has(i)||clear.has(i)||protectedCells.has(i))continue;seen.add(i);
   const c=this.engine.cells[i],field=this.fields.find(f=>f.i===i);if(!c)continue;
   if(field){
    let hit=[];
    if(field.type==='seed'&&e==='fire')hit=[i,...this.neighbors(i)];
    if(field.type==='seed'&&e==='lightning')hit=[i,...this.nearby(i).slice(0,2)];
    if(field.type==='burn'&&e==='water')hit=this.neighbors(i).slice(0,field.left);
    if(field.type==='crystal'&&e===field.e)hit=[i,...this.nearby(i).slice(0,1)];
    if(hit.length&&this.used<ElementSystem.reactionLimit){this.used++;hit.forEach(add);this.fields=this.fields.filter(f=>f!==field);this.events.push({i,a:field.type==='seed'?'grass':field.type==='burn'?'fire':'rock',b:e,type:'relay',name:'元素接力'});continue;}
   }
   const a=old[i];if(!a||a===e){this.attach(i,e);continue;}
   const [type,name]=StarCandyEffects.reaction(a,e);
   if(type==='replace'){this.attach(i,e);continue;}
   if(this.used>=ElementSystem.reactionLimit){continue;}
   this.used++;delete c.aura;add(i);this.events.push({i,a,b:e,type,name});
   const near=this.neighbors(i),other=a==='wind'||a==='rock'?e:a;
   if(type==='steam')near.filter(j=>Math.floor(j/7)===Math.floor(i/7)).forEach(add);
   if(type==='blast')near.filter(j=>j%7===i%7).forEach(add);
   if(type==='melt')this.nearby(i,(c,j)=>!clear.has(j)).slice(0,1).forEach(add);
   if(type==='fracture')[-8,-6,6,8].map(d=>i+d).filter(j=>j>=0&&j<49&&Math.abs(j%7-i%7)===1).slice(0,2).forEach(add);
   if(type==='conduct')this.nearby(i,c=>[1,4].includes(c.k)).slice(0,2).forEach(add);
   if(type==='bloom')this.field(i,'seed','grass');
   if(type==='burn')this.field(i,'burn','fire');
   if(type==='crystal')this.field(i,'crystal',other);
   if(type==='diffuse')near.filter(j=>!clear.has(j)&&!this.engine.cells[j].s&&!this.engine.cells[j].buff&&!seen.has(j)).slice(0,2).forEach(j=>{this.attach(j,other);seen.add(j);});
   if(type==='dew'||type==='grow')this.nearby(i,(c,j)=>!clear.has(j)&&!c.s&&!c.buff&&(type!=='grow'||c.k===3)).slice(0,type==='dew'?2:1).forEach(j=>this.engine.cells[j].buff={type,until:this.turn+2});
  }return clear;
 }
 dyeTargets(plan,clear){
  const entries=[],chosen=new Set();
  for(const run of plan.matches||[]){
   const middle=run.ids[Math.floor(run.ids.length/2)],candidates=new Set();
   for(const source of run.ids)for(const i of this.neighbors(source))if(!clear.has(i)&&!plan.creates.has(i)&&!chosen.has(i))candidates.add(i);
   // Deterministic center-out targeting, with existing different auras first.
   const e=ElementSystem.ids[this.engine.cells[run.ids[0]].k];
   const rank=i=>Math.abs(i%7-middle%7)+Math.abs(Math.floor(i/7)-Math.floor(middle/7));
   const priority=i=>Number(!!this.engine.cells[i].aura&&this.engine.cells[i].aura.e!==e);
   const limit=Math.min(4,run.ids.length-1);
   [...candidates].sort((a,b)=>priority(b)-priority(a)||rank(a)-rank(b)||a-b).slice(0,limit).forEach(i=>{chosen.add(i);entries.push({i,e});});
  }return entries;
 }
 wave(plan,expanded,emit=false){
  this.events=[];const clear=expanded.clear,baseClear=new Set(clear);
  for(const i of [...clear]){const c=this.engine.cells[i];if(c.buff){const targets=c.buff.type==='dew'?this.neighbors(i).slice(0,1):this.neighbors(i).filter(j=>Math.floor(j/7)===Math.floor(i/7));targets.forEach(j=>{if(!plan.creates.has(j))clear.add(j);});delete c.buff;}}
  if(emit)this.pulse(this.dyeTargets(plan,clear),clear,plan.creates);
  expanded.elementClear=new Set([...clear].filter(i=>!baseClear.has(i)));return expanded;
 }
 end(){
  const clear=new Set();this.events=[];
  this.fields=this.fields.filter(f=>{
   if(f.born===this.turn)return true;
   if(f.type==='seed'){[f.i,...this.neighbors(f.i)].forEach(i=>clear.add(i));this.events.push({i:f.i,a:'water',b:'grass',name:'种子绽放'});return false;}
   if(f.type==='burn'){const j=this.neighbors(f.i)[2-f.left];if(j!==undefined)clear.add(j);f.left--;this.events.push({i:f.i,a:'fire',b:'grass',name:'余焰'});return f.left>0;}
   return f.until>this.turn;
  });
  this.engine.cells.forEach(c=>{if(c.aura?.until<=this.turn)delete c.aura;if(c.buff?.until<=this.turn)delete c.buff;});return clear;
 }
 export(){return {turn:this.turn,used:this.used,fields:this.fields};}
 restore(x){this.turn=Number.isInteger(x?.turn)&&x.turn>=0?x.turn:0;this.used=Number.isInteger(x?.used)?Math.max(0,Math.min(ElementSystem.reactionLimit,x.used)):0;this.fields=Array.isArray(x?.fields)?x.fields.filter(f=>f&&Number.isInteger(f.i)&&f.i>=0&&f.i<49&&['seed','burn','crystal'].includes(f.type)&&ElementSystem.ids.includes(f.e)&&Number.isInteger(f.born)&&Number.isInteger(f.until)&&[1,2].includes(f.left)).slice(0,4):[];}
}

