window.StarCandyBoot.stage('载入程序 10/10');


(() => {
 'use strict';
 const $=id=>document.getElementById(id),engine=new CandyEngine();
 const elements=new ElementSystem(engine); let skillMode=null,mirrorElement='fire',trialBackup=null,trialPending=false,reactionText='';
 const skillNames=['月相迁移','灵泉点染','焰心引燃','青芽萌生','万象折光'];
 const skillCopies=['将一颗糖的附着移到另一颗无附着普通糖。','为选中的糖施加水元素，可触发反应。','为选中的糖施加火元素，能提前点燃种子。','为选中的糖施加草元素，与水配合留下种子。','把已有附着转成选定元素，安排下一次反应。'];
 const palette=['#ff8953','#35c2fa','#ffc842','#74ce58','#b27bf6','#b8edff','#8af1d5'];
 const names=['火焰','水滴','岩星','草芽','雷光','冰晶','风旋'];
 const paths=[
  '<path d="M32 51 13 33C-1 18 20 5 32 19 44 5 65 18 51 33Z"/>',
  '<path d="M32 7C26 18 13 29 13 40a19 19 0 0 0 38 0C51 29 38 18 32 7Z"/>',
  '<path d="m32 5 8 17 19 3-14 14 3 19-16-9-17 9 4-19L5 25l19-3Z"/>',
  '<path d="M32 56V29M31 39C7 42 8 15 9 14c21-2 28 14 22 25ZM33 32C31 12 51 8 57 9c1 22-12 27-24 23Z"/>',
  '<path d="M45 7A25 25 0 1 0 57 43 25 25 0 0 1 45 7Z"/>',
  '<path d="M33 5c2 14 15 17 10 28 6-3 9-6 9-11 16 23 2 38-20 38S5 40 16 26c1 8 4 10 7 10-6-17 10-23 10-31Z"/>'
 ];
 paths[0]=paths[5];paths[4]='<path d="M37 4 12 37H29L23 61 53 24H35Z"/>';paths[5]='<path d="M32 5 53 20V45L32 59 11 45V20Z"/><path d="M32 5V59M11 20 53 45M53 20 11 45" fill="none"/>';paths.push('<path d="M8 23H39C56 23 55 5 43 8 34 10 38 18 43 16M6 33H48C64 33 62 53 48 52 39 51 42 43 47 44M12 43H29C44 43 40 62 28 59" fill="none" stroke-width="6" stroke-linecap="round"/>');
 let jewelSerial=0;
 function icon(k){
  const id='jewel-'+(++jewelSerial),colors=[['#ffe3ac','#ff8953','#b12e47'],['#d1ffff','#35c2fa','#2154aa'],['#fff8b9','#ffc842','#b96d17'],['#e2ffc2','#74ce58','#23734c'],['#f0d7ff','#b27bf6','#57309d'],['#f1ffff','#b8edff','#478bc4'],['#e5fff4','#8af1d5','#328c89']][k];
  return '<svg viewBox="0 0 64 68" aria-hidden="true"><defs><linearGradient id="'+id+'" x1=".15" y1="0" x2=".8" y2="1"><stop stop-color="'+colors[0]+'"/><stop offset=".42" stop-color="'+colors[1]+'"/><stop offset="1" stop-color="'+colors[2]+'"/></linearGradient><linearGradient id="'+id+'-shine" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><g transform="translate(0 4)" fill="'+colors[2]+'" stroke="'+colors[2]+'" stroke-width="3" stroke-linejoin="round">'+paths[k]+'</g><g fill="url(#'+id+')" stroke="'+colors[0]+'" stroke-width="1.5" stroke-linejoin="round">'+paths[k]+'</g><g transform="translate(5 3) scale(.82)" fill="none" stroke="'+colors[0]+'" stroke-opacity=".45" stroke-width="1">'+paths[k]+'</g><ellipse cx="24" cy="24" rx="6" ry="9" fill="url(#'+id+'-shine)" transform="rotate(35 24 24)"/><path d="m42 39 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#fff" opacity=".62"/></svg>';
 }
 const partners=[{name:'月见',hair:'#b3a1df',dark:'#77649e',dress:'#d5c6ef',line:'慢慢来，星光一直在。'},{name:'澪',hair:'#98c5da',dark:'#527d9c',dress:'#c2ddec',line:'每一滴灵感，都有回响。'},{name:'小焰',hair:'#e6b090',dark:'#ab7057',dress:'#f2c9b2',line:'让我们再点亮一颗星！'},{name:'青芽',hair:'#adc696',dark:'#6c8b64',dress:'#d9e6bb',line:'小小的心愿，也会发芽。'}];
 partners.push({name:'绯镜',line:'换一个角度，让命运折射出新的光。'});
 function portrait(p){return '<span class="portrait-art portrait-'+p+'" role="img" aria-label="'+partners[p].name+'"></span>';}
 // 37–72: three return journeys. Existing 1–36 indices never change.
const returnJourneyPlaces=['暮光工坊','雨后温室','流云长桥','星笺邮亭','篝火小径','苔光集市','晚风书屋','萤灯钟庭','晨潮栈桥','深蓝花圃','极光观测台','归航灯塔'];
const journeyPostcards=[
 ['暮色中的第一盏灯','月见','工坊师傅认出了我们带回的夜灯。他说，灯上的星纹不必再修了，因为它已经找到了一个会等它亮起的家。'],
 ['雨停以后','澪','温室的玻璃上挂着细小水珠。澪把新的旋律哼了一遍，约好回家后，和八音盒的歌声一起听。'],
 ['风把笑声留下','小焰','云桥上的风还是很大。这一次，小焰记得先扶好大家的帽子。照片还没拍，笑声就已经响了起来。'],
 ['寄给未来的我们','月见','我们在信纸上写下下一次想去的地方。邮亭主人把信轻轻封好：等你们再回来，它就会变成一段新的故事。'],
 ['不熄的篝火','青芽','营地里的朋友添了一根木柴。青芽说，小屋的烛台和这里的火光很像，都会为晚归的人留一个位置。'],
 ['叶片下的小秘密','青芽','集市里新长出一簇小蘑菇。我们没有把它摘走，只记下它今天的模样，让它也能有自己的明天。'],
 ['一起读完这一页','澪','书屋的旧书签还夹在原来的地方。澪没有急着翻页，她说，等大家都坐好了，再一起读那个温柔的结尾。'],
 ['钟声慢了一拍','月见','钟庭今晚的灯亮得很早。月见听见最后一声钟响，笑着说：慢一点也没关系，我们一直在同一段旅途上。'],
 ['第一缕晨潮','小焰','海水把脚印轻轻抹平。小焰又在沙上画了一颗星：潮水可以带走它，我们会记得一起画过的样子。'],
 ['留在水里的光','绯镜','星晶映出了不同的颜色。绯镜把它转向月光：同一段故事，从不同方向看，都能找到新的光。'],
 ['更远处的星星','澪','观测台的星图添了一条新的轨迹。我们没有为下一次出发定下日期，只把想一起看见的星星圈了起来。'],
 ['这一次，回家','月见','七十二次小小的冒险，终于写满了这一册。窗边的灯还亮着，猫咪听见门响抬起头。欢迎回家，我们的故事都在这里。']
].map(([name,speaker,story],i)=>({id:'return-'+i,name,speaker,story,place:returnJourneyPlaces[i],scene:Math.floor(i/4),level:39+i*3}));
const returnIce={
 bridge:[8,9,10,11,12,36,37,38,39,40],window:[9,10,11,16,18,23,24,25],
 cross:[3,10,17,21,22,23,24,25,26,27,31,38,45],corners:[0,1,7,5,6,13,35,42,43,41,47,48],
 path:[3,9,15,21,29,37,45],ring:[9,10,11,16,18,23,25,30,31,32],
 waves:[7,9,11,13,21,23,25,27,35,37,39,41],steps:[1,9,17,25,33,41],
 frame:[8,9,10,11,12,15,19,22,26,29,33,36,37,38,39,40],stars:[3,15,19,24,29,33,45]
};
// tuple: title, moves, score, color, count, ice layout, reactions, allowed reaction types.
const returnLevelSpecs=[
 ['再见星火',27,4200,0,18,'',0,''],['灯影长廊',28,4500,-1,0,'path',0,''],['暮色留灯',30,5000,0,16,'window',1,'steam'],
 ['雨滴轻响',27,4400,1,20,'',0,''],['温室新芽',29,4700,-1,0,'steps',2,'bloom'],['雨后花语',31,5200,1,18,'ring',2,'any'],
 ['桥边晨风',27,4500,6,16,'',0,''],['云上的脚印',29,4900,-1,0,'bridge',1,'steam'],['风中相约',31,5400,2,20,'corners',2,'any'],
 ['信纸星纹',28,4600,2,22,'window',0,''],['未寄出的心愿',30,5200,-1,0,'cross',2,'bloom'],['写给明天',32,5700,4,18,'ring',2,'any'],
 ['篝火未眠',28,4700,0,24,'steps',0,''],['林间暖意',30,5200,-1,0,'path',3,'steam'],['火光里的约定',32,5800,1,20,'frame',2,'any'],
 ['苔色微光',28,4900,3,24,'',0,''],['叶下水珠',30,5400,-1,0,'waves',2,'bloom'],['集市小夜曲',32,5900,3,20,'corners',3,'any'],
 ['书签与晚风',29,5000,6,20,'steps',0,''],['翻开旧故事',31,5500,-1,0,'window',3,'steam'],['故事仍在继续',33,6100,2,24,'cross',2,'any'],
 ['萤灯初亮',29,5200,4,22,'path',0,''],['慢一拍的钟声',31,5700,-1,0,'ring',3,'bloom'],['森林的晚安',33,6300,1,22,'frame',3,'any'],
 ['栈桥晨露',29,5400,1,26,'steps',0,''],['潮声穿过冰纹',31,5900,5,20,'waves',0,''],['向海风问好',33,6500,-1,0,'bridge',3,'any'],
 ['深蓝的回声',30,5600,5,24,'window',0,''],['星晶的另一面',32,6100,-1,0,'corners',3,'steam'],['留住一束光',34,6700,4,24,'ring',3,'any'],
 ['远星来信',30,5800,2,28,'path',0,''],['极光接力',32,6400,-1,0,'cross',3,'bloom'],['一起看见星空',34,7000,6,22,'frame',3,'any'],
 ['灯塔就在前方',31,6000,0,26,'stars',0,''],['归航的星线',33,6600,-1,0,'waves',3,'any'],['欢迎回家',35,7200,2,26,'frame',3,'any']
];
const returnJourneyLevels=returnLevelSpecs.map(([name,moves,goal,color,count,ice,reactions,type],i)=>{
 const group=Math.floor(i/3),turn=i%4,pool=i<12?[0,1,2,3,4,6]:i<24?[0,1,2,3,4,6]:[0,1,2,3,4,5,6];
 const opening=type==='bloom'?'water':color===1?'water':color===2?'star':color===3?'grass':'fire';
 const auras=type==='bloom'?[[3,'grass'],[24,'grass'],[45,'water']]:[[3,'water'],[24,'grass'],[45,'fire']];
 return {title:returnJourneyPlaces[group]+' · '+name,landmark:12+group,stage:i%3,moves,goal,color,count,pool,opening,turn,auras,
  managedGoals:true,ice:ice?[...returnIce[ice]]:[],reactions,types:reactions?[type]:[],stars:i%3===2?[5,10]:[4,9],recommend:type==='bloom'?1:0,
  tip:reactions?(type==='bloom'?'用水糖靠近草附着，或请澪施加水；每次绽芽都会推进目标。':type==='steam'?'先找已有水附着的位置，再让火糖消除靠近它；水火蒸腾计入目标。':'先安排反应，再清理边角薄霜。月见可以移动附着，所有目标都能靠普通消除完成。'):ice?'先在结霜格上完成消除；直线糖能同时清理多个位置。':'把目标颜色连成四颗，留下直线糖，再借连锁收集更多星光。'};
});

 const landmarkLevels=[
  ['星灯工坊',12,900,-1,0],['花溪温室',16,1600,-1,0],['云桥观景台',18,2400,2,8],['月光邮局',24,3400,4,18],
  ['萤火营地',25,3800,3,22],['蘑菇集市',25,4200,0,24],['古树图书馆',25,4600,5,26],['林间钟楼',24,5000,1,28],
  ['潮汐码头',24,5400,4,30],['珊瑚花园',25,5800,5,32],['星轨天文台',25,6200,0,34],['约定灯塔',26,6800,2,38]
 ].map(([title,moves,goal,color,count])=>({title,moves,goal,color,count}));
  const levels=landmarkLevels.flatMap((base,landmark)=>[0,1,2].map(stage=>({
   ...base,landmark,stage,title:base.title+' · '+['寻光','共鸣','心愿'][stage],
   goal:Math.round(base.goal*[1,1.18,1.35][stage]/50)*50,moves:base.moves+[0,2,3][stage],
   count:base.color<0?0:Math.ceil(base.count*[1,1.12,1.25][stage])
  })));
  levels.push(...returnJourneyLevels);
   const defaults={version:5,prologueSeen:false,music:true,unlocked:1,stars:Array(levels.length).fill(0),bestTime:0,partner:0,sound:true,soundDefaultVersion:1,motion:true,vibration:false,snapshot:null,weeklyPending:null};
 let data={...defaults,stars:[...defaults.stars]},storageOK=true,migrated=false;
 try{
  window.StarCandyBoot.stage('读取本机进度');
 const raw=StarCandySave.load();storageOK=['ready','saved'].includes(StarCandySave.status);
  if(raw&&[2,3,4,5].includes(raw.version)){
   // Existing previews can opt into the new story from settings without interruption.
   if(typeof raw.prologueSeen!=='boolean')data.prologueSeen=true;
   for(const key of ['music','motion','vibration','prologueSeen'])if(typeof raw[key]==='boolean')data[key]=raw[key];
   // Apply the requested sound-on default once to existing preview saves too.
   // Subsequent visits preserve the user's explicit on/off selection.
   if(raw.soundDefaultVersion===1&&typeof raw.sound==='boolean')data.sound=raw.sound;
   for(const [key,max] of [['unlocked',levels.length],['partner',4],['bestTime',1e9]])if(Number.isInteger(raw[key])&&raw[key]>=0&&raw[key]<=max)data[key]=raw[key];
   data.unlocked=Math.max(1,data.unlocked);
   if(Array.isArray(raw.stars)){
     if(raw.version>=4&&[36,72].includes(raw.stars.length))data.stars=Array.from({length:levels.length},(_,i)=>[0,1,2,3].includes(raw.stars[i])?raw.stars[i]:0);
     else if(raw.stars.length===12){
      data.stars=raw.stars.flatMap(x=>Array(3).fill([0,1,2,3].includes(x)?x:0)).concat(Array(36).fill(0));
      data.unlocked=raw.stars.every(Boolean)?37:Math.min(36,(Math.min(12,data.unlocked)-1)*3+1);
     }
    }
    let cleared=0;while(cleared<data.stars.length&&data.stars[cleared])cleared++;data.unlocked=Math.max(data.unlocked,Math.min(levels.length,cleared+1));
    if(raw.economy&&typeof raw.economy==='object')data.economy=raw.economy;
    if(raw.stamina&&typeof raw.stamina==='object')data.stamina=raw.stamina;
    if(raw.monthCard&&typeof raw.monthCard==='object')data.monthCard=raw.monthCard;
   if(raw.home&&typeof raw.home==='object')data.home=raw.home;
   const snap=raw.snapshot&&{...raw.snapshot,level:raw.version>=4?raw.snapshot.level:raw.snapshot.mode==='story'?raw.snapshot.level*3:0};
     if(validSnapshot(snap))data.snapshot=snap;else if(raw.snapshot)migrated=true;
     data.weeklyPending=normalizeWeeklyPending(raw.weeklyPending);
  }
 }catch(_){storageOK=false;}
 function persist(){storageOK=StarCandySave.write({...data,partner:trialBackup?trialBackup.partner:state.challenge?.oldPartner??data.partner});return storageOK;}
 function validSnapshot(x){
  return x&&validChapterSnapshot(x.chapter)&&['story','time'].includes(x.mode)&&Number.isInteger(x.level)&&x.level>=0&&x.level<levels.length&&Array.isArray(x.cells)&&x.cells.length===49&&x.cells.every(c=>c&&Number.isInteger(c.k)&&c.k>=0&&c.k<7&&(!c.aura||(ElementSystem.ids.includes(c.aura.e)&&Number.isInteger(c.aura.until)))&&(!c.buff||(['dew','grow'].includes(c.buff.type)&&Number.isInteger(c.buff.until)))&&['','row','col','bomb','rainbow'].includes(c.s))&&['score','moves','remaining','energy','hammers','shuffles'].every(k=>Number.isFinite(x[k])&&x[k]>=0&&x[k]<=1e9)&&x.energy<=50&&x.hammers<=2&&x.shuffles<=1&&x.remaining<=90000&&x.moves<=40&&Array.isArray(x.collected)&&x.collected.length===7&&x.collected.every(n=>Number.isInteger(n)&&n>=0&&n<1e6);
 }
 let state={mode:'story',level:0,score:0,moves:22,remaining:90000,energy:0,collected:Array(7).fill(0),hammers:2,shuffles:1,active:false,paused:false,busy:false,selected:-1,hammer:false,epoch:0};
 let lastTick=performance.now(),lastSave=0,lastAction=performance.now(),toastTimer,focusBefore=null,audio=null;
 let route='splash',lastResult=null,routingReady=false,preparation=null,chapterView=null;
 const board=$('board'),veil=$('veil'),dialog=$('dialog'),app=document.querySelector('.app');
 document.body.classList.toggle('reduced',!data.motion);
 function setPartner(p){
  if(state.active&&state.challenge&&p!==0){toast('周赛统一使用月见');return;}
  if(!Number.isInteger(p)||p<0||p>=partners.length)return;if(!partnerOwned(p)&&!(state.trial&&p===data.partner)){showPartnerOffer(p);return;}if(state.trial&&p!==data.partner)return;skillMode=null;data.partner=p;persist();$('heroArt').innerHTML=portrait(p);$('partner').innerHTML=portrait(p);$('partnerName').textContent=partners[p].name+' · 星愿共鸣';
  $('companions').innerHTML=partners.map((x,i)=>!partnerOwned(i)?'':'<button class="companion '+(i===p?'active':'')+'" data-partner="'+i+'" aria-label="选择'+x.name+'" aria-pressed="'+(i===p)+'">'+portrait(i)+'<span>'+x.name+'</span></button>').join('');
 }
 function render(animate=true){
  const existing=new Map([...board.querySelectorAll('.tile')].map(el=>[Number(el.dataset.id),el])),live=new Set();
  engine.cells.forEach((c,i)=>{
   live.add(c.id);let el=existing.get(c.id);
   if(!el){el=document.createElement('button');el.type='button';el.className='tile'+(animate?' enter':'');el.dataset.id=c.id;el.innerHTML='<span class="tile-face">'+icon(c.k)+'<span class="special">'+(c.s==='bomb'?'✦':c.s==='rainbow'?'✧':'')+'</span></span>';board.append(el);}
   el.dataset.index=i;el.dataset.k=c.k;el.dataset.s=c.s;el.style.left=(i%7*100/7)+'%';el.style.top=(Math.floor(i/7)*100/7)+'%';
   el.classList.toggle('selected',state.selected===i);el.setAttribute('aria-label','第'+(Math.floor(i/7)+1)+'行第'+(i%7+1)+'列 '+names[c.k]+(c.s?' '+({row:'横向直线',col:'纵向直线',bomb:'爆炸',rainbow:'彩虹'}[c.s]):''));el.setAttribute('aria-pressed',String(state.selected===i));
  });
   existing.forEach((el,id)=>{if(!live.has(id)){StarCandyEffects.clear(el);el.remove();}});renderElements();renderMovePreview();paintLessonTargets();paintChapterBoard();if(lessonActive())coach();
 }
 function hud(){
  const l=battleLevel(),isTime=state.mode==='time';
  $('score').textContent=state.score.toLocaleString();$('movesLabel').textContent=isTime?'剩余秒数':'剩余步数';
  $('moves').textContent=isTime?Math.ceil(state.remaining/1000):state.moves;$('moves').classList.toggle('low',isTime?state.remaining<=15000:state.moves<=5);
  $('levelTitle').textContent=isTime?'星光挑战 · 90 秒':String(state.level+1).padStart(2,'0')+' · '+l.title;
  $('levelSubtitle').textContent=isTime?'尽情连锁，刷新你的星光纪录':'收集心愿，向下一站出发';
   const nextTier=state.score<6000?6000:state.score<10000?10000:null;
   const goal=isTime?(nextTier||10000):l.goal,color=isTime?-1:l.color;
   $('targetText').textContent=isTime?(nextTier?'还差 '+(nextTier-state.score).toLocaleString()+' 分':'继续冲击本周最佳'):'星光 '+Math.min(state.score,goal)+'/'+goal;
   $('targetLabel').textContent=isTime?(nextTier?'下一档奖励 · '+nextTier.toLocaleString()+' 分':'两档奖励已达成'):color<0?'心愿目标':names[color]+' '+Math.min(state.collected[color],l.count)+' / '+l.count;
  const progress=color<0?state.score/goal:Math.min(state.score/goal,state.collected[color]/l.count);
  $('goalBar').style.width=Math.min(100,progress*100)+'%';$('energyBar').style.width=(state.energy/40*100)+'%';
  $('energyText').textContent=state.energy>=40?'共鸣已就绪 · 清除数量最多的一种星糖':state.energy+' / 40 · 消除星糖，为伙伴充能';
  $('skill').disabled=!canAct()||state.energy<40;$('skill').classList.toggle('ready',state.energy>=40);
  $('hammerCount').textContent=state.hammers;$('shuffleCount').textContent=state.shuffles;$('hammer').classList.toggle('on',state.hammer);
  $('hammer').disabled=!canAct()||state.hammers<=0;$('shuffle').disabled=!canAct()||state.shuffles<=0;$('hint').disabled=!canAct();
  $('pause').disabled=!state.active;$('map').disabled=isTime;
  $('storyMode').classList.toggle('active',!isTime);$('storyMode').setAttribute('aria-pressed',String(!isTime));
  $('timeMode').classList.toggle('active',isTime);$('timeMode').setAttribute('aria-pressed',String(isTime));
  coach();refreshPartnerUI();paintLessonTargets();chapterHUD();challengeEligibilityStatus();
  if(lessonActive()){$('hammer').disabled=true;$('shuffle').disabled=true;}
  $('partner').disabled=lessonActive()||!!state.challenge;
  $('record').textContent=isTime?'本周最佳 · '+challengeProgress().best.toLocaleString()+' 星光':'旅途星章 · '+data.stars.reduce((a,b)=>a+b,0)+' / '+(levels.length*3);
 }
 function canAct(){return state.active&&!state.paused&&!state.busy&&(state.mode!=='time'||state.remaining>0);}
 function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2200);}
 function tone(chain=1){
  if(!data.sound)return;
  try{audio ||=new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});[0,4,7].forEach((note,j)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+j*.035;o.type='sine';o.frequency.value=330*2**((note+Math.min(chain,8))/12);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.035,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.2);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.21);});}catch(_){}
 }
 function burst(text,sub=''){
  if(!data.motion)return;const el=document.createElement('div');el.className='burst';el.textContent=text;
  if(sub){const small=document.createElement('small');small.textContent=sub;el.append(small);}
  $('boardShell').append(el);setTimeout(()=>el.remove(),900);
 }
 function particles(indices){
  if(!data.motion||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  [...indices].slice(0,14).forEach(i=>{for(let j=0;j<3;j++){const el=document.createElement('i');el.className='spark';el.style.cssText='left:'+((i%7+.5)*100/7)+'%;top:'+((Math.floor(i/7)+.5)*100/7)+'%;--spark:'+palette[engine.cells[i].k]+';--x:'+(Math.random()*90-45)+'px;--y:'+(Math.random()*90-55)+'px';board.append(el);setTimeout(()=>el.remove(),650);}});
 }
 async function wait(ms,epoch){
  let elapsed=0,then=performance.now();
  while(elapsed<ms||state.paused){
   if(epoch!==state.epoch||!state.active)return false;
   await new Promise(r=>setTimeout(r,16));const now=performance.now();if(!state.paused)elapsed+=now-then;then=now;
  }return epoch===state.epoch&&state.active;
 }
 function snapshot(){
  if(state.active&&!state.busy&&!state.trial){
    data.snapshot={rulesVersion:1,toolDebitMode:state.toolDebitMode,pool:[...engine.pool],levelTargets:state.levelTargets?{goal:state.levelTargets.goal,count:state.levelTargets.count,color:state.levelTargets.color}:null,mode:state.mode,level:state.level,score:state.score,moves:state.moves,remaining:state.remaining,energy:state.energy,collected:[...state.collected],hammers:state.hammers,shuffles:state.shuffles,combos:state.combos||0,skillUsed:state.skillUsed===true,lesson:state.lesson||'',lessonReacted:state.lessonReacted===true,chapter:state.chapter?structuredClone(state.chapter):null,elementState:elements.export(),skillTurn:state.skillTurn,cells:engine.cells.map(c=>({k:c.k,s:c.s,aura:c.aura,buff:c.buff}))};
    persist();
  }
 }
  function consumeCarriedTool(kind){
   const count=kind==='hammer'?'hammers':'shuffles';
   if(!state[count])return false;
   if(state.mode==='time'||state.toolDebitMode==='prepaid'){
    state[count]--;snapshot();return true;
   }
   const inventory=data.economy.inventory;
   if(inventory[kind]<1){toast('背包里没有可用道具了');return false;}
   inventory[kind]--;state[count]--;
   snapshot();
   if(storageOK)return true;
   inventory[kind]++;state[count]++;
   toast('进度未能保存，道具没有扣除，请检查存档状态');
   return false;
  }
 const roomRewards=[{name:'星光夜灯',glyph:'✦',copy:'夜灯亮了，晚归时也有一束星光等你。'},{name:'花语八音盒',glyph:'❧',copy:'窗边添了一点颜色。这是你亲手赢来的小礼物。'},{name:'伙伴合照',glyph:'▣',copy:'第一次小冒险完成了，四位伙伴一起留下合照。'}];
 const lessons=['交换相邻两颗糖，横排或竖排连成三颗。','连成四颗会留下直线糖，再次消除时扫清一行或一列。','让月见移动水附着，再消除附近的火糖，触发水火接力。'];
 function roomReward(level){const r=roomRewards[level];return r?'<div class="reward-note"><span class="reward-art reward-'+level+'"></span><strong>'+r.glyph+' '+r.name+'</strong>'+(data.stars[level]?'已布置在小屋 · 重玩可提升星级':'首次通关后，自动布置到你的伙伴小屋')+'</div>':'';}
 function roomView(){
  const earned=roomRewards.map((r,i)=>data.stars[i]>0),next=earned.indexOf(false);
  return '<section class="wish-room" aria-label="伙伴小屋与通关奖励"><div class="page-kicker">OUR LITTLE HOME · '+earned.filter(Boolean).length+' / 3</div><h2 style="font-size:20px;margin:8px 0 12px">一起，把这里变成家。</h2><div class="room-scene" role="img" aria-label="'+(earned[0]?'夜灯已点亮':'夜灯等待点亮')+'，'+(earned[1]?'小花已摆放':'小花尚未获得')+'，'+(earned[2]?'合照已挂上':'合照尚未解锁')+'"><div class="room-moonbeam"></div>'+earned.map((yes,i)=>yes?'<span class="reward-art room-treasure reward-'+i+'" role="img" aria-label="'+roomRewards[i].name+'"></span>':'').join('')+'<div class="room-lamp '+(earned[0]?'lit':'')+'">✦</div><div class="room-guest">'+portrait(data.partner)+'<span>'+partners[data.partner].name+'在这里等你</span></div><div class="room-table"><span class="'+(earned[1]?'':'room-placeholder')+'">'+('<svg viewBox="0 0 60 80" aria-hidden="true"><path d="M30 55V24M30 44Q8 43 14 32Q29 32 30 44M30 38Q50 37 47 28Q33 28 30 38" fill="#8fb58a" stroke="#496f63" stroke-width="2"/><path d="M30 30C9 27 15 7 25 13Q30 0 36 13C49 6 53 28 30 30" fill="#e49db9" stroke="#fbd5d7" stroke-width="2"/><path d="M18 51H42L38 74Q30 79 22 74Z" fill="#a783ae" stroke="#ecd3a4" stroke-width="2"/><path d="M22 54L25 70M25 74H35" fill="none" stroke="#f8e4bf" stroke-width="2"/></svg>')+'</span></div><div class="room-photo '+(earned[2]?'':'room-placeholder')+'">'+(earned[2]?partners.map((_,i)=>portrait(i)).join(''):'合照位置')+'</div></div><p class="room-caption">'+(next<0?'灯亮着，花开着，合照也挂好了。带着这份回忆继续旅途吧。':'下一份心愿：完成第 '+(next+1)+' 关，'+['点亮星光夜灯','摆上窗边小花','挂上伙伴合照'][next]+'。')+'</p><div class="room-steps">'+roomRewards.map((r,i)=>'<div class="room-step '+(earned[i]?'earned':'')+'"><button data-action="level" data-level="'+i+'" '+(i>=data.unlocked?'disabled':'')+'><span class="reward-art reward-'+i+'"></span>'+r.name+'<br>'+(earned[i]?'✓ 已布置':'第 '+(i+1)+' 关解锁')+'</button></div>').join('')+'</div></section>';
 }
 function coach(){
  if(practiceCoach())return;
  const box=$('coach'),early=state.mode==='story'&&state.level<3;
  box.hidden=!early;if(!early)return;
  if(lessonActive()){
   const html='<div class="lesson-copy"><small>月见陪你 · '+['第一次三消','制造四连','元素配合'][state.level]+'</small><p>'+lessonAdvice()+'</p></div><button class="lesson-skip" data-action="lessonSkip" '+(!canAct()?'disabled':'')+'>自由尝试</button>';
   if(box.innerHTML!==html)box.innerHTML=html;return;
  }
  let line=lessons[state.level],heading=partners[data.partner].name+'陪你试一试';
  if(state.lessonReacted){heading='水火接力成功';line='刚刚的水火反应，是你和月见一起安排的。继续收集星光吧。';}
  else if(state.skillUsed){heading='配合成功！';line='刚刚的共鸣没有消耗步数。继续收集剩下的心愿吧。';}
  else if(state.energy>=40){heading='共鸣准备好了';line=skillCopies[data.partner]+' 点击共鸣后选择目标，不扣步数。';}
  else if(state.level===1&&state.combos){heading='你创造了特殊星糖！';line='带光带的是直线星糖，再次参与消除会扫清整行或整列。';}
  else if(state.level===0&&state.score>0){heading='就是这样，做得很好';line='继续把同色星糖连起来，完成这关，再完成两次挑战，就能带回夜灯。';}
  else if(state.level===2)line='伙伴已准备好技能；选择目标，试着安排一次元素接力。';
  const html='<div class="coach-avatar">'+portrait(data.partner)+'</div><div><strong>'+heading+'</strong><p>'+line+'</p></div>';
  if(box.innerHTML!==html)box.innerHTML=html;
 }
 function teachingBoard(level){
  const row=level===1?[0,0,1,0,2,3,1]:[0,0,1,2,3,1,0];
  engine.generate({fixed:[...row.map((k,i)=>[i,k]),[9,0],...(level===2?[[24,1]]:[])]});
 }
 function pageHead(title,kicker,copy){
  return '<div class="page-head"><div><div class="page-kicker">'+kicker+'</div><h1 class="screen-title" tabindex="-1">'+title+'</h1><div class="screen-copy">'+copy+'</div></div>'+(state.active?'<button class="page-back return-game" data-action="resume">返回对局 ↗</button>':'')+'</div>';
 }
 function entry(action,glyph,title,copy){
  return '<button class="entry-card" data-action="'+action+'"><span class="entry-icon">'+glyph+'</span><span><strong>'+title+'</strong><small>'+copy+'</small></span><span class="entry-arrow">↗</span></button>';
 }
 function pageStats(){
  return '<div class="page-stats"><div class="page-stat"><strong>'+data.stars.filter(s=>s>0).length+'<span style="font-size:12px"> / 12</span></strong><small>已点亮的心愿</small></div><div class="page-stat"><strong>'+data.stars.reduce((a,b)=>a+b,0)+'<span style="font-size:12px"> / 36</span></strong><small>旅途星章</small></div><div class="page-stat"><strong>'+data.bestTime.toLocaleString()+'</strong><small>挑战最佳星光</small></div></div>';
 }
 function showScreen(next,fromHistory=false){
  releaseRoute(next);prologueBeforeRoute(next);worldBeforeRoute(next);
  if(next==='map'&&route!=='map')chapterView=Math.floor((data.unlocked-1)/12);
  if(state.trial&&next!=='game'){exitTrial();}
  if(next==='game'&&!state.active){next='home';}
  if(next!=='game'&&state.active){challengeInterrupt('离开了赛场，');state.paused=true;snapshot();}
  if(routingReady&&!fromHistory&&next!==route){try{history.pushState({starCandyRoute:next},'');}catch(_){}}
  document.body.classList.toggle('cover-home',next==='splash');document.body.dataset.screen=next;
  route=next;veil.hidden=true;app.inert=false;focusBefore=null;
  StarCandyMusic.scene(next==='game'?'game':'menu');
  $('gamePage').hidden=next!=='game';$('screen').hidden=next==='game';$('pageNav').hidden=['game','result','splash','prologue'].includes(next);$('pause').hidden=next!=='game';
  document.querySelectorAll('[data-route]').forEach(b=>{const active=b.dataset.route===next;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  if(next==='game'){state.paused=false;lastTick=performance.now();hud();checkEnd();requestAnimationFrame(fitBattleBoard);return;}
  const screen=$('screen');
  if(renderGameFlow(next,screen)){
  }else if(next==='splash'){
   const pending=state.active?state:data.snapshot;
   screen.innerHTML='<section class="cover-stage" aria-label="星糖物语首页"><img class="cover-paint" src="assets/8b0d74acde04eb235a687852415fe19e3ef7d06e74d6ccd0c655b1637e86f3cf.jpg" alt="月见在云端花园中递出发光星糖，身后是亮着灯的小屋和远方浮岛"><div class="cover-heading"><small>STAR CANDY</small><h1 class="screen-title" tabindex="-1">星糖物语</h1><p>消除一颗星 · 点亮一个心愿</p></div><div class="cover-controls"><p class="cover-line">把小小的幸运，留在我们的小屋。</p><p class="cover-progress">'+partners[data.partner].name+'陪你出发 · 已收集 '+data.stars.reduce((a,b)=>a+b,0)+' 枚星章</p><button class="cover-start" data-action="'+(pending?'resume':'journey')+'">'+(pending?'继续上次对局':data.unlocked===1&&!data.stars[0]?'开启星愿旅途':'前往第 '+data.unlocked+' 站')+'<span>›</span></button><div class="cover-shortcuts"><button data-action="map">✧ 选择关卡</button><button data-action="challenge">◷ 星光挑战</button><button data-action="help">? 玩法</button></div></div></section>';
  }else if(next==='map'){
   const chapterNames=['云端来信','森林奇遇','星海约定'],descriptions=['从第一颗星糖开始','让好奇心带你向前','把所有小幸运串成星海'];
   screen.innerHTML=pageHead('星愿旅途','TWELVE LITTLE WISHES','三段旅途，十二个等待点亮的心愿。')+
   '<div class="travel-summary"><span>已完成 '+data.stars.filter(s=>s>0).length+' / 12 站</span><div class="progress"><i style="width:'+(data.stars.filter(s=>s>0).length/12*100)+'%"></i></div><span>✦ '+data.stars.reduce((a,b)=>a+b,0)+'</span></div>'+
   '<div class="chapters">'+chapterNames.map((name,ch)=>'<section class="chapter"><div class="chapter-head"><div class="page-kicker">CHAPTER 0'+(ch+1)+'</div><h3>'+name+'</h3><small>'+descriptions[ch]+'</small></div><div class="trail"><svg viewBox="0 0 300 375" preserveAspectRatio="none" aria-hidden="true"><path d="M70 52C70 100 180 72 180 133S220 173 220 214 100 245 100 305" fill="none" stroke="#ffffffb0" stroke-width="18"/><path d="M70 52C70 100 180 72 180 133S220 173 220 214 100 245 100 305" fill="none" stroke="#bfa9d0" stroke-width="2" stroke-dasharray="4 8" stroke-linecap="round"/></svg>'+
    levels.slice(ch*4,ch*4+4).map((l,j)=>{const i=ch*4+j,locked=i>=data.unlocked,x=[70,180,220,100][j]/3,y=[52,133,214,305][j]/3.75;return '<div class="level-stop" style="left:'+x+'%;top:'+y+'%"><button class="node '+(data.stars[i]?'done':i===data.unlocked-1?'current':'')+'" data-action="level" data-level="'+i+'" '+(locked?'disabled':'')+' aria-label="第'+(i+1)+'关 '+l.title+(locked?'，尚未解锁':'，'+data.stars[i]+'星')+'">'+(locked?'·':i+1)+'</button><strong>'+l.title+'</strong><small>'+(locked?'待解锁':'★'.repeat(data.stars[i])+'☆'.repeat(3-data.stars[i]))+'</small></div>';}).join('')+'</div></section>').join('')+'</div><p class="map-legend">完成前一站，下一站就会点亮。已完成的关卡可以重复挑战三星。</p>';
  }else if(next==='partners'){
   screen.innerHTML=pageHead('同行伙伴','A FRIEND FOR EVERY WISH','每位伙伴都有自己的魔法，选择与你配合的那一位。')+'<div class="partner-grid">'+partners.map((p,i)=>'<article class="partner-card '+(data.partner===i?'chosen':'')+'">'+portrait(i)+'<h3>'+p.name+'</h3><p>'+p.line+'</p><strong>'+skillNames[i]+'</strong><p>'+skillCopies[i]+'</p><small>'+(i===4?'特别伙伴 · 完整看两次广告解锁':'40 能量 · 每步一次')+'</small><button class="primary" data-action="'+(i===4?'premium':'choosePartner')+'" data-partner="'+i+'">'+(i===4?'了解与免费试用':data.partner===i?'正在同行':'邀请同行')+'</button></article>').join('')+'</div>';
  }else if(next==='challenge'){
   screen.innerHTML=pageHead('星光挑战','NINETY SECONDS OF MAGIC','换一种节奏，试着超越上一次的自己。')+
    '<section class="challenge-hero"><div class="page-kicker">TIME ATTACK</div><div class="challenge-clock">90 <small>秒</small></div><h2>让星光，连成一场雨。</h2><p class="screen-copy">相同的消除规则，不同的心跳节奏。</p><div class="page-stats"><div class="page-stat"><strong>'+data.bestTime.toLocaleString()+'</strong><small>你的最高纪录</small></div><div class="page-stat"><strong>6,000</strong><small>两星挑战线</small></div><div class="page-stat"><strong>10,000</strong><small>三星挑战线</small></div></div><div class="challenge-rules">✦ 多做四连、五连，创造大范围消除。<br>✦ 星锤和伙伴共鸣不扣时间额度，计时仍继续。<br>✦ 离开页面自动暂停；时间归零后结算当前连锁。</div><button class="primary" data-action="challengeStart">开始 90 秒挑战 →</button></section>';
  }else if(next==='records'){
   screen.innerHTML=pageHead('旅途收藏','EVERY LITTLE STEP COUNTS','你走过的路，都会留下星光。')+roomView()+pageStats()+'<h2 class="section-label">心愿册</h2><div class="record-list">'+levels.map((l,i)=>'<div class="record-row"><div>'+String(i+1).padStart(2,'0')+' · '+l.title+'<small>'+(data.stars[i]?'已点亮 · 可重玩提升星级':i<data.unlocked?'已解锁 · 等待出发':'完成前一站后解锁')+'</small></div><span class="record-stars" aria-label="'+data.stars[i]+'星">'+('★'.repeat(data.stars[i])+'☆'.repeat(3-data.stars[i]))+'</span></div>').join('')+'</div><div class="ability-note"><span>☁</span><div><strong>这里记着你的小小进步</strong><p>'+(storageOK?'记录保存在当前浏览器。切换设备或清理浏览器数据后，记录不会自动同步。':'浏览器暂时无法保存记录，本次游玩仍可继续。')+'</p></div></div><button class="secondary" data-action="preferences" style="margin-top:15px;width:100%">声音、动画与触感设置</button>';
  }else if(next==='result'&&lastResult){
   const r=lastResult,l=levels[state.level],time=state.mode==='time';
   screen.innerHTML='<section class="result-card"><div class="page-kicker">'+(time?'CHALLENGE COMPLETE':'CHAPTER '+String(Math.floor(state.level/4)+1).padStart(2,'0'))+'</div><div class="result-art">'+portrait(data.partner)+'</div><div class="stars">'+(r.won?'★'.repeat(r.stars)+'☆'.repeat(3-r.stars):'✧')+'</div><h1 class="screen-title" tabindex="-1">'+(time?'星光已收藏':r.won?'心愿实现了！':'再靠近一点点')+'</h1><p class="screen-copy">'+(r.won?partners[data.partner].line:'星光没有走远，换一种组合再试试。')+'</p><div class="result-score">'+state.score.toLocaleString()+'</div><div class="result-label">本局收集的星光</div><div class="result-goals">'+(time?'<span>最佳纪录 '+data.bestTime.toLocaleString()+'</span>':'<span>目标 '+l.goal.toLocaleString()+' 星光</span>'+(l.color>=0?'<span>'+names[l.color]+' '+state.collected[l.color]+'/'+l.count+'</span>':'')+'<span>剩余 '+state.moves+' 步</span>')+'</div>'+
    (!time&&r.won&&state.level<3?'<div class="reward-note"><span class="reward-art reward-'+state.level+'"></span><strong>'+roomRewards[state.level].glyph+' '+(r.firstClear?'小屋有了新变化':'这份心愿已经留在小屋')+'</strong>'+roomRewards[state.level].copy+'<br>已自动保存，无需领取。</div><button class="secondary" data-action="partners">回小屋看看 →</button>':'')+
    (!r.won&&!time?'<p class="lesson-recap">还差 '+Math.max(0,l.goal-state.score)+' 星光'+(l.color>=0?'、'+Math.max(0,l.count-state.collected[l.color])+' 颗'+names[l.color]:'')+'。试试组合消除或伙伴共鸣。</p>':'')+
    (!time&&r.won&&state.level<11?'<button class="primary" data-action="next">下一站 · '+levels[state.level+1].title+' →</button>':'')+
    (!time&&r.won&&state.level===11?'<p class="screen-copy">十二站心愿全部点亮！回到旅途地图，继续收集 36 枚星章。</p>':'')+
    '<button class="'+(!time&&r.won&&state.level<11?'secondary':'primary')+'" data-action="retry">'+(r.won?'再玩一局':'再试一次')+'</button><button class="secondary" data-action="'+(time?'challenge':'map')+'">'+(time?'返回挑战页':'返回旅途地图')+'</button><button class="secondary" data-action="home">回到首页</button></section>';
  }
  if(next==='splash')prepareSplash(screen);
  screen.scrollTop=0;
  hud();window.scrollTo({top:0,behavior:'instant'});requestAnimationFrame(()=>{screen.querySelector('.screen-title')?.focus({preventScroll:true});if(next==='map')screen.querySelector('.node.current')?.scrollIntoView({block:'nearest',behavior:'instant'});});
 }
 function resumeGame(){
  if(state.active){if(lessonActive())setPartner(0);showScreen('game');return;}
  const saved=data.snapshot;if(saved)start(saved.mode,saved.level,saved);else showScreen('home');
 }
 function start(mode='story',level=0,saved=null,loadout=null){
  if(!['story','time'].includes(mode)||!Number.isInteger(level)||level<0||level>=levels.length)return;
  if(mode==='story'&&level>=data.unlocked&&!saved){toast('完成前一站后解锁');return;}
  lastResult=null;
  if(state.challenge&&!trialPending)data.partner=state.challenge.oldPartner;
  state.epoch++;const epoch=state.epoch;
  skillMode=null;reactionText='';elements.restore(null);engine.pool=mode==='time'?[0,1,3,4,5,6]:level<3?[0,1,2,3]:levels[level].landmark<4?[0,1,2,3,4]:levels[level].landmark<8?[0,1,2,3,4,5]:[0,1,2,3,4,6];if(mode==='story'&&levels[level].color>=0&&!engine.pool.includes(levels[level].color))engine.pool.push(levels[level].color);
  state={trial:trialPending,skillTurn:-1,mode,level,score:0,moves:levels[level].moves,remaining:90000,energy:mode==='story'&&level===2?25:0,combos:0,skillUsed:false,lesson:!saved&&firstLesson(level,mode)?['match','four','skill'][level]:'',lessonReacted:false,collected:Array(7).fill(0),hammers:2,shuffles:1,active:true,paused:false,busy:false,selected:-1,hammer:false,epoch};
   state.toolDebitMode=saved?.toolDebitMode==='on-use'||!saved?'on-use':'prepaid';
   if(saved){state.lesson=mode==='story'&&level<3&&['match','four','skill','react','done'].includes(saved.lesson)?saved.lesson:'';state.lessonReacted=saved.lessonReacted===true;}
  setupChapter(saved);state.levelTargets=roundLevel(saved);
  if(mode==='story'&&!saved&&levels[level].pool)engine.pool=[...levels[level].pool];
  setupChallenge(saved,loadout);
  if(saved?.rulesVersion===1&&Array.isArray(saved.pool)&&saved.pool.length>=4&&saved.pool.length<=7&&saved.pool.every(k=>Number.isInteger(k)&&k>=0&&k<=6))engine.pool=[...new Set(saved.pool)];
  if(saved){state.combos=Number.isInteger(saved.combos)?Math.max(0,saved.combos):0;state.skillUsed=saved.skillUsed===true;for(const k of ['score','moves','remaining','energy','hammers','shuffles'])state[k]=saved[k];state.collected=[...saved.collected];elements.restore(saved.elementState);state.skillTurn=saved.skillTurn??-1;engine.cells=saved.cells.map(c=>({...engine.cell(c.k,c.s),aura:c.aura,buff:c.buff}));if(engine.runs().length||!engine.move()){engine.shuffle();state.lesson='done';}}
  else if(mode==='story'&&['match','four','skill'].includes(state.lesson))teachingBoard(level);else if(!makeChapterBoard())engine.generate();
  if(!saved&&mode==='story'&&level===1){elements.attach(10,'water');elements.attach(11,'grass');}
  if(!saved&&mode==='story'&&level===2){if(state.lesson==='skill'){elements.attach(24,'water');data.partner=0;}else{elements.attach(24,'grass');elements.attach(25,'water');}state.energy=40;}
  if(!saved&&loadout){state.hammers=loadout.hammer?1:0;state.shuffles=loadout.shuffle?1:0;if(mode==='story'&&Number.isInteger(loadout.partner)&&partnerOwned(loadout.partner))data.partner=loadout.partner;}
  if(lessonActive())setPartner(0);else setPartner(data.partner);
  releaseRoundStart(saved);board.innerHTML='';closeDialog(false);showScreen('game');render(false);hud();lastTick=lastAction=performance.now();snapshot();$('caption').textContent='点选相邻星糖，或朝任意方向滑动一格';
  if(!saved&&mode==='story'&&['match','four'].includes(state.lesson)){[2,9].forEach(i=>board.querySelector('[data-index="'+i+'"]')?.classList.add('hint'));$('caption').textContent='试着上下交换第一行第3颗与下面的火焰';}
  tone();checkEnd();
 }
 async function resolve(plan,preferred,epoch,charge=true,emitAura=false){
  let chain=0,settled=false,skillCharge=0;
  while((plan.clear.size||state.turnEnding&&!settled)&&state.active&&epoch===state.epoch){
   if(!plan.clear.size){settled=true;const clear=elements.end();showReactionEvents();render();plan={clear,creates:new Map(),reactionOnly:true};if(!clear.size)break;}
   chain++;state.combos=(state.combos||0)+plan.creates.size;const expanded=plan.reactionOnly?{...plan,triggered:0}:elements.wave(plan,engine.expand(plan),emitAura&&chain===1);showReactionEvents();render();
   expanded.clear.forEach(i=>board.querySelector('[data-index="'+i+'"]')?.classList.add('clearing'));
   particles(expanded.clear);tone(chain);if(data.vibration&&navigator.vibrate)navigator.vibrate(12);
   if(!await wait(230,epoch))return;
   const elemental=plan.reactionOnly?expanded.clear.size:(expanded.elementClear?.size||0);
   chapterClear(expanded.clear);
   const removed=engine.apply(expanded),gain=(removed.length-elemental)*60*Math.min(chain,5)+elemental*60+expanded.triggered*120;
   state.score+=gain;removed.forEach(c=>state.collected[c.k]++);if(charge)state.energy=Math.min(skillCost(),state.energy+removed.length);
   if(!charge){const gain=Math.min(10-skillCharge,removed.length);skillCharge+=gain;state.energy=Math.min(skillCost(),state.energy+gain);}
   render();hud();
   if(chain>1)burst(chain+' 连锁','+'+gain+' 星光');else if(expanded.triggered)burst('星光绽放','+'+gain);else if(plan.creates.size)burst('奇迹星糖！','+'+gain);
   $('caption').textContent=chain>1?'连续 '+chain+' 次消除 · 本轮 +'+gain+' 星光':'收集 '+removed.length+' 颗星糖 · +'+gain+' 星光';
   if(!await wait(260,epoch))return;
   if(chain>=40){engine.shuffle();render();break;}
   plan=engine.plan();preferred=[];
  }
  if(epoch!==state.epoch||!state.active)return;
  if(!engine.move()){engine.shuffle();render();toast('没有可走步，已免费重排');}
  if(state.lesson==='react')state.lesson='done';
  state.turnEnding=false;state.busy=false;hud();snapshot();checkEnd();
 }
 async function attempt(a,b){
  if(!canAct()||!engine.adjacent(a,b))return;
  if(!lessonAllowsSwap(a,b))return;
  board.querySelectorAll('.hint').forEach(el=>el.classList.remove('hint'));
  const epoch=state.epoch;state.busy=true;state.selected=-1;state.hammer=false;lastAction=performance.now();engine.swap(a,b);render();hud();
  if(!await wait(190,epoch))return;
  let plan=engine.specialSwap(a,b)||engine.plan([b,a]);
  if(!plan.clear.size){engine.swap(a,b);render();$('caption').textContent='还没连成三个，这次不扣步数';if(!await wait(190,epoch))return;state.busy=false;hud();checkEnd();return;}
  if(['match','four'].includes(state.lesson))state.lesson='done';
  if(state.challenge)state.challenge.swaps++;
  skillMode=null;elements.begin();state.turnEnding=true;if(state.mode==='story')state.moves--;hud();await resolve(plan,[b,a],epoch,true,true);
 }
 async function select(i){
  if(!canAct()||i<0||i>=49)return;lastAction=performance.now();
  if(skillMode){await useSkill(i);return;}
   if(state.hammer){state.hammer=false;if(!consumeCarriedTool('hammer'))return;state.selected=-1;state.busy=true;hud();await resolve({clear:new Set([i]),creates:new Map()},[],state.epoch);return;}
  if(state.selected===i){state.selected=-1;render();return;}
  if(state.selected>=0&&engine.adjacent(state.selected,i)){await attempt(state.selected,i);return;}
  state.selected=i;render();
 }
 function hint(automatic=false){
  if(lessonActive()){paintLessonTargets();if(!automatic)toast(lessonAdvice());lastAction=performance.now();return;}
  if(!canAct())return;const choices=engine.legalMoves(),pair=choices[Math.floor(Math.random()*choices.length)];
  if(!pair){engine.shuffle();render();snapshot();return;}
  board.querySelectorAll('.hint').forEach(el=>el.classList.remove('hint'));
  pair.forEach(i=>board.querySelector('[data-index="'+i+'"]')?.classList.add('hint'));
  if(!automatic)toast('试着交换这两颗星糖');lastAction=performance.now();
 }
 function win(){const l=battleLevel();return state.score>=l.goal&&(l.color<0||state.collected[l.color]>=l.count)&&chapterWon();}
 function checkEnd(){
  if(!state.active||state.busy||state.paused)return;
  if(state.mode==='story'&&(win()||state.moves===0))finish(win());
  else if(state.mode==='time'&&state.remaining<=0)finish(true);
 }
 function finish(won){
  if(!state.active)return;if(state.trial){exitTrial();showScreen('partners');toast('试用结束，原来的旅途已恢复');return;}state.active=false;state.busy=false;state.epoch++;state.selected=-1;state.hammer=false;data.snapshot=null;
  const firstClear=won&&state.mode==='story'&&!data.stars[state.level];
  const isTime=state.mode==='time',stars=won?(isTime?(state.score>=10000?3:state.score>=6000?2:1):chapterStars()):0;
  if(isTime)data.bestTime=Math.max(data.bestTime,state.score);
  else if(won){data.stars[state.level]=Math.max(data.stars[state.level],stars);data.unlocked=Math.max(data.unlocked,Math.min(levels.length,state.level+2));if(firstClear)recordRoomNoteSignal('clear',state.level);}
  // Save stars and their reward together below.
  lastResult={won,stars,firstClear,...(isTime?finishChallenge():{reward:awardStage(won,firstClear)})};if(isTime&&state.challenge)data.partner=state.challenge.oldPartner;releaseRoundEnd(won,stars,firstClear);persist();hud();render();tone(5);showScreen('result');
 }
 function showDialog(html,pause=true){
  if(veil.hidden)focusBefore=document.activeElement;
  if(pause&&state.active){challengeInterrupt('本局已暂停，');state.paused=true;snapshot();}
  dialog.innerHTML=html;
  const dismiss=document.createElement('button');
  dismiss.className='dialog-corner-close';
  dismiss.dataset.action=dialog.querySelector('[data-action="shopClose"],[data-action="economyClose"]')?.dataset.action||'close';
  dismiss.setAttribute('aria-label','关闭窗口');
  dismiss.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>';
  dialog.prepend(dismiss);
  dialog.querySelectorAll('[data-action="shopClose"],[data-action="economyClose"],.prep-header [data-action="close"]').forEach(b=>{if(b!==dismiss)b.hidden=true;});
    dialog.dataset.skin=dialog.querySelector('.prep-sheet')?'preparation':dialog.querySelector('.boutique-head')?'boutique':dialog.querySelector('.daily-book')?'daily':dialog.querySelector('.mail-heading,.letter-paper')?'mail':dialog.querySelector('.shop-confirm')?'purchase':'';
    veil.hidden=false;app.inert=true;hud();requestAnimationFrame(()=>dialog.querySelector('button')?.focus());
 }
 function closeDialog(resume=true){
  veil.hidden=true;app.inert=false;
  if(resume&&route==='game'){state.paused=false;lastTick=performance.now();hud();checkEnd();}
  if(focusBefore?.isConnected)focusBefore.focus({preventScroll:true});
 }
 function intro(mode=state.mode,level=state.level){
  if(!Number.isInteger(level)||level<0||level>=levels.length||mode==='story'&&level>=data.unlocked){toast('完成前一站后解锁');return;}
  if(state.trial){exitTrial();showScreen('partners');}
  preparation={mode,level,partner:firstLesson(level,mode)?0:partnerOwned(data.partner)?data.partner:0,hammer:false,shuffle:false};showPreparation();return;

 }
 function mapDialog(){showScreen('map');}
 function helpDialog(){
  showDialog('<div class="dialog-icon">✧</div><h2 id="dialogTitle">一点小魔法</h2><button class="secondary" data-action="elementPreview" style="margin-bottom:14px">查看元素染色与爆发演示 →</button><div class="rule"><b>3</b><div>横向或纵向连成三颗，即可消除<small>点选两个相邻棋子，或滑动交换；无效不扣步数</small></div></div><div class="rule"><b>4</b><div>四连 → 直线星糖<small>再次消除时，扫清整行或整列</small></div></div><div class="rule"><b>5</b><div>五连 → 彩虹星糖<small>与任意星糖交换，清除对应颜色</small></div></div><div class="rule"><b>✦</b><div>T / L 形 → 爆炸星糖<small>消除周围九格；两个特殊星糖也能直接交换触发</small></div></div><div class="rule"><b>♢</b><div>星锤、重排和伙伴共鸣不扣步数<small>充满能量后，由伙伴为选中目标施放元素技能</small></div></div><p>各关星级按剩余步数计算，具体门槛在关卡准备页查看。<br>关卡、纪录和稳定棋盘自动保存在当前浏览器。</p><button class="primary" data-action="'+(state.active?'close':'home')+'">明白啦</button>');
 }
  function pauseDialog(){if(!state.active)return;showDialog('<div class="dialog-icon">☾</div><h2 id="dialogTitle">星光等你回来</h2><p>'+(state.mode==='time'?'暂停后本局不计周榜，仍可继续完成并领取本机奖励。':'游戏已暂停，休息一下也没关系。')+'</p><button class="primary" data-action="close">继续游戏</button><button class="secondary" data-action="elements">元素反应手册</button><button class="secondary" data-action="preferences">音乐与设置</button><button class="secondary" data-action="restartPrompt">重新开始本局</button><button class="secondary" data-action="map">关卡地图</button><button class="secondary" data-action="home">返回首页</button>');}
 function settingsDialog(){
  showDialog('<h2 id="dialogTitle">小小偏好</h2><p class="release-build-label">'+releaseEsc(StarCandyRelease.build)+' · '+levels.length+'关 · 自由闯关</p>'+[['music','星光八音盒 · 背景音乐'],['sound','轻快音效'],['motion','动画与粒子'],['vibration','触感反馈']].map(([k,t])=>'<div class="settings-row"><span>'+t+'</span><button class="switch" data-action="toggle" data-key="'+k+'" aria-pressed="'+data[k]+'">'+(data[k]?'已开启':'已关闭')+'</button></div>').join('')+(!state.trial?prologueReplayButton():'')+releaseButtons()+'<p>'+(storageOK?'进度保存在本浏览器，换设备不会自动同步。':'当前浏览器无法保存进度，本次仍可正常游玩。')+'</p><button class="primary" data-action="'+(state.active?'close':'home')+'">返回</button>');
 }
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-action]');if(!b)return;
  if(handleFlowAction(b))return;
  switch(b.dataset.action){
   case 'elements':showElementGuide();break;
   case 'premium':premiumDialog();break;
   case 'trial':startTrial();break;
   case 'exitTrial':exitTrial();showScreen('partners');break;
   case 'start':intro(b.dataset.mode,Number(b.dataset.level));break;
   case 'restore':{const saved=data.snapshot;if(saved)start(saved.mode,saved.level,saved);break;}
   case 'close':closeDialog();break;
   case 'home':showScreen('home');break;
   case 'resume':resumeGame();break;
   case 'journey':if(journeyComplete())showJourneyEnding();else intro('story',data.unlocked-1);break;
   case 'challenge':showScreen('challenge');break;
   case 'challengeStart':intro('time',0);break;
   case 'partners':showScreen('partners');break;
   case 'records':showScreen('records');break;
   case 'preferences':settingsDialog();break;
   case 'choosePartner':if(!partnerOwned(Number(b.dataset.partner))){showPartnerOffer(Number(b.dataset.partner));break;}setPartner(Number(b.dataset.partner));showScreen('partners');toast(partners[data.partner].line);break;
   case 'retry':intro(state.mode,state.level);break;
   case 'next':if(state.level>=levels.length-1){if(journeyComplete())showJourneyEnding();else showScreen('map');}else intro('story',state.level+1);break;
   case 'map':mapDialog();break;
   case 'level':intro('story',Number(b.dataset.level));break;
   case 'help':helpDialog();break;
   case 'elementPreview':showDialog('<h2 id="dialogTitle">元素动态演示</h2><div id="effectsDemo"></div><button class="secondary" data-action="help">返回玩法说明</button>');StarCandyEffects.mount($('effectsDemo'));break;
   case 'restartPrompt':showDialog('<h2 id="dialogTitle">重新出发？</h2><p>本局分数会重置，已经获得的星章会保留。</p><button class="primary" data-action="retry">重新开始</button><button class="secondary" data-action="close">继续当前游戏</button>');break;
   case 'toggle':data[b.dataset.key]=!data[b.dataset.key];persist();document.body.classList.toggle('reduced',!data.motion);settingsDialog();if(b.dataset.key==='sound')tone();if(b.dataset.key==='music')StarCandyMusic.set(data.music);if(b.dataset.key==='motion'){board.querySelectorAll('.tile').forEach(el=>delete el.dataset.aura);render();}break;
   case 'partner':if(!partnerOwned(Number(b.dataset.partner))&&!(state.trial&&Number(b.dataset.partner)===4)){showPartnerOffer(Number(b.dataset.partner));break;}setPartner(Number(b.dataset.partner));toast(partners[data.partner].line);if(state.active&&route==='game')closeDialog();else showScreen(route);break;
  }
 });
 $('homeButton').onclick=()=>showScreen('home');
 $('pageNav').onclick=e=>{const b=e.target.closest('[data-route]');if(b)showScreen(b.dataset.route);};
 $('storyMode').onclick=mapDialog;
 $('timeMode').onclick=()=>showScreen('challenge');$('map').onclick=mapDialog;$('help').onclick=helpDialog;$('pause').onclick=pauseDialog;$('settings').onclick=settingsDialog;
 $('hint').onclick=()=>hint();$('hammer').onclick=()=>{if(!canAct()||!state.hammers)return;state.hammer=!state.hammer;state.selected=-1;render();hud();$('caption').textContent=state.hammer?'点击任意一颗星糖，用星锤敲开它':'星锤已收起';};
  $('shuffle').onclick=()=>{if(!canAct()||!state.shuffles||!consumeCarriedTool('shuffle'))return;state.hammer=false;state.selected=-1;engine.shuffle();render();hud();snapshot();toast('已重新排列，不消耗步数');};
 $('skill').onclick=beginSkill;
 $('companions').onclick=e=>{const b=e.target.closest('[data-partner]');if(b)setPartner(Number(b.dataset.partner));};
 $('partner').onclick=()=>showDialog('<h2 id="dialogTitle">今天，和谁同行？</h2><p>每位伙伴拥有独特技能，详情可在伙伴小屋查看。</p>'+partners.map((p,i)=>'<button class="secondary" data-action="partner" data-partner="'+i+'" style="display:flex;align-items:center;gap:12px"><span style="width:48px">'+portrait(i)+'</span><span>'+p.name+' · '+p.line+'</span></button>').join('')+'<button class="secondary" data-action="'+(state.active?'close':'home')+'">返回</button>');
 let pointer=null;
 board.addEventListener('pointerdown',e=>{if(!canAct()||e.button!==0)return;const tile=e.target.closest('.tile');if(!tile)return;pointer={id:e.pointerId,i:Number(tile.dataset.index),x:e.clientX,y:e.clientY};board.setPointerCapture(e.pointerId);e.preventDefault();});
 board.addEventListener('pointerup',e=>{if(!pointer||pointer.id!==e.pointerId)return;const p=pointer;pointer=null;if(board.hasPointerCapture(e.pointerId))board.releasePointerCapture(e.pointerId);if(!canAct())return;const dx=e.clientX-p.x,dy=e.clientY-p.y;
  if(Math.max(Math.abs(dx),Math.abs(dy))<15||state.hammer||skillMode)select(p.i);
  else{const delta=Math.abs(dx)>Math.abs(dy)?(dx>0?1:-1):(dy>0?7:-7);attempt(p.i,p.i+delta);}
 });
 board.addEventListener('pointercancel',()=>pointer=null);board.addEventListener('lostpointercapture',()=>pointer=null);
 board.addEventListener('click',e=>{if(e.detail===0){const t=e.target.closest('.tile');if(t)select(Number(t.dataset.index));}});
 board.addEventListener('keydown',e=>{const t=e.target.closest('.tile');if(!t)return;const i=Number(t.dataset.index),d={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[e.key];if(d&&engine.adjacent(i,i+d)){e.preventDefault();board.querySelector('[data-index="'+(i+d)+'"]')?.focus();}});
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(!veil.hidden)closeDialog();else if(state.active&&route==='game')pauseDialog();}
  if(e.key==='Tab'&&!veil.hidden){const buttons=[...dialog.querySelectorAll('button:not(:disabled)')];if(!buttons.length)return;const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.active&&!state.paused)pauseDialog();lastTick=performance.now();});
 window.addEventListener('pagehide',snapshot);
 setInterval(()=>{
  const now=performance.now(),elapsed=now-lastTick;lastTick=now;
  if(state.active&&!state.paused){if(state.mode==='time'&&!state.practice){if(state.challenge)state.challenge.activeMs+=Math.min(state.remaining,elapsed);state.remaining=Math.max(0,state.remaining-elapsed);hud();checkEnd();}if(!state.busy&&now-lastAction>9000)hint(true);if(now-lastSave>5000){snapshot();lastSave=now;}}
 },100);
// Runs inside the application closure, sharing its normal navigation and save flow.
function showElementGuide(){
 const rows=[['火＋水','蒸腾','横向清除三格'],['火＋冰','融解','清除中心与最近一格'],['火＋雷','爆裂','纵向清除三格'],['冰＋雷','碎霜','中心及两个对角'],['水＋雷','导电','中心与最近两颗水／雷糖'],['水＋草','绽芽','留下种子；下一步结束十字绽放'],['火＋草','燃烧','留下余焰；后续两步各清一邻格'],['水＋冰','凝露','两颗普通糖获得露珠，正常消除再清邻格'],['雷＋草','激生','一颗草糖长芽，正常消除再清左右'],['风＋火水冰雷','扩散','清除中心，向两邻格传递附着'],['岩＋火水冰雷','结晶','留下晶体，同元素再触碰清两格']];
 showDialog('<h2 id="dialogTitle">七元素 · 反应手册</h2><p>只有手动交换后的首轮匹配会染色：三连最多染两颗邻糖，四连三颗，五连及以上四颗。优先接触已有不同附着，再从匹配中心向外选择。掉落连锁只消除，不继续染色。附着跟随糖果移动，两次有效交换后褪去。糖果图案用于配对，细边和角标代表附着；两颗小点代表剩余两步。</p><div class="element-legend">'+ElementSystem.ids.map((e,i)=>'<span>'+icon(i)+names[i]+'</span>').join('')+'</div>'+rows.map(r=>'<div class="reaction-row"><b>'+r[0]+' · '+r[1]+'</b><small>'+r[2]+'</small></div>').join('')+'<p>种子＋火：提前十字绽放；种子＋雷：精准清三格；余焰＋水：一次结清剩余余焰。<br>冰草、风草、岩草、风岩只替换附着。每步最多两次即时反应，伙伴共用本步额度；额度用完保留原附着。元素额外清除每颗固定 60 星光，不乘连锁倍数。种子、余焰按各自回合延迟结算，不占即时额度；棋盘最多四个持续机关。选中糖果可看到相邻交换的反应预告。</p><button class="secondary" data-action="elementPreview">查看动态演示</button><button class="primary" data-action="close">回到游戏</button>');
}
function premiumDialog(){showMirrorOffer();return;
 showDialog('<div class="premium-portrait">'+portrait(4)+'</div><div class="page-kicker">MIRROR WISH · 特别伙伴</div><h2 id="dialogTitle">绯镜 · 万象折光</h2><p>把一颗糖果已有的附着转换为你选择的元素，安排下一次反应。需要 50 能量，每步限一次；不能凭空制造附着。</p><p>完整观看两次广告永久解锁 · 可先免费练习技能。</p><button class="primary" data-action="trial">免费试用 · 独立练习局</button><button class="secondary" data-action="close">返回</button>');
}
function startTrial(){startPartnerPractice(4);}
function exitTrial(){
 if(!trialBackup)return;releaseAfterTrial();const old=trialBackup;trialBackup=null;
 state={...old.state,epoch:state.epoch+1,paused:true,busy:false,selected:-1};engine.cells=old.cells;engine.pool=old.pool;engine.rng=old.rng||Math.random;elements.restore(old.elements);data.partner=old.partner;data.snapshot=old.snapshot;lastResult=old.result??null;preparation=old.preparation??null;skillMode=null;board.innerHTML='';setPartner(data.partner);render(false);hud();
}
function showReactionEvents(){
 chapterReactions(elements.events);
 if(state.lesson==='react'&&elements.events.some(ev=>ev.name==='蒸腾')){state.lessonReacted=true;state.lesson='done';}
 elements.events.forEach(ev=>{const host=document.createElement('div');host.className='reaction-overlay';host.style.left=(ev.i%7*100/7)+'%';host.style.top=(Math.floor(ev.i/7)*100/7)+'%';board.append(host);StarCandyEffects.burst(host,ev.a,ev.b,!data.motion);setTimeout(()=>{StarCandyEffects.clear(host);host.remove();},1400);});
 if(elements.events.length){reactionText=[...new Set(elements.events.map(e=>e.name))].join(' · ');$('reactionStatus').textContent=reactionText;}elements.events=[];
}
const auraNames={fire:'火',water:'水',ice:'冰',lightning:'雷',grass:'草',wind:'风',rock:'岩'};
function renderElements(){
 engine.cells.forEach((c,i)=>{
  const el=board.querySelector('.tile[data-id="'+c.id+'"]');if(!el)return;
  const key=c.aura?.e||'',stamp=String(c.aura?.until||''),changed=el.dataset.aura!==key||el.dataset.auraUntil!==stamp;
  if(changed){StarCandyEffects.clear(el);el.dataset.aura=key;el.dataset.auraUntil=stamp;el.querySelector('.aura-shell')?.remove();
   if(key){const shell=document.createElement('span');shell.className='aura-shell';shell.setAttribute('aria-hidden','true');shell.innerHTML='<span class="aura-trace"></span><span class="aura-flow"><i></i><i></i><i></i><i></i></span><span class="aura-chip">'+auraNames[key]+'</span><span class="aura-dots"></span>';el.append(shell);
    if(data.motion){const flash=document.createElement('span');flash.className='aura-arrival';shell.append(flash);setTimeout(()=>flash.remove(),600);}
   }
  }
  el.querySelector('.aura-age')?.remove();
  const dots=el.querySelector('.aura-dots');if(dots)dots.textContent='•'.repeat(Math.min(2,Math.max(0,c.aura.until-elements.turn)));
  if(key)el.setAttribute('aria-label',el.getAttribute('aria-label')+'，附着'+auraNames[key]+'元素，剩余'+Math.max(0,c.aura.until-elements.turn)+'步');
  let buff=el.querySelector('.buff-mark');if(!buff){buff=document.createElement('span');buff.className='buff-mark';el.append(buff);}buff.textContent=c.buff?c.buff.type==='dew'?'◉':'❧':'';
 });
 board.querySelectorAll('.field-mark').forEach(n=>n.remove());elements.fields.forEach(f=>{
  const mark=document.createElement('span');mark.className='field-mark '+f.type;mark.style.left=((f.i%7+.5)*100/7)+'%';mark.style.top=((Math.floor(f.i/7)+.88)*100/7)+'%';mark.textContent={seed:'❧',burn:'♨',crystal:'◆'}[f.type];mark.title={seed:'种子：下一步绽放',burn:'余焰：剩余'+f.left+'次',crystal:'晶体：同元素触碰触发'}[f.type];board.append(mark);
 });
 $('trialExit').hidden=!state.trial;
}
function renderMovePreview(){
 board.querySelectorAll('.reaction-preview').forEach(el=>{el.classList.remove('reaction-preview');el.removeAttribute('data-preview');});
 const status=$('reactionStatus');if(!status)return;
 if(state.selected<0||state.busy||skillMode||state.hammer){status.textContent=reactionText||'首轮三消染两颗 · 即时反应每步最多两次';return;}
 const a=state.selected,notes=[];
 for(const b of elements.neighbors(a)){
  const sim=Object.create(CandyEngine.prototype);sim.cells=engine.cells.map(c=>({...c,aura:c.aura?{...c.aura}:undefined,buff:c.buff?{...c.buff}:undefined}));sim.swap(a,b);
  const plan=sim.specialSwap(a,b)||sim.plan([b,a]);if(!plan.clear.size)continue;
  const rules=new ElementSystem(sim);rules.restore(structuredClone(elements.export()));rules.begin();rules.wave(plan,sim.expand(plan),true);
  const count=rules.events.length;
  const tile=board.querySelector('.tile[data-index="'+b+'"]');if(tile){tile.classList.add('reaction-preview');tile.dataset.preview=count?'✦'+count:'·';}
  const direction=b===a-7?'上':b===a+7?'下':b<a?'左':'右';
  if(count)notes.push(direction+'换：'+[...new Set(rules.events.map(e=>e.name))].join('＋'));
 }
 status.textContent=notes.length?notes.join(' / '):'先交换连成三颗，留下附着，下一步安排反应';
}
function beginSkill(){
 if(!canAct()||state.energy<skillCost()||state.skillTurn===elements.turn)return;
 if(skillMode){skillMode=null;render();hud();return;}
 skillMode={source:null,e:mirrorElement};state.hammer=false;state.selected=-1;
 render();
 $('caption').textContent=data.partner===0?'先点一颗有附着的糖，再点无附着的普通糖。':data.partner===4?'点一颗已有附着的糖，将它转换成'+names[ElementSystem.ids.indexOf(mirrorElement)]:'点选要施加元素的糖果';
 hud();
}
async function useSkill(i){
 if(!lessonAllowsSkillTarget(i))return;
 const p=data.partner,c=engine.cells[i];let entries=[];
 if(p===0){if(skillMode.source===null){if(!c.aura){toast('先选一颗有元素附着的糖');return;}skillMode.source=c.id;state.selected=i;render();hud();return;}const source=engine.cells.find(x=>x.id===skillMode.source);if(!source?.aura||c.aura||c.s||c===source){toast('再选一颗没有附着的普通糖');return;}c.aura={...source.aura};delete source.aura;
 }else if(p===4){if(!c.aura){toast('绯镜只转换已有附着');return;}if(c.aura.e===mirrorElement){toast('这颗糖已经是该元素');return;}elements.attach(i,mirrorElement);burst('万象折光','绯镜与你重新安排命运');
 }else{entries=[{i,e:p===1?'water':p===2?'fire':'grass'}];}
 if(entries.length&&elements.used>=ElementSystem.reactionLimit&&c.aura&&c.aura.e!==entries[0].e&&StarCandyEffects.reaction(c.aura.e,entries[0].e)[0]!=='replace'){toast('本步两次反应已用完，先交换消除，或选择无附着的糖备元素');return;}
 StarCandyPlaytest.record('skill_use',{level:state.level+1,partner:data.partner,trial:state.trial===true,run:releaseRun?.props.run});state.energy-=skillCost();state.skillTurn=elements.turn;state.skillUsed=true;skillMode=null;state.selected=-1;
 if(state.lesson==='skill')state.lesson='react';
 elements.events=[];const clear=elements.pulse(entries);practiceAfterSkill(elements.events);showReactionEvents();render();hud();tone(3);
 if(clear.size){state.busy=true;await resolve({clear,creates:new Map(),reactionOnly:true},[],state.epoch,false);}else snapshot();
}
function skillCost(){return data.partner===4?50:40;}
function refreshPartnerUI(){
 $('partnerName').textContent=partners[data.partner].name+' · '+skillNames[data.partner];
 $('energyText').textContent=(skillMode?'选中目标 · 再点技能取消':state.skillTurn===elements.turn?'本步已使用 · 消除后再次准备':skillNames[data.partner]+' · '+state.energy+' / '+skillCost());
 $('energyBar').style.width=(state.energy/skillCost()*100)+'%';$('skill').disabled=!canAct()||state.energy<skillCost()||state.skillTurn===elements.turn;$('skill').textContent=skillMode?'取消':'共鸣';
 $('mirrorPicker').hidden=data.partner!==4;
}
function extraUI(){
 $('pageNav').innerHTML='<button data-route="home"><b>⌂</b>大厅</button><button data-route="map"><b>♧</b>旅途</button><button data-route="partners"><b>♡</b>伙伴</button><button data-route="records"><b>✧</b>小屋</button>';
 const strip=document.createElement('div');strip.className='element-panel';strip.innerHTML='<button data-action="elements">七元素反应手册 ↗</button><span id="reactionStatus">首轮三消染两颗 · 即时反应每步最多两次</span>';$('boardShell').after(strip);
 const picker=document.createElement('label');picker.id='mirrorPicker';picker.hidden=true;picker.innerHTML='<span>折光元素</span><select id="mirrorElement" aria-label="选择绯镜折光元素">'+ElementSystem.ids.map(e=>'<option value="'+e+'">'+auraNames[e]+'</option>').join('')+'</select>';document.querySelector('.tool-row').append(picker);
 const exit=document.createElement('button');exit.id='trialExit';exit.hidden=true;exit.dataset.action='exitTrial';exit.textContent='退出试用';document.querySelector('.top-right').append(exit);
 $('mirrorElement').onchange=e=>{mirrorElement=e.target.value;};
}
// Legacy shape retained; paid passes have been retired.
function normalizeMonthCard(){return {version:1,startsAt:0,expiresAt:0,claimedDays:[]};}
data.monthCard=normalizeMonthCard();
function monthCardActive(){return false;}
function monthCardBanner(){return '';}
function handleMonthCardAction(b){
 if(['monthCard','monthCardClaim'].includes(b.dataset.action)){showShop('rewards');return true;}
 return false;
}

// Legacy save compatibility. Starting or retrying a game is now free of stamina.
const staminaRules={max:50,cost:0,interval:300000};
function normalizeStamina(raw){
 const now=Date.now();return {version:3,value:Number.isInteger(raw?.value)?Math.max(0,Math.min(100,raw.value)):50,updatedAt:Number.isFinite(raw?.updatedAt)?Math.min(now,raw.updatedAt):now,recovery:0};
}
data.stamina=normalizeStamina(data.stamina);
function syncStamina(){return data.stamina;}
function spendStamina(){return true;}
function staminaView(){return '';}
function updateStaminaView(){}
function handleStaminaAction(b){
 if(b.dataset.action==='staminaInfo'){showDialog('<h2 id="dialogTitle">自在出发</h2><p>闯关与重试都不再消耗体力，按自己的节奏玩就好。</p><button class="primary" data-action="close">知道了</button>');return true;}
 if(b.dataset.action==='staminaBack'){closeDialog();return true;}return false;
}

// Free progression offers. No cash checkout.
const partnerOffers=[
 {id:'moonPartner',partner:0,name:'月见',kind:'free',price:0},
 {id:'mioPartner',partner:1,name:'澪',kind:'coins',price:600},
 {id:'flamePartner',partner:2,name:'小焰',kind:'coins',price:1800},
 {id:'sproutPartner',partner:3,name:'青芽',kind:'coins',price:1800},
 {id:'mirrorPartner',partner:4,name:'绯镜',kind:'ads',price:2}
];
function partnerOwned(i){return i===0||Number.isInteger(i)&&i>0&&i<5&&data.economy.ownedPartners.includes(i);}
function partnerPrice(i){const p=partnerOffers[i];return p.kind==='free'?'默认同行':p.kind==='ads'?'完整观看 2 次广告':p.price+' 金币';}
function showPartnerOffer(i){
 const p=partnerOffers[i];if(!p)return;
 const pending=p.kind==='ads'&&readPendingAd()?.offer==='mirror',unavailable=p.kind==='ads'&&StarCandyAds.availability();
 showDialog('<div class="premium-portrait">'+portrait(i)+'</div><h2 id="dialogTitle">'+p.name+' · '+skillNames[i]+'</h2><p>'+skillCopies[i]+'</p><p>'+partnerPrice(i)+' · 永久解锁</p>'+(p.kind==='ads'&&!partnerOwned(i)?'<p>已完成 '+mirrorAdProgress()+'/2 次；提前关闭或播放失败不计入。</p>':'')+(partnerOwned(i)?'<button class="primary" data-action="choosePartner" data-partner="'+i+'">邀请同行</button>':p.kind==='ads'?pending?'<button class="primary" data-action="adRetryGrant">保存已完成的广告进度</button>':'<button class="primary" data-action="adMirror" '+(unavailable?'disabled':'')+'>'+(unavailable?'视频暂不可用':'看广告 · '+(mirrorAdProgress()+1)+'/2')+'</button>':'<button class="primary" data-action="buyAsk" data-good="'+p.id+'">'+partnerPrice(i)+' 解锁</button>')+'<button class="secondary" data-action="practicePartner" data-partner="'+i+'">免费练习 · 先试试技能</button><button class="text-button" data-action="close">返回</button>');
}
function showCashOffer(){showShop('rewards');}

// Native H5 rewarded video. show() resolution is NOT a completion receipt.
const StarCandyAds=(()=>{
 let active=null;
 const error=(message,code)=>Object.assign(new Error(message),{code});
 function availability(){
  const c=StarCandyRelease.rewardedAdSupply;
  if(!c?.adUnitId||!StarCandyRelease.ads||!c.enabled)return '视频补给尚未开通，普通游玩照常进行';
  if(typeof globalThis.tap?.createRewardedVideoAd!=='function')return '请从 TapTap 客户端打开游戏使用视频补给';
  return '';
 }
 function message(e){return ({1001:'广告配置有误，请稍后再试',1002:'广告位尚不可用，请稍后再试',1004:'暂时没有可播放的视频，请稍后再来',1005:'广告位仍在审核，请稍后再来',1006:'广告位未通过审核',1007:'广告服务暂不可用',1008:'广告位尚未开启'})[Number(e?.errCode)]||'视频未能播放，请检查网络后重试';}
 function watch(onStage=()=>{}){
  const unavailable=availability();if(unavailable)return Promise.reject(error(unavailable,'unavailable'));
  if(active)return Promise.reject(error('已有视频正在处理','busy'));
  return new Promise((resolve,reject)=>{
   let ad=null,settled=false,timer=null,requested=false;
   const finish=(err,result)=>{
    if(settled)return;settled=true;clearTimeout(timer);active=null;
    try{ad?.offClose?.(onClose);}catch(_){}
    try{ad?.offError?.(onError);}catch(_){}
    try{ad?.destroy?.();}catch(_){}
    err?reject(err):resolve(result);
   };
   const arm=ms=>{clearTimeout(timer);timer=setTimeout(()=>finish(error('等待视频超时，没有扣除领取次数；请稍后重试','timeout')),ms);};
   const onClose=res=>finish(null,{completed:requested&&res?.isEnded===true});
   const onError=e=>finish(error(message(e),'platform'));
   active={cancel:()=>finish(error('已取消本次视频，没有发放奖励','cancelled'))};
   try{
    ad=globalThis.tap.createRewardedVideoAd({adUnitId:StarCandyRelease.rewardedAdSupply.adUnitId});
    if(!ad||['onClose','onError','load','show'].some(k=>typeof ad[k]!=='function'))throw error('当前客户端不支持完整广告接口，请更新 TapTap 后重试','environment');
    ad.onClose(onClose);ad.onError(onError);arm(25000);onStage('loading');
    Promise.resolve(ad.load()).then(()=>{
     if(settled)return;requested=true;arm(300000);onStage('playing');return ad.show();
    }).catch(e=>{if(!settled)finish(error(message(e),'platform'));});
   }catch(e){finish(error(e.code?e.message:message(e),e.code||'platform'));}
  });
 }
 return {availability,watch,cancel:()=>active?.cancel(),busy:()=>!!active};
})();

// Client-side supplies, not a server-verified entitlement ledger.
const adSupplyOffers=[
 {id:'coins',name:'旅途金币',icon:'coin',amount:120,unit:'金币',copy:'补充道具，邀请新的同行伙伴。'},
 {id:'diamonds',name:'星愿钻石',icon:'diamond',amount:3,unit:'钻石',copy:'积攒钻石，兑换喜欢的小屋装饰。'}
];
const mirrorAdOffer={id:'mirror',name:'绯镜',amount:0,unit:'次'};
const adPendingKey='starCandy.rewarded.pending.v1';
let adInFlight=false,adPending=null;
function normalizeAdLedger(raw){
 const receipts=(Array.isArray(raw?.receipts)?raw.receipts:[]).filter(r=>r&&typeof r.id==='string'&&r.id.length<=100&&['coins','diamonds','stamina','mirror'].includes(r.offer)&&Number.isSafeInteger(r.at)&&r.at>0&&typeof r.day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(r.day));
 return {receipts:[...new Map(receipts.map(r=>[r.id,{id:r.id,offer:r.offer,at:r.at,day:r.day}])).values()].sort((a,b)=>a.at-b.at).slice(-96)};
}
function mergeAdLedger(a,b){return normalizeAdLedger({receipts:[...(a?.receipts||[]),...(b?.receipts||[])]});}
function mirrorAdProgress(){return Math.min(2,Math.max(data.economy.mirrorAdViews||0,data.economy.adSupply.receipts.filter(r=>r.offer==='mirror').length));}
function readPendingAd(){
 if(!adPending){try{const p=JSON.parse(localStorage.getItem(adPendingKey)||'null');if(p&&normalizeAdLedger({receipts:[p]}).receipts.length)adPending=p;}catch(_){} }
 if(adPending&&data.economy.adSupply.receipts.some(r=>r.id===adPending.id)){adPending=null;try{localStorage.removeItem(adPendingKey);}catch(_){} }
 return adPending;
}
function adLimitReason(offer){
 const receipts=data.economy.adSupply.receipts,today=localDay(),last=receipts[receipts.length-1];
 if(last&&(today<last.day||Date.now()<last.at))return '设备时间发生变化，请校准时间后再来';
 const todayReceipts=receipts.filter(r=>r.day===today);
 if(todayReceipts.length>=6)return '今日6次补给已领完，明天再来';
 if(todayReceipts.filter(r=>r.offer===offer).length>=3)return '这份补给今日已领3次';
 return '';
}
function adSupplyMarkup(){
 const unavailable=StarCandyAds.availability(),pending=readPendingAd();
 return '<div class="ad-supply-intro"><small>DAILY LITTLE GIFTS</small><h3>给旅途一点小小补给</h3><p>自愿看完一段视频后领取。提前关闭或播放失败不发奖励，正常闯关无需看广告。</p><span class="ad-review-status">'+(unavailable||'完整观看后领取 · 每日合计6次')+'</span></div>'+(pending?'<div class="ad-stamina-note"><b>有一份已看完的视频'+(pending.offer==='mirror'?'解锁进度':'奖励')+'等待保存</b><button class="primary" data-action="adRetryGrant">重新保存，无需再看视频</button></div>':'')+'<div class="ad-supply-grid">'+adSupplyOffers.map(p=>{
  const used=data.economy.adSupply.receipts.filter(r=>r.day===localDay()&&r.offer===p.id).length;
  return '<article class="ad-supply-card"><div class="ad-supply-icon">'+lobbyIcon(p.icon)+'</div><div><h3>'+p.name+'</h3><strong>+'+p.amount+' '+p.unit+'</strong><p>'+p.copy+'</p><small>今日已领 '+used+'/3 次</small></div><button class="primary" data-action="adSupply" data-offer="'+p.id+'" '+(unavailable||pending?'disabled':'')+'>'+(unavailable?'暂不可用':'看视频 · 领取补给')+'</button></article>';
 }).join('')+'</div><p class="economy-note">每项每日最多3次，合计最多6次。领完即可选择下一份补给，无额外等待。次数按当前存档和设备日期计算。<button class="text-button" data-action="shop" data-tab="rewards">刷新领取状态</button></p><div class="free-income"><h3>不用看广告，也能慢慢收集</h3><p>首次通关60 / 60 / 90金币；重玩胜利30金币。每完成一组三关收藏，首次额外获得5钻石。累计签到第7次再得5钻石。</p><button class="secondary" data-action="daily">领取每日签到</button></div>';
}
function adStaminaEntry(){return '';}
function adProgress(message){
 showDialog('<h2 id="dialogTitle">视频补给</h2><p role="status">'+message+'</p><p>完整观看后才领取奖励。取消、无可用视频或播放失败均不消耗次数。</p><button class="secondary" data-action="adCancel">取消本次视频</button>');
 const close=dialog.querySelector('.dialog-corner-close');if(close)close.dataset.action='adCancel';
}
function grantPendingAd(){
 const p=readPendingAd();if(!p)return;
 if(state.active||state.trial||StarCandySave.blocked){toast('请先结束对局并处理存档提示，再保存奖励');return;}
 const offer=p.offer==='stamina'?{amount:100,unit:'金币',id:'coins'}:p.offer==='mirror'?mirrorAdOffer:adSupplyOffers.find(o=>o.id===p.offer);if(!offer)return;
 const beforeEconomy=data.economy,beforeStamina=data.stamina,beforeHome=data.home;
 data.economy=JSON.parse(JSON.stringify(beforeEconomy));data.stamina={...beforeStamina};
 let amount=offer.amount,unlockedMirror=false;
 if(p.offer==='mirror'){
  data.economy.mirrorAdViews=Math.min(2,mirrorAdProgress()+1);
  if(data.economy.mirrorAdViews===2&&!data.economy.ownedPartners.includes(4)){
   data.economy.ownedPartners.push(4);unlockedMirror=true;
   data.home=JSON.parse(JSON.stringify(beforeHome));recordRoomNoteSignal('partner',4);
  }
 }else data.economy[offer.id]+=amount;
 data.economy.adSupply=mergeAdLedger(data.economy.adSupply,{receipts:[p]});
 // Wallet and receipt commit together; duplicate callbacks cannot grant twice.
 if(!persist()){
  data.economy=beforeEconomy;data.stamina=beforeStamina;data.home=beforeHome;
  showDialog('<h2 id="dialogTitle">视频已看完，奖励等待保存</h2><p>本次奖励尚未写入存档。请保持页面打开，处理存储问题后重试，无需再看视频。</p><button class="primary" data-action="adRetryGrant">重新保存奖励</button><button class="secondary" data-action="saveCenter">查看存档状态</button>');return;
 }
 adPending=null;try{localStorage.removeItem(adPendingKey);}catch(_){}
 if(p.offer==='mirror'){
  if(unlockedMirror)StarCandyPlaytest.record('partner_unlock',{partner:4,ads:2});
  showPartnerOffer(4);toast(partnerOwned(4)?'绯镜已解锁，可以邀请同行':'已完成 1/2 次，进度已保存');
 }else{showShop('rewards');toast((p.offer==='stamina'?'旧体力补给已转换：':'已领取 ')+amount+' '+offer.unit);}
}
async function requestAdSupply(id){
 if(adInFlight)return;
 const offer=id==='mirror'?mirrorAdOffer:adSupplyOffers.find(o=>o.id===id);if(!offer)return;
 if(id==='mirror'&&partnerOwned(4))return showPartnerOffer(4);
 if(readPendingAd()){grantPendingAd();return;}
 if(state.active||state.trial)return toast('请先结束当前对局，再领取视频补给');
 syncStamina();const reason=StarCandyAds.availability()||adLimitReason(id);if(reason)return toast(reason);
 if(StarCandySave.blocked||!persist())return toast('请先处理存档保存问题，再观看视频');
 adInFlight=true;globalThis.StarCandyMusic?.duck?.(0);
 const receipt={id:globalThis.crypto?.randomUUID?.()||('ad-'+Date.now()+'-'+Math.random().toString(36).slice(2)),offer:id,at:Date.now(),day:localDay()};
 try{
  const result=await StarCandyAds.watch(stage=>adProgress(stage==='loading'?'正在准备视频…':'视频播放中，等待完整观看结果…'));
  adInFlight=false;
  if(!result.completed){id==='mirror'?showPartnerOffer(4):showShop('rewards');toast('视频未完整观看，没有扣次数或发放奖励');return;}
  receipt.at=Date.now();receipt.day=localDay();adPending=receipt;
  // Journal is created only after the real completion event, never on click or timeout.
  try{localStorage.setItem(adPendingKey,JSON.stringify(receipt));}catch(_){}
  grantPendingAd();
 }catch(e){adInFlight=false;id==='mirror'?showPartnerOffer(4):showShop('rewards');toast(e.message);}
 finally{adInFlight=false;globalThis.StarCandyMusic?.duck?.(1);}
}
function handleAdAction(b){
 const action=b.dataset.action;
 if(action==='adCancel'){StarCandyAds.cancel();return true;}
 if(action==='adSupply'){requestAdSupply(b.dataset.offer);return true;}
 if(action==='adMirror'){requestAdSupply('mirror');return true;}
 if(action==='adRetryGrant'){StarCandySave.retry();grantPendingAd();return true;}
 return false;
}
// Imports and routing must not replace the wallet during an outstanding native ad.
document.addEventListener('click',e=>{if(adInFlight&&!e.target.closest?.('[data-action="adCancel"]')){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('keydown',e=>{if(adInFlight&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();StarCandyAds.cancel();}},true);

// Wallet and store are local prototype systems; no remote payment or billing.
function normalizeEconomy(raw){
 const n=(v,f=0)=>Number.isSafeInteger(v)&&v>=0&&v<=10000000?v:f;
 const e={version:3,coins:360,diamonds:0,inventory:{hammer:3,shuffle:2},ownedPartners:[0],mirrorAdViews:0,decor:[],activeDecor:[],checkin:{last:'',count:0},legacyDiamondCoins:0,chapterSupply:false,milestoneClaims:[],milestoneRate:5,challenge:normalizeChallenge(raw?.challenge),adSupply:normalizeAdLedger(raw?.adSupply)};
 if(!raw||![1,2,3].includes(raw.version))return e;
 e.chapterSupply=raw.chapterSupply===true||!!data.stars[5];
 e.coins=n(raw.coins);e.diamonds=n(raw.diamonds);e.legacyDiamondCoins=n(raw.legacyDiamondCoins);
 e.ownedPartners=[0,...[1,2,3,4].filter(i=>Array.isArray(raw.ownedPartners)&&raw.ownedPartners.includes(i))];
 e.mirrorAdViews=Math.min(2,Math.max(n(raw.mirrorAdViews),e.adSupply.receipts.filter(r=>r.offer==='mirror').length));
 if(raw.paidMirror===true&&!e.ownedPartners.includes(4))e.ownedPartners.push(4);
 if(raw.version===1&&!e.ownedPartners.includes(1))e.ownedPartners.push(1);
 e.inventory={hammer:n(raw.inventory?.hammer),shuffle:n(raw.inventory?.shuffle)};
 e.decor=['wishStar','moon','stars'].filter(id=>Array.isArray(raw.decor)&&raw.decor.includes(id));e.activeDecor=e.decor.filter(id=>Array.isArray(raw.activeDecor)&&raw.activeDecor.includes(id));
 if(typeof raw.checkin?.last==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(raw.checkin.last)&&Number.isFinite(Date.parse(raw.checkin.last+'T12:00:00')))e.checkin.last=raw.checkin.last;
 e.checkin.count=n(raw.checkin?.count);
 e.milestoneClaims=[...new Set((Array.isArray(raw.milestoneClaims)?raw.milestoneClaims:[]).filter(g=>Number.isInteger(g)&&g>=0&&g<levels.length/3))];
 if(raw.milestoneRate!==5)e.diamonds=Math.min(10000000,e.diamonds+2*e.milestoneClaims.length);
 for(let g=0;g<levels.length/3;g++)if(data.stars.slice(g*3,g*3+3).every(Boolean)&&!e.milestoneClaims.includes(g)){e.milestoneClaims.push(g);e.diamonds=Math.min(10000000,e.diamonds+5);}
 return e;
}

data.economy=normalizeEconomy(data.economy);if(!partnerOwned(data.partner))data.partner=0;
let shopTab='coins',shopBackToPrep=false,uiIconSerial=0;
function lobbyIcon(type){
 if(['coin','diamond','hammer','shuffle','mail','calendar'].includes(type))return '<span class="lobby-icon prop-art prop-'+type+'" aria-hidden="true"><i></i></span>';
 const id='lobby-gold-'+(++uiIconSerial),shapes={
 mail:'<rect x="10" y="19" width="44" height="29" rx="5"/><path d="m12 22 20 15 20-15M12 45l13-12m27 12L39 33" fill="none"/><circle cx="32" cy="35" r="6" fill="#bc789e"/><path d="m32 30 1.5 3.5L37 35l-3.5 1.5L32 40l-1.5-3.5L27 35l3.5-1.5Z" stroke="none"/>',
 chat:'<path d="M13 15h37a7 7 0 0 1 7 7v20a7 7 0 0 1-7 7H28L17 57V49h-4a7 7 0 0 1-7-7V22a7 7 0 0 1 7-7Z"/><path d="M35 21a13 13 0 1 0 10 19 12 12 0 0 1-10-19Z" fill="#806393"/><path d="m44 22 1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8Z" fill="#fff3cf" stroke="none"/>',
 settings:'<path d="m26 7 12 0 2 8 6 4 8-2 6 10-6 6v7l5 6-7 10-8-3-6 3-2 7H24l-2-8-6-4-8 2-6-10 6-6v-7l-5-6 7-10 8 3 6-3Z" transform="translate(4 -2) scale(.87)"/><circle cx="32" cy="31" r="12" fill="#6d4e82"/><circle cx="32" cy="31" r="6" fill="#ddc5eb"/>',
 shop:'<path d="M12 26h40l4 28H8Z"/><path d="M22 26V18a10 10 0 0 1 20 0v8" fill="none" stroke-width="4"/><path d="m32 30 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1Z" fill="#9e6898"/>',
 calendar:'<rect x="10" y="14" width="44" height="42" rx="7"/><path d="M10 27h44M22 7v14M42 7v14" fill="none" stroke-width="4"/><path d="m23 40 6 6 13-14" fill="none" stroke="#94618b" stroke-width="5"/>',
 coin:'<circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="18" fill="none"/><path d="m32 17 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2Z" fill="#af743c"/>',
 diamond:'<path d="m17 13 30 0 12 17-27 29L5 30Z" fill="#b6ddff"/><path d="m17 13 8 17 7 29 7-29 8-17M5 30h54M25 30l7-17 7 17" fill="none" stroke="#fff2ff"/>',
 hammer:'<path d="m36 29 7 7-21 25-8-8Z"/><rect x="17" y="10" width="39" height="23" rx="5" transform="rotate(30 36 22)" fill="#bd9bde"/>',
 shuffle:'<path d="M8 20h10c12 0 17 24 29 24h9M8 44h10c12 0 17-24 29-24h9" fill="none" stroke-width="5"/><path d="m48 12 9 8-9 8m0 8 9 8-9 8" fill="none" stroke-width="5"/>',
 moon:'<path d="M37 7a25 25 0 1 0 20 37A24 24 0 0 1 37 7Z"/><path d="m46 12 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#e9d4ff"/>',
 stars:'<path d="m32 7 6 16 17 1-13 11 5 17-15-9-15 9 5-17L9 24l17-1Z"/><path d="M10 5v11m-5-6h11M52 43v14m-7-7h14" fill="none"/>'
 };
 return '<svg class="lobby-icon icon-'+type+'" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="'+id+'" x2=".8" y2="1"><stop stop-color="#fff5d6"/><stop offset=".5" stop-color="#eed39b"/><stop offset="1" stop-color="#b88a5b"/></linearGradient></defs><g fill="url(#'+id+')" stroke="#fff0c8" stroke-width="1.5" stroke-linejoin="round">'+(shapes[type]||shapes.stars)+'</g></svg>';
}
function walletView(compact=false){const display=n=>compact&&n>=10000?(n/10000).toFixed(1).replace(/\.0$/,'')+'万':n;return '<div class="wallet-row"><button data-action="shop" data-tab="coins" aria-label="金币 '+data.economy.coins+'，打开金币商店">'+lobbyIcon('coin')+'<b>'+display(data.economy.coins)+'</b><span>金币</span></button><button data-action="shop" data-tab="diamonds" aria-label="钻石 '+data.economy.diamonds+'，打开钻石商店">'+lobbyIcon('diamond')+'<b>'+display(data.economy.diamonds)+'</b><span>钻石</span></button></div>';}
function localDay(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function canCheckin(){return localDay()>data.economy.checkin.last;}
function renderEconomyLobby(){
 const completed=journeyComplete(),wish=currentWish(),unread=availableLetters().filter(l=>!data.home.read.includes(l.id)).length,pending=state.active?state:data.snapshot,first=!completed&&!firstLightComplete(),ready=first&&ownedItem(0),homeTask=completed||first?null:roomTaskWish();
 const rail=first?'<button class="lobby-medallion" data-action="firstLightPreview">'+collectionArt(0)+'<span>夜灯预览</span></button><button class="lobby-medallion" data-action="lobbyMore">'+lobbyIcon('stars')+'<span>更多</span></button>':'<button class="lobby-medallion" data-action="daily">'+lobbyIcon('calendar')+'<span>每日签到</span>'+(canCheckin()?'<em>可领</em>':'')+'</button><button class="lobby-medallion" data-action="shop">'+lobbyIcon('shop')+'<span>心愿商店</span></button><button class="lobby-medallion" data-action="wcMailbox">'+lobbyIcon('mail')+'<span>月光信箱</span>'+(unread?'<em>'+unread+'</em>':'')+'</button><button class="lobby-medallion" data-action="challenge">'+lobbyIcon('stars')+'<span>限时挑战</span></button>';
 const action=pending?'resume':completed?'journeyEnding':ready?'firstLightRoom':homeTask?homeTask.action:'journey';
 const label=pending?'继续未完成对局':completed?'未完待续 · 下一程再相见':ready?(roomPlaced(0)?'回小屋 · 亲手点亮':'带回夜灯 · 选择位置'):homeTask?homeTask.button:'开始第 '+data.unlocked+' 关';
 return '<section class="art-page world-home economy-home '+(first?'first-light-home':'')+'"><div class="world-scene"></div><div class="lobby-layout"><header class="art-lobby-head"><h1 class="screen-title" tabindex="-1">星糖物语<small>和你一起，把心愿带回家</small></h1></header><div class="lobby-topbar moonlight-ribbon free-play-ribbon">'+walletView(true)+'<button class="lobby-medallion lobby-settings" data-action="preferences" aria-label="设置">'+lobbyIcon('settings')+'<span>设置</span></button></div><div class="lobby-left-rail">'+rail+'</div></div><button class="lobby-talk" data-action="wcTalk">'+lobbyIcon('chat')+'<span>和月见聊聊</span></button><div class="world-speech">'+(ready?'第一盏灯，等你亲手点亮。':first?'一起完成三次小冒险，为家点一盏灯。':homeTask?homeTask.detail:wish.upcoming?wish.detail:wish.index!==undefined?'新收藏带回来啦，一起找个位置吧。':'三次小小的冒险，带回一份心愿。')+'</div><div class="art-dock world-home-dock"><button class="world-task" data-action="wcWish">'+(first?collectionArt(0):wish.index!==undefined?collectionArt(wish.index):lobbyIcon('stars'))+'<div><small>'+(first?'第一份心愿 · '+stageCount(0)+'/3 关':'当前心愿 · '+collectibles.filter((_,i)=>ownedItem(i)).length+'/12 收藏')+'</small><strong>'+wish.title+'</strong><p>'+wish.detail+'</p></div></button><button class="primary art-gold" data-action="'+action+'" '+(homeTask?'data-item="'+homeTask.index+'"':'')+'>'+label+'</button><div class="world-secondary"><button data-action="map">旅途地图 · '+data.stars.filter(Boolean).length+'/'+levels.length+' 关 ›</button><button data-action="records">回小屋布置 ›</button></div></div></section>';
}
function stageCount(group){return data.stars.slice(group*3,group*3+3).filter(Boolean).length;}
function renderStageMap(screen){
 if(chapterView===null)chapterView=Math.floor((data.unlocked-1)/12);
 const ch=Math.max(0,Math.min(chapterNames().length-1,chapterView)),target=Math.min(ch*12+11,data.unlocked-1),group=Math.max(ch*4,Math.floor(target/3)),locked=ch*12>=data.unlocked;
 const completed=journeyComplete()&&ch===chapterNames().length-1;
 const coords=[[[23,68],[73,52],[29,34],[75,24]],[[73,66],[28,51],[72,38],[30,25]],[[22,68],[72,58],[26,41],[76,28]]][ch%3];
 screen.innerHTML='<section class="art-page world-map world-map-'+ch+'"><div class="world-map-canvas"><div class="world-scene"></div><canvas id="worldWater" aria-hidden="true"></canvas></div>'+artHeader('星愿旅途','<span class="art-pill">✦ '+data.stars.reduce((a,b)=>a+b,0)+'/'+(levels.length*3)+'</span>')+'<div class="art-chapters"><button data-action="chapter" data-step="-1" '+(ch===0?'disabled':'')+'>‹</button><div><h2>'+chapterNames()[ch]+'</h2><small>第 '+(ch+1)+' 章 · '+data.stars.slice(ch*12,ch*12+12).filter(Boolean).length+'/12 关</small></div><button data-action="chapter" data-step="1" '+(ch===chapterNames().length-1?'disabled':'')+'>›</button></div><div class="world-map-stops">'+coords.map(([x,y],j)=>{const g=ch*4+j,closed=g*3>=data.unlocked,done=stageCount(g);return '<div class="world-stop '+(Math.floor((data.unlocked-1)/3)===g?'current':'')+'" style="left:'+x+'%;top:'+y+'%"><button data-action="stageGroup" data-group="'+g+'" aria-label="'+worldPlaces[g]+'，第'+(g*3+1)+'到'+(g*3+3)+'关"><b>'+(g+1)+'</b><span>'+worldPlaces[g]+'</span></button><small>'+(closed?'第 '+(g*3+1)+'—'+(g*3+3)+' 关 · 待解锁':done+'/3 关 '+(done===3?'· 已收藏':g>=12?'· 旅途后记收集中':'· 心愿收集中'))+'</small></div>';}).join('')+'</div><div class="art-dock world-map-dock"><div class="world-map-reward">'+journeyRewardArt(group)+'<div><small>完成三关获得 · '+stageCount(group)+'/3</small><strong>'+journeyReward(group).name+'</strong></div></div><button class="primary art-gold" data-action="'+(completed?'journeyEnding':'level')+'" data-level="'+target+'" '+(locked?'disabled':'')+'>'+(completed?'未完待续 · 下一程再相见':locked?'尚未开启':'开始第 '+(target+1)+' 关')+'</button></div></section>';
 requestAnimationFrame(()=>startWorldWater(ch%3));return true;
}
function stagePreparation(level){const g=Math.floor(level/3);return '<div class="stage-progress"><span>'+journeyRewardArt(g)+'</span><div><b>'+journeyReward(g).name+'</b><small>本组第 '+(level%3+1)+'/3 关 · 完成第 '+(g*3+3)+' 关获得</small><div class="stage-dots">'+[0,1,2].map(n=>'<i class="'+(data.stars[g*3+n]?'done':n===level%3?'current':'')+'">'+(data.stars[g*3+n]?'✓':n+1)+'</i>').join('')+'</div></div></div>';}
function showStageGroup(group){
 if(!Number.isInteger(group)||group<0||group>=levels.length/3)return;
 showDialog('<h2 id="dialogTitle">'+worldPlaces[group]+'</h2>'+stagePreparation(Math.min(group*3+2,Math.max(group*3,data.unlocked-1)))+'<div class="stage-choices">'+[0,1,2].map(n=>{const i=group*3+n,l=levels[i],locked=i>=data.unlocked;return '<button data-action="level" data-level="'+i+'" '+(locked?'disabled':'')+'><b>第 '+(i+1)+' 关 · '+l.title.split(' · ').pop()+'</b><small>'+ (data.stars[i]?'★'.repeat(data.stars[i]):locked?'完成前一关解锁':chapterGoalSummary(i)+' · '+l.moves+' 步')+'</small><span>'+ (n===2?(group>=12?'旅途后记':'收藏')+' + 90 金币 · 首次集齐另得3钻石':'60 金币')+'</span></button>';}).join('')+'</div><p class="economy-note">首次通关奖励。已完成关卡可重玩，每次胜利获得 20 金币。</p><button class="secondary" data-action="close">返回地图</button>');
}
function awardStage(won,firstClear){
 const reward={coins:0,diamonds:0};if(!won||state.mode!=='story'||state.trial)return reward;
  reward.coins=firstClear?(state.level%3===2?90:60):30;reward.diamonds=0;
  const group=Math.floor(state.level/3);if(stageCount(group)===3&&!data.economy.milestoneClaims.includes(group)){reward.diamonds=5;data.economy.milestoneClaims.push(group);data.economy.diamonds+=5;}
 data.economy.coins+=reward.coins;chapterSupply(reward,won,firstClear);return reward;
}
function renderStageResult(){
 if(state.level>=36)return renderReturnResult();
 const r=lastResult,i=state.level,g=Math.floor(i/3),c=collectibles[g],gift=r.won&&i%3===2,rew=r.reward||{coins:0,diamonds:0};
 return '<section class="mobile-result"><div class="result-small-art">'+portrait(data.partner)+'</div><div class="result-stars">'+(r.won?'★'.repeat(r.stars)+'☆'.repeat(3-r.stars):'✧')+'</div><h1 class="screen-title" tabindex="-1">'+(r.won?gift?'这份心愿，可以带回家了':'又离心愿近了一步':'再试一次，就更近一点')+'</h1><p>'+levels[i].title+' · 第 '+(i+1)+' 关</p><div class="result-tally"><span>本局星光<strong>'+state.score.toLocaleString()+'</strong></span><span>剩余步数<strong>'+state.moves+'</strong></span></div>'+chapterResultGoals()+(r.won?'<div class="earned-currency">'+lobbyIcon('coin')+'<b>+'+rew.coins+'</b>'+(rew.diamonds?lobbyIcon('diamond')+'<b>+'+rew.diamonds+'</b>':'')+'<small>'+(rew.diamonds?'通关奖励 · 收藏集齐 +3钻石':r.firstClear?'首次通关奖励':'重玩奖励')+'</small></div>'+(rew.chapterCoins?'<p class="chapter-supply">已含花溪补给 · +'+rew.chapterCoins+'金币</p>':'')+chapterInvitation()+(gift?'<div class="world-reward-reveal">'+collectionArt(g)+'<h2>'+c.name+'</h2><p>'+(r.firstClear?'三关完成 · 新收藏已收入收藏柜':'已拥有的收藏 · 星级记录已更新')+'</p></div>':stagePreparation(i)+'<p>还差 '+(3-stageCount(g))+' 关，就能获得'+c.name+'。</p>')+'<button class="secondary" data-action="rgPreview" data-item="'+g+'">'+(gift?'看看摆进小屋的样子':'预览下一份心愿 · '+stageCount(g)+'/3')+'</button>'+(roomBundles[g]?'<p>'+roomBundles[g]+' · 随收藏一起获得</p>':'')+(i===11?forestWishCard():'')+'<div class="result-actions">'+(gift?'<button class="primary art-gold" data-action="'+(c.slots.length?'wcPlaceItem':'wcMailbox')+'" data-item="'+g+'">'+(g===0&&!firstLightComplete()?'把第一盏灯带回家':c.slots.length?'带回小屋 · 去布置':'打开月光来信')+'</button>':'')+(i<levels.length-1?'<button class="'+(gift?'secondary':'primary art-gold')+'" data-action="next">继续第 '+(i+2)+' 关</button>':'<button class="secondary" data-action="records">七十二关完成 · 回家看看</button>')+'</div>':chapterFailure()+'<button class="primary" data-action="retry">调整伙伴与道具，再试一次</button>')+'<button class="text-button" data-action="map">回旅途地图</button><button class="text-button" data-action="home">回大厅</button></section>';
}
const shopGoods=[
 {id:'hammer',tab:'coins',type:'tool',name:'星锤',price:120,icon:'hammer',copy:'指定清除一颗星糖，不消耗步数。每局最多携带 1 个。'},
 {id:'shuffle',tab:'coins',type:'tool',name:'星盘重排',price:90,icon:'shuffle',copy:'重排棋盘，不消耗步数。每局最多携带 1 个。'},
 ...partnerOffers.filter(p=>['coins','diamonds'].includes(p.kind)).map(p=>({id:p.id,tab:p.kind,type:'partner',partner:p.partner,name:p.name+' · 永久同行',price:p.price,copy:skillCopies[p.partner]})),
 {id:'gold1000',tab:'diamonds',type:'exchange',name:'金币补给',price:10,coins:1000,icon:'coin',copy:'10 钻石兑换 1000 金币。单向兑换，金币不能兑换钻石。'},
 {id:'wishStar',tab:'diamonds',type:'decor',name:'星愿窗铃',price:9,icon:'stars',copy:'一枚轻轻作响的金色星铃。永久装饰，摆上后轻触可听到回应。'},
 {id:'moon',tab:'diamonds',type:'decor',name:'月光窗饰',price:40,icon:'moon',copy:'永久小屋装饰，可随时布置或收起。'},
 {id:'stars',tab:'diamonds',type:'decor',name:'流星挂帘',price:60,icon:'stars',copy:'永久小屋装饰，可随时布置或收起。'}
];
function goodOwned(g){return g.type==='partner'?partnerOwned(g.partner):g.type==='decor'?data.economy.decor.includes(g.id):false;}
function productArt(g){return g.type==='partner'?portrait(g.partner):lobbyIcon(g.icon);}
function showShop(tab=shopTab){
 shopTab=tab==='topup'?'rewards':['coins','diamonds','rewards'].includes(tab)?tab:'coins';

 const goods='<p class="economy-note">'+(shopTab==='coins'?'金币可购买道具，并永久解锁澪、小焰和青芽；绯镜完整观看两次广告即可永久同行。':'钻石来自收藏里程碑、签到与自愿广告补给，可兑换永久装饰或单向兑换金币。')+'</p><div class="shop-goods">'+shopGoods.filter(g=>g.tab===shopTab).map(g=>{const owned=goodOwned(g);return '<article class="product-'+g.type+'"><div class="shop-item-art">'+productArt(g)+'</div><div><h3>'+g.name+'</h3><p>'+g.copy+'</p>'+(g.type==='tool'?'<small>背包已有 '+data.economy.inventory[g.id]+' 个</small>':'')+'</div><button class="primary" data-action="'+(owned&&g.type==='decor'?'toggleDecor':'buyAsk')+'" data-good="'+g.id+'" '+(owned&&g.type==='partner'?'disabled':'')+'>'+(owned?g.type==='partner'?'已解锁':data.economy.activeDecor.includes(g.id)?'已布置 · 收起':'布置到小屋':g.price+' '+(g.tab==='coins'?'金币':'钻石'))+'</button></article>';}).join('')+(shopTab==='coins'?'<article class="product-partner"><div class="shop-item-art">'+portrait(4)+'</div><div><h3>绯镜 · 永久同行</h3><p>'+skillCopies[4]+'</p><small>广告进度 '+mirrorAdProgress()+'/2</small></div><button class="primary" data-action="partnerOffer" data-partner="4">'+(partnerOwned(4)?'已解锁 · 查看':'查看解锁')+'</button></article>':'')+'</div>';
 showDialog('<section class="boutique-sheet"><header class="boutique-fixed"><div class="shop-head boutique-head"><div class="boutique-emblem">'+lobbyIcon('hammer')+lobbyIcon('diamond')+lobbyIcon('shuffle')+'</div><small>WISH BOUTIQUE</small><h2 id="dialogTitle">心愿商店</h2><p>游玩收集心愿 · 自愿视频补给</p></div>'+walletView()+'<div class="shop-tabs">'+[['coins','金币商店'],['diamonds','钻石商店'],['rewards','视频补给']].map(([id,label])=>'<button data-action="shop" data-tab="'+id+'" aria-pressed="'+(id===shopTab)+'">'+label+'</button>').join('')+'</div></header><div class="boutique-scroll"><p class="release-channel-note">免费游玩 · '+(StarCandyRelease.ads?'自愿视频补给':'视频补给待开通')+'</p>'+(shopTab==='rewards'?adSupplyMarkup():goods)+'</div><footer class="boutique-footer"><button class="secondary" data-action="shopClose">'+(shopBackToPrep?'返回关卡准备':'收起商店')+'</button></footer></section>');
}
function showMirrorOffer(){showPartnerOffer(4);}
function prepInventory(p){return '<h3 class="prep-label">本局道具 <small>携带免费，实际使用时扣背包</small></h3><div class="prep-tools"><button data-action="prepTool" data-tool="hammer" aria-pressed="'+p.hammer+'">'+(p.hammer?'✓':'＋')+' 星锤 ×1 <small>库存 '+data.economy.inventory.hammer+'</small></button><button data-action="prepTool" data-tool="shuffle" aria-pressed="'+p.shuffle+'">'+(p.shuffle?'✓':'＋')+' 重排 ×1 <small>库存 '+data.economy.inventory.shuffle+'</small></button></div><button class="text-button prep-shop-link" data-action="prepShop">去商店补充道具 ›</button>';}
function consumeLoadout(p){
 if(!Number.isInteger(p.level)||p.level<0||p.level>=levels.length||(p.mode==='story'&&p.level>=data.unlocked))return false;
 if(!partnerOwned(p.partner)){preparation.partner=0;showPreparation();toast('请先解锁这位伙伴');return false;}
 for(const k of ['hammer','shuffle'])if(p[k]&&data.economy.inventory[k]<1){toast('道具库存不足，请重新选择');showPreparation();return false;}
  return true;
}
const dailyRewards=[{coins:80},{coins:100},{coins:120},{coins:120,hammer:1},{coins:150,shuffle:1},{coins:180},{coins:250,diamonds:5,hammer:1,shuffle:1}];
function dailyCopy(r){return [r.coins?r.coins+' 金币':'',r.diamonds?r.diamonds+' 钻石':'',r.hammer?'星锤 ×1':'',r.shuffle?'重排 ×1':''].filter(Boolean).join(' · ');}
function showDaily(){
 const d=data.economy.checkin,can=canCheckin(),next=d.count%7,week=Math.floor(Math.max(0,d.count-(can?0:1))/7),claimed=d.count-week*7,today=can?next:(d.count+6)%7,r=dailyRewards[today];
 showDialog('<section class="daily-sheet"><header class="daily-heading"><small>SEVEN LITTLE WISHES</small><h2 id="dialogTitle">每日一份小心愿</h2></header><div class="daily-today"><div class="daily-today-art">'+lobbyIcon('calendar')+'</div><div><small>第 '+(today+1)+' 天 · '+(can?'今日可领取':'今日已领取')+'</small><strong>'+dailyCopy(r)+'</strong><span>漏签不清零，累计七次开启下一册</span></div></div><div class="daily-scroll"><div class="daily-book"><div class="daily-grid">'+dailyRewards.map((r,i)=>'<div class="daily-day '+(i<claimed?'claimed':can&&i===next?'today':'')+'"><small>第 '+(i+1)+' 天</small><div class="daily-treasures">'+lobbyIcon('coin')+(r.diamonds?lobbyIcon('diamond'):'')+(r.hammer?lobbyIcon('hammer'):'')+(r.shuffle?lobbyIcon('shuffle'):'')+'</div><b>'+dailyCopy(r)+'</b><span>'+(i<claimed?'✓ 已收入心愿册':can&&i===next?'今日可领取':'待开启')+'</span></div>').join('')+'</div></div></div><footer class="daily-footer"><button class="primary" data-action="dailyClaim" '+(!can?'disabled':'')+'>'+(can?'收下第 '+(next+1)+' 天的心愿':'今日已收下 · 明天再见')+'</button><p>每日领取一次 · 第7次额外5钻石</p><button hidden data-action="economyClose">合上心愿册</button></footer></section>');
}
function roomDecor(){return '<div class="room-decor">'+(data.economy.activeDecor.includes('wishStar')?'<button class="wish-chime" data-action="roomChime" aria-label="轻碰星愿窗铃">'+lobbyIcon('stars')+'</button>':'')+(data.economy.activeDecor.includes('moon')?'<div class="moon-window">'+lobbyIcon('moon')+'<i></i><i></i><i></i></div>':'')+(data.economy.activeDecor.includes('stars')?'<div class="star-curtain">'+Array.from({length:7},(_,i)=>'<span style="--drop:'+(20+i%3*13)+'px">'+lobbyIcon('stars')+'</span>').join('')+'</div>':'')+'</div>';}
function handleEconomyAction(b){
 const a=b.dataset.action,g=shopGoods.find(x=>x.id===b.dataset.good);
 switch(a){
 case 'stageGroup':showStageGroup(Number(b.dataset.group));return true;
 case 'prepShop':shopBackToPrep=true;showShop('coins');return true;
 case 'shop':showShop(b.dataset.tab||shopTab);return true;
 case 'partnerOffer':showPartnerOffer(Number(b.dataset.partner));return true;
 case 'cashOffer':showCashOffer(b.dataset.product);return true;
 case 'buyAsk':if(!g)return true;if(goodOwned(g)){toast('已经拥有这件珍藏');return true;}
 showDialog('<div class="shop-confirm">'+productArt(g)+'<h2 id="dialogTitle">'+g.name+'</h2><p>'+g.copy+'</p><strong>'+g.price+' '+(g.tab==='coins'?'金币':'钻石')+'</strong><p>现有 '+data.economy[g.tab]+' · '+(data.economy[g.tab]>=g.price?'兑换后 '+(data.economy[g.tab]-g.price):'余额不足')+'</p></div>'+(data.economy[g.tab]>=g.price?'<button class="primary" data-action="buyConfirm" data-good="'+g.id+'">确认兑换</button>':g.tab==='diamonds'?'<p>完成三关收藏首次得5钻石，累计签到第7次额外得5钻石；也可自愿观看视频领取额外补给。</p><button class="primary" data-action="shop" data-tab="rewards">查看获取方式</button>':'<p>可通过通关、签到获取金币。</p><button class="primary" data-action="daily">查看签到</button>')+'<button class="secondary" data-action="shop" data-tab="'+g.tab+'">返回商店</button>');return true;
 case 'buyConfirm':if(!g||goodOwned(g))return true;if(data.economy[g.tab]<g.price){toast('余额不足');showShop(g.tab);return true;}
 data.economy[g.tab]-=g.price;
 if(g.type==='tool')data.economy.inventory[g.id]++;
 else if(g.type==='partner'){data.economy.ownedPartners.push(g.partner);recordRoomNoteSignal('partner',g.partner);StarCandyPlaytest.record('partner_unlock',{partner:g.partner,coins:g.price});}
 else if(g.type==='exchange')data.economy.coins+=g.coins;
 else if(g.type==='decor'){data.economy.decor.push(g.id);data.economy.activeDecor.push(g.id);}
 persist();showShop(g.tab);toast(g.type==='tool'?'道具已放入背包':g.type==='partner'?'伙伴已解锁，可以邀请同行':g.type==='exchange'?'金币已到账':'装饰已布置到小屋');return true;
 case 'toggleDecor':if(g&&data.economy.decor.includes(g.id)){const items=data.economy.activeDecor;data.economy.activeDecor=items.includes(g.id)?items.filter(id=>id!==g.id):[...items,g.id];persist();showShop('diamonds');}return true;
 case 'daily':showDaily();return true;
 case 'dailyClaim':if(!canCheckin()){showDaily();return true;}{const e=data.economy,r=dailyRewards[e.checkin.count%7];e.coins+=r.coins||0;e.diamonds+=r.diamonds||0;e.inventory.hammer+=r.hammer||0;e.inventory.shuffle+=r.shuffle||0;e.checkin.last=localDay();e.checkin.count++;persist();showDaily();toast('已领取：'+dailyCopy(r));}return true;
 case 'shopClose':case 'economyClose':if(shopBackToPrep&&preparation){shopBackToPrep=false;showPreparation();}else{shopBackToPrep=false;closeDialog();showScreen(route);}return true;
 }
 return false;
}

// Chapter scenery and persistent home collection. Ownership always derives from stars.
const worldPlaces=['星灯工坊','花溪温室','云桥观景台','月光邮局','萤火营地','蘑菇集市','古树图书馆','林间钟楼','潮汐码头','珊瑚花园','星轨天文台','约定灯塔',...returnJourneyPlaces];
const homeSlots={nightlight:'夜灯窗台',musicbox:'八音盒茶桌',photo:'回忆相框',letter:'来信与软装',candle:'阅读烛台',planter:'植物角',books:'故事书架',lantern:'门廊灯笼',rug:'猫咪星毯',coral:'星晶陈列',telescope:'观星角',mobile:'星海挂饰'};
const collectibles=[
 {id:'nightlight',name:'星光夜灯',slots:['window','table'],category:'灯饰',story:'夜灯亮了。月见说，无论走多远，窗边都会有一束星光等你。'},
 {id:'musicbox',name:'花语八音盒',slots:['table','window'],category:'纪念',story:'温室主人把溪水的节奏藏进八音盒。打开它，让花语在小屋里轻轻响起。'},
 {id:'photo',name:'伙伴合照',slots:['wall'],category:'纪念',story:'云桥上的风吹乱了头发，大家却都笑了。这是我们一起完成的第一场小冒险。'},
 {id:'letter',name:'月光来信',slots:[],category:'纪念',story:'月光邮局寄来了森林的邀请。翻过这页，下一段旅途已经在等你。'},
 {id:'candle',name:'云朵烛台',slots:['window','table'],category:'灯饰',story:'萤火营地的朋友留下了这盏烛台。像小小的篝火，陪你读完睡前的故事。'},
 {id:'planter',name:'蘑菇花盆',slots:['window','table'],category:'花艺',story:'蘑菇集市的绿意来到窗边。青芽说，记得每天看看新长出来的叶子。'},
 {id:'books',name:'古树故事集',slots:['table'],category:'纪念',story:'古树图书馆的一摞故事。澪在书页间留了一枚书签，约好下次一起读。'},
 {id:'lantern',name:'月影灯笼',slots:['hanging'],category:'灯饰',story:'林间钟声散去，灯笼把温柔的月光带回了家。'},
 {id:'rug',name:'潮汐星毯',slots:['rug'],category:'纪念',story:'把潮汐的颜色铺在脚边。小焰已经挑好了坐下来听故事的位置。'},
 {id:'coral',name:'珊瑚星晶',slots:['window','table'],category:'花艺',story:'海浪打磨出一簇温柔的星晶，留住了珊瑚花园的颜色。'},
 {id:'telescope',name:'迷你星望镜',slots:['table','window'],category:'纪念',story:'不用离开小屋，也能想起天文台的那片星空。'},
 {id:'mobile',name:'星海挂饰',slots:['hanging'],category:'纪念',story:'十二站的心愿终于串成了一片星海。轻轻摇晃，就像伙伴在向你招手。'}
];
const homeLetters=[
 {id:'welcome',level:0,title:'月见的第一封信',body:'欢迎回来。我们的小屋还有许多空位置，一起到星灯工坊找一盏灯吧。每一次小小的通关，都会带回来一点新的生活。'},
 {id:'forest',level:4,title:'月光邮局 · 森林邀请',body:'云端的四站已经留下了我们的足迹。森林里的朋友听说了这段旅途，寄来了萤火营地的邀请。带上喜欢的伙伴，继续出发吧。'},
 {id:'sea',level:8,title:'林间钟声 · 星海邀请',body:'钟楼的最后一声钟响，把信送到了海边。潮汐码头的白帆已备好，星海里还有四份心愿等着你。'},
 {id:'final',level:12,title:'十二站之后 · 给我们的家',body:'灯亮着，花开着，旅途的纪念都在这里。谢谢你把每一个心愿带回家。暮光工坊又亮起了灯，第37关开始，我们一起重访云端、森林和星海，把十二页新的旅途后记带回来。'}
];
const ownedItem=i=>!!data.stars[i*3+2];
// Dedicated slots preserve every collected object. Migrate v1 by item identity.
collectibles.forEach(c=>{c.slots=[c.id];});
function normalizeHome(raw){
 const h={version:2,placements:{},seen:[],read:[],lamp:false,styles:{},memories:[],moments:[],events:[],dailyNotes:[],postcardsRead:[],theme:-1,noteSignals:[]};
 if(raw&&[1,2].includes(raw.version)){
  for(const id of Object.values(raw.placements||{})){const i=collectibles.findIndex(c=>c.id===id);if(i>=0&&ownedItem(i))h.placements[id]=id;}
  h.seen=Array.isArray(raw.seen)?[...new Set(raw.seen.filter(id=>collectibles.some((c,i)=>c.id===id&&ownedItem(i))))]:[];
  h.read=Array.isArray(raw.read)?[...new Set(raw.read.filter(id=>homeLetters.some(l=>l.id===id&&(!l.level||data.stars[l.level*3-1]))))]:[];
  h.lamp=raw.lamp!==false;
  if(Array.isArray(raw.dailyNotes))h.dailyNotes=[...new Map(raw.dailyNotes.filter(n=>n&&/^\d{4}-\d{2}-\d{2}$/.test(n.day)&&typeof n.title==='string'&&n.title.length<=40&&typeof n.text==='string'&&n.text.length<=200).map(n=>[n.day,{day:n.day,title:n.title,text:n.text,read:n.read===true}])).values()].sort((a,b)=>a.day.localeCompare(b.day)).slice(-14);
  h.postcardsRead=Array.isArray(raw.postcardsRead)?[...new Set(raw.postcardsRead.filter(id=>journeyPostcards.some((c,i)=>c.id===id&&postcardOwned(i))))]:[];
  h.theme=Number.isInteger(raw.theme)&&raw.theme>=-1&&raw.theme<=3?raw.theme:-1;
  h.noteSignals=Array.isArray(raw.noteSignals)?raw.noteSignals.filter(s=>s&&['clear','place','partner'].includes(s.type)&&Number.isInteger(s.id)&&s.id>=0&&s.id<72&&Number.isFinite(s.at)&&s.at>0).slice(-12):[];
  for(const c of collectibles)h.styles[c.id]=raw.styles?.[c.id]===1?1:0;
  h.memories=Array.isArray(raw.memories)?[...new Set(raw.memories.filter(id=>collectibles.some((c,i)=>c.id===id&&ownedItem(i))))]:Object.values(h.placements);
  if(Array.isArray(raw.moments))for(const m of raw.moments.slice(0,12)){if(!m||!h.memories.includes(m.id)||h.moments.some(x=>x.id===m.id))continue;const ids=Array.isArray(m.items)?[...new Set(m.items.filter(id=>collectibles.some((c,i)=>c.id===id&&ownedItem(i))))]:[];h.moments.push({id:m.id,items:ids,styles:Object.fromEntries(ids.map(id=>[id,m.styles?.[id]===1?1:0])),lamp:m.lamp!==false,layoutVersion:m.layoutVersion===2?2:1});}
  if(Array.isArray(raw.events))for(const m of raw.events.slice(0,4)){
   const i=collectibles.findIndex(c=>c.id===m?.id);if(i<0||i>3||!ownedItem(i)||h.events.some(e=>e.id===m.id))continue;
   const items=Array.isArray(m.items)?[...new Set(m.items.filter(id=>collectibles.some((c,n)=>c.id===id&&ownedItem(n))))]:[];
   h.events.push({id:m.id,items,styles:Object.fromEntries(items.map(id=>[id,m.styles?.[id]===1?1:0])),lamp:m.lamp===true,layoutVersion:2});
  }

 }
 return h;
}

data.home=normalizeHome(data.home);persist();
let roomDraft=null,waterFrame=0,musicBoxNodes=[],musicBoxContext=null,musicBoxTimer=0,musicBoxPlaying=false;
function collectionArt(i,extra=''){return '<span class="reward-art collection-art collection-'+i+' '+extra+'" role="img" aria-label="'+collectibles[i].name+'"></span>';}
function availableLetters(){return homeLetters.filter(l=>!l.level||data.stars[l.level*3-1]);}
function currentWish(){
 if(journeyComplete())return returnJourneyWish();
 if(!firstLightComplete())return ownedItem(0)
  ?{title:roomPlaced(0)?'亲手点亮第一盏灯':'把第一盏灯带回家',action:'firstLightRoom',index:0,button:roomPlaced(0)?'点亮我们的夜灯':'选择夜灯的位置',detail:roomPlaced(0)?'夜灯已摆好，等你轻轻点亮':'窗台或茶桌，你来选一个喜欢的位置'}
  :{title:'为小屋找到第一盏灯',action:'journey',button:'开始第 '+data.unlocked+' 关',detail:'已完成 '+stageCount(0)+'/3 关 · 星光夜灯在等你'};
 const chapterWish=roomTaskWish();if(chapterWish)return chapterWish;
 const fresh=collectibles.findIndex((c,i)=>ownedItem(i)&&c.slots.length&&!data.home.seen.includes(c.id));
 if(fresh>=0)return {title:'把'+collectibles[fresh].name+'摆进小屋',action:'wcPlaceItem',index:fresh,button:'去布置'+collectibles[fresh].name,detail:'新收藏已收入收藏柜'};
 if(data.stars[11]&&!ownedItem(4))return {title:'下一份心愿 · 云朵烛台',action:'forestWish',button:'读森林来信',detail:'萤火营地 · 再过 '+(3-stageCount(4))+' 关，点亮阅读角',index:4,upcoming:true};
 const unread=availableLetters().find(l=>!data.home.read.includes(l.id));
 if(unread)return {title:'读一封伙伴来信',action:'wcMailbox',button:'打开信箱',detail:unread.title};
 if(data.stars[35])return returnJourneyWish();
 const next=data.stars.findIndex(s=>!s);
 if(next>=36)return returnJourneyWish();
 if(next<0)return {title:'十二站心愿，已经带回家',action:'records',button:'回家看看收藏',detail:'可以重新布置小屋，或挑战每关三星'};
 return {title:'下一份心愿 · '+collectibles[Math.floor(next/3)].name,action:'journey',button:'前往第 '+(next+1)+' 关',detail:worldPlaces[Math.floor(next/3)]+' · '+(next%3+1)+'/3 关'};
}
function renderWorldFlow(next,screen){
 if(next==='home'){screen.innerHTML=renderEconomyLobby();return true;}
 if(next==='map')return renderStageMap(screen);
 if(next==='records'){screen.innerHTML=renderGrowingRoom();requestAnimationFrame(fitGrowingRoom);return true;}
 if(next==='result'&&lastResult&&state.mode==='story'){screen.innerHTML=renderStageResult();decorateJourneyEnding(screen);return true;}

 return false;
}
function furnishingDrawer(){
 const d=roomDraft,allowed=collectibles.map((c,i)=>({c,i})).filter(({c})=>c.slots.includes(d.slot)&&(d.filter==='全部'||c.category===d.filter));
 return '<div class="furnishing-drawer"><h2>为'+homeSlots[d.slot]+'选择收藏</h2><div class="furnishing-tabs">'+['全部','灯饰','花艺','纪念'].map(t=>'<button data-action="wcFilter" data-filter="'+t+'" aria-pressed="'+(d.filter===t)+'">'+t+'</button>').join('')+'</div><div class="furnishing-items">'+allowed.map(({c,i})=>'<button data-action="wcPreview" data-item="'+i+'" '+(!ownedItem(i)?'disabled':'')+' aria-pressed="'+(d.item===c.id)+'">'+collectionArt(i)+'<b>'+c.name+'</b><small>'+(ownedItem(i)?d.item===c.id?'✓ 预览中':'已拥有':'完成第 '+((i+1)*3)+' 关解锁')+'</small></button>').join('')+(allowed.length?'':'<p class="empty-category">这个位置还没有此类收藏</p>')+'</div><p>预览中 · 确认后保存布置</p><div class="furnishing-controls"><button data-action="wcCancel">取消</button><button class="primary" data-action="wcConfirm">确认摆放</button><button data-action="wcRemove">收回物品</button></div></div>';
}
function showCollectible(i){
 const c=collectibles[i];if(!c)return;
 showDialog('<h2 id="dialogTitle">'+c.name+'</h2>'+collectionArt(i,'collection-large')+'<p>'+c.story+'</p><p>'+(ownedItem(i)?'已拥有 · 来自'+worldPlaces[i]:'完成第 '+(i*3+1)+'—'+((i+1)*3)+' 关后获得')+'</p>'+(ownedItem(i)?'<button class="primary" data-action="'+(c.slots.length?'wcPlaceItem':'wcMailbox')+'" data-item="'+i+'">'+(c.slots.length?'选择位置布置':'阅读来信')+'</button>':'')+'<button class="secondary" data-action="wcCabinet">返回收藏柜</button><button class="text-button" data-action="close">关闭</button>');
}
function handleWorldAction(b){
 if(handleRoomGrowthAction(b))return true;
 const action=b.dataset.action,i=Number(b.dataset.item),slot=b.dataset.slot;
 switch(action){
  case 'wcWish':{const w=currentWish();showDialog('<h2 id="dialogTitle">当前心愿</h2><p>'+w.title+'</p><p>'+w.detail+'</p><button class="primary" data-action="'+w.action+'" '+(w.index!==undefined?'data-item="'+w.index+'"':'')+'>'+w.button+'</button><button class="text-button" data-action="close">稍后再说</button>');return true;}
  case 'wcTalk':showDialog('<div class="visit-portrait">'+portrait(0)+'</div><h2 id="dialogTitle">月见</h2><p>'+ (data.home.lamp&&Object.values(data.home.placements).includes('nightlight')?'你摆的夜灯真好看。回到这里，就像被星光轻轻抱了一下。':ownedItem(0)?'第一盏夜灯已经在收藏柜里了。把它放在窗台，晚上回来就能看见。':'一起去星灯工坊吧，我们的小屋还在等第一束光。')+'</p><button class="primary" data-action="records">一起回小屋</button><button class="text-button" data-action="close">继续逛逛</button>');return true;
  case 'wcMailbox':showDialog('<div class="mail-heading">'+lobbyIcon('mail')+'<small>MOONLIGHT POST</small><h2 id="dialogTitle">月光信箱</h2><p>把旅途中的温柔，写成一封信</p></div>'+availableLetters().map(l=>'<button class="mail-row" data-action="wcRead" data-letter="'+l.id+'"><span class="letter-envelope" aria-hidden="true">✦</span><b>'+l.title+'</b><small>'+(data.home.read.includes(l.id)?'已读':'未读')+'</small></button>').join('')+'<p>新的章节完成后，会收到新的来信。</p><button class="secondary" data-action="wcRefresh">关上信箱</button>');return true;
  case 'wcRead':{const l=availableLetters().find(x=>x.id===b.dataset.letter);if(!l)return true;if(!data.home.read.includes(l.id))data.home.read.push(l.id);if(l.id==='forest'&&!data.home.seen.includes('letter'))data.home.seen.push('letter');persist();showDialog('<div class="mail-letter-top">'+lobbyIcon('mail')+'</div><div class="letter-paper"><small>月光邮局</small><h2 id="dialogTitle">'+l.title+'</h2><p>'+l.body+'</p><p class="letter-sign">—— 你的旅途伙伴</p></div><button class="primary" data-action="wcMailbox">放回信册</button><button class="text-button" data-action="wcRefresh">回到'+(route==='records'?'小屋':'大厅')+'</button>');return true;}
  case 'wcRefresh':showScreen(route==='records'?'records':'home');return true;
  case 'wcCabinet':showDialog('<h2 id="dialogTitle">我们的收藏柜</h2><p>每一站，都有一份可以带回家的心愿。</p><div class="cabinet-grid">'+collectibles.map((c,n)=>'<button class="'+(ownedItem(n)?'':'not-owned')+'" data-action="wcItem" data-item="'+n+'">'+collectionArt(n)+'<b>'+c.name+'</b><small>'+(ownedItem(n)?Object.values(data.home.placements).includes(c.id)?'已布置':'已收藏':'第 '+((n+1)*3)+' 关')+'</small></button>').join('')+'</div><button class="secondary" data-action="close">合上收藏柜</button>');return true;
  case 'wcItem':showCollectible(i);return true;
  case 'wcPlaceItem':{const c=collectibles[i];if(!c||!ownedItem(i)||!c.slots.length)return true;showScreen('records');roomDraft={slot:c.slots[0],item:c.id,filter:'全部'};showScreen('records');return true;}
  case 'wcSlot':if(!homeSlots[slot])return true;roomDraft={slot,item:data.home.placements[slot]||null,filter:'全部'};showScreen('records');return true;
  case 'wcFilter':if(roomDraft&&['全部','灯饰','花艺','纪念'].includes(b.dataset.filter)){roomDraft.filter=b.dataset.filter;showScreen('records');}return true;
  case 'wcPreview':if(roomDraft&&ownedItem(i)&&collectibles[i]?.slots.includes(roomDraft.slot)){roomDraft.item=collectibles[i].id;showScreen('records');}return true;
  case 'wcRemove':if(roomDraft){roomDraft.item=null;showScreen('records');}return true;
  case 'wcCancel':roomDraft=null;showScreen('records');return true;
  case 'wcConfirm':if(roomDraft){const d=roomDraft,c=collectibles.find(x=>x.id===d.item);if(d.item&&(!c||!c.slots.includes(d.slot)||!ownedItem(collectibles.indexOf(c))))return true;for(const s in data.home.placements)if(data.home.placements[s]===d.item)delete data.home.placements[s];if(d.item){data.home.placements[d.slot]=d.item;if(!data.home.seen.includes(d.item))data.home.seen.push(d.item);}else delete data.home.placements[d.slot];persist();roomDraft=null;showScreen('records');toast('布置已保存，欢迎回家。');}return true;
  case 'wcObject':{const id=data.home.placements[slot],n=collectibles.findIndex(c=>c.id===id);if(n<0)return true;if(id==='nightlight'){data.home.lamp=!data.home.lamp;persist();showScreen('records');toast(data.home.lamp?'夜灯亮了，星光在这里等你。':'夜灯已关闭。');}else if(id==='musicbox'){if(musicBoxPlaying)stopMusicBox();else playMusicBox();showScreen('records');}else showCollectible(n);return true;}
  case 'wcVisit':{const count=collectibles.filter((_,n)=>ownedItem(n)).length;if(count<3){showDialog('<h2 id="dialogTitle">伙伴来访</h2><p>完成前三站的九关，收集三份心愿后，伙伴们会来小屋一起看合照。</p><button class="primary" data-action="journey">继续收集</button><button class="text-button" data-action="close">稍后再说</button>');return true;}showDialog('<h2 id="dialogTitle">小屋里的第一次聚会</h2><div class="visit-row">'+partners.slice(0,4).map((p,n)=>'<div>'+portrait(n)+'<small>'+p.name+'</small></div>').join('')+'</div><p><b>月见：</b>原来一起完成的心愿，真的会变成家的样子。</p><p><b>澪：</b>照片里的我们都笑得好开心。</p><p><b>小焰：</b>下次再带回来一件特别的纪念吧！</p><p><b>青芽：</b>这里有一点点变热闹了呢。</p><button class="primary" data-action="close">把这段时光留在心里</button>');return true;}
 }
 return false;
}
function worldBeforeRoute(next){
 if(next!==route){resetRoomGrowth();resetRoomStory();}
 cancelAnimationFrame(waterFrame);waterFrame=0;
 if(next!==route){roomDraft=null;shopBackToPrep=false;stopMusicBox();}
}
function stopMusicBox(){
 clearTimeout(musicBoxTimer);musicBoxPlaying=false;
 for(const {osc,gain} of musicBoxNodes)try{
  const t=musicBoxContext.currentTime,param=gain.gain;
  if(param.cancelAndHoldAtTime)param.cancelAndHoldAtTime(t);
  else{const value=param.value;param.cancelScheduledValues(t);param.setValueAtTime(value,t);}
  param.linearRampToValueAtTime(0,t+.3);osc.stop(t+.32);
 }catch(_){}musicBoxNodes=[];
 document.querySelectorAll('.box-playing').forEach(el=>el.classList.remove('box-playing'));
 document.querySelectorAll('.box-flower').forEach(el=>el.remove());
 StarCandyMusic.duck(1);
}
function playMusicBox(){
 stopMusicBox();
 if(!data.music&&!data.sound){toast('音乐与音效均已关闭，可在设置中开启。');return;}
 try{
  musicBoxContext||=new(window.AudioContext||window.webkitAudioContext)();musicBoxContext.resume().catch(()=>{stopMusicBox();toast('声音暂时未能播放，请再轻触八音盒。');});const ctx=musicBoxContext,t=ctx.currentTime;
  StarCandyMusic.duck(.22);musicBoxPlaying=true;
  [659.25,783.99,987.77,880,783.99,659.25,587.33,523.25,659.25,783.99,1174.66,987.77,783.99,659.25,587.33,523.25].forEach((hz,n)=>{for(const [multiple,volume] of [[1,.065],[2,.012]]){const osc=ctx.createOscillator(),gain=ctx.createGain(),at=t+n*.36;osc.type='sine';osc.frequency.value=hz*multiple;osc.connect(gain);gain.connect(ctx.destination);gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.015);gain.gain.exponentialRampToValueAtTime(.0001,at+.9);osc.onended=()=>{osc.disconnect();gain.disconnect();};osc.start(at);osc.stop(at+1);musicBoxNodes.push({osc,gain});}});
  musicBoxTimer=setTimeout(()=>{stopMusicBox();const copy=document.querySelector('.world-room-message');if(copy)copy.textContent='旋律轻轻落下，故事还留在小屋里。';},6700);
 }catch(_){stopMusicBox();toast('声音暂时未能播放，请再轻触八音盒。');}
}
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(waterFrame);waterFrame=0;stopMusicBox();}else if(route==='map')startWorldWater((chapterView??0)%3);});

// Live room layers: ownership is earned in stages; placement and previews are separate.
const roomPositions=[
 [[17,42,17],[9,73,13]], [[13,71,16],[36,43,13]], [[82,25,20],[43,72,11]],
 [[39,77,8],[42,79.5,7]], [[8,53,15],[7,53,13]], [[29,45,12],[28,45,11]],
 [[10,77,15],[10,77,13]], [[82,8,18],[82,8,16]], [[29,93,55],[29,93,50]],
 [[32,72,12],[32,72,11]], [[31,39,12],[31,39,11]], [[41,7,25],[41,7,23]]
];
const roomBundles={3:'首套软装：星纹抱枕、花瓶、茶具与紫藤',7:'森林软装：植物窗帘与门廊花饰',11:'星海软装：顶部星链与全章纪念'};
const roomLines=[
 '有了这盏灯，晚归也不会觉得冷清了。',
 '听，花语在桌上转了一圈。猫咪也竖起耳朵了。',
 '这是我们的第一张合照。那些一起走过的路，终于有了模样。',
 '靠着新抱枕喝一杯茶吧。这里越来越像我们的家了。',
 '烛光刚好够读完一页故事，我把下一页留给你。',
 '今天又多了一片新叶子。明天再来看它吧。',
 '书签夹在我最喜欢的那一页，下次我们接着读。',
 '连窗帘都染上了森林的温柔，门廊也亮起来了。',
 '猫咪已经挑好了新的窝。你看，它都不肯起来了。',
 '把海边的一点星光带回来，放在这里刚刚好。',
 '今晚不必走远，我们就在窗边看星星。',
 '从第一盏灯，到满屋星光，谢谢你把每一份心愿带回来。'
];
let roomPreview=null,roomEditing=null,roomCelebration=null,roomCelebrationTimer=0,roomReactionTimer=0;
let roomArrival=null;
function roomArrivalActive(i){return roomArrival?.i===i&&Date.now()<roomArrival.until;}
function roomSurfaceLighting(has=roomLayerOn,lampOn=data.home.lamp,style=roomStyle(0)){
 const p=roomPositions[0][style],lamp=has(0)&&lampOn;
 return '<div class="rg-surface-light '+(lamp?'lamp-on ':'')+(has(4)?'candle-on ':'')+(has(7)?'lantern-on ':'')+(has(9)?'crystal-on ':'')+(has(11)?'stars-on ':'')+'" style="--lx:'+p[0]+'%;--ly:'+p[1]+'%" aria-hidden="true"><i class="rg-lamp-wall"></i><i class="rg-lamp-core"></i><i class="rg-ledge-reflection"></i><i class="rg-sofa-bounce"></i><i class="rg-table-bounce"></i><i class="rg-candle-wall"></i><i class="rg-lantern-wall"></i><i class="rg-floor-bounce"></i><i class="rg-crystal-reflection"></i><i class="rg-star-ceiling"></i></div>';
}
function roomContactShadows(has=roomLayerOn,styleOf=roomStyle){return [0,1,3,4,5,6,9,10].filter(has).map(i=>{const p=roomPositions[i][styleOf(i)];return '<i class="rg-contact-shadow" style="left:'+p[0]+'%;top:'+(p[1]+p[2]*.28)+'%;width:'+p[2]*.88+'%" aria-hidden="true"></i>';}).join('');}
function resetRoomGrowth(){roomPreview=null;roomEditing=null;roomCelebration=null;clearTimeout(roomCelebrationTimer);clearTimeout(roomReactionTimer);}
function roomPlaced(i){return data.home.placements[collectibles[i].id]===collectibles[i].id;}
function fitGrowingRoom(){const root=document.querySelector('.growing-room'),canvas=root?.querySelector('.rg-canvas');if(!canvas)return;const reserve=root.querySelector('.rg-dock')?.offsetHeight||115,available=Math.max(80,root.clientHeight-reserve),w=Math.min(root.clientWidth,available*2/3),h=w*1.5;Object.assign(canvas.style,{width:w+'px',height:h+'px',left:'50%',right:'auto',bottom:'auto',top:Math.max(0,(available-h)/2)+'px',transform:'translateX(-50%)'});}
window.addEventListener('resize',()=>requestAnimationFrame(fitGrowingRoom));
window.visualViewport?.addEventListener('resize',()=>requestAnimationFrame(fitGrowingRoom));
function roomFirstPending(){return collectibles.findIndex((c,i)=>ownedItem(i)&&!data.home.seen.includes(c.id));}
function roomNextGroup(){const i=collectibles.findIndex((c,n)=>!ownedItem(n));return i<0?11:i;}
function roomMemory(i){const id=collectibles[i].id;if(!data.home.memories.includes(id))data.home.memories.push(id);if(!data.home.moments.some(m=>m.id===id))data.home.moments.push({id,items:Object.values(data.home.placements),styles:{...data.home.styles},lamp:data.home.lamp,layoutVersion:2});}
function celebrateRoomItem(i){
 roomCelebration=i;clearTimeout(roomCelebrationTimer);showScreen('records');roomSay(i===4?'云朵烛台亮起了阅读角。月见：下一次，我们带一点植物的绿意回来吧。':roomLines[i],i===0);
 roomCelebrationTimer=setTimeout(()=>{roomCelebration=null;if(route==='records')showScreen('records');},3800);
}
function lightFirstLamp(){
 if(!ownedItem(0)||!roomPlaced(0)||roomPreview)return;
 StarCandyPlaytest.record('room_light',{item:0});data.home.lamp=true;const first=!firstLightComplete();roomMemory(0);persist();
 if(first){startRoomStory(0);if(data.sound)tone(2);}else{showScreen('records');roomSay(roomLines[0]);}
}
function roomPreviewFor(i){if(!collectibles[i])return;showScreen('records');roomPreview={i,style:data.home.styles[collectibles[i].id]||0};roomEditing=null;showScreen('records');}
function roomStyle(i){return roomPreview?.i===i?roomPreview.style:data.home.styles[collectibles[i].id]||0;}
function roomLayerOn(i){return roomPreview?.i===i||roomPlaced(i);}
const roomThemeNames=['原来的小屋','森林夜色','潮汐星光','归航星夜'];
function roomThemeAvailable(){return data.stars[71]?3:data.stars[59]?2:data.stars[47]?1:0;}
function roomThemeLevel(){const unlocked=roomThemeAvailable();return data.home.theme>=0?Math.min(unlocked,data.home.theme):unlocked;}
function roomJourneyLayer(){const theme=roomThemeLevel();return theme?'<div class="rg-journey-layer rg-journey-'+theme+'" aria-hidden="true"><i class="rg-journey-window"></i><i class="rg-journey-floor"></i><i class="rg-journey-garland"></i><i class="rg-journey-emblem"></i></div>':'';}
function roomStage(){const base=roomLayerOn(11)?'满屋星光':roomLayerOn(7)?'绿意相伴':roomLayerOn(3)?'温暖的家':roomLayerOn(0)&&data.home.lamp?'第一束光':roomPlaced(0)?'等待你点亮':'初入住';return roomThemeLevel()?roomThemeNames[roomThemeLevel()]+' · '+base:base;}
function roomSoft(tile,cls){return '<span class="rg-soft rg-soft-'+tile+' '+cls+'" aria-hidden="true"></span>';}
function roomLayers(has=roomLayerOn,style=roomStyle(3),legacy=false){
 let out='';
 if(has(3)){const cls=(legacy?'':' rg-roomset-'+style)+(roomArrivalActive(3)?' rg-soft-arriving':'');out+=roomSoft(0,'rg-cushions'+cls)+roomSoft(1,'rg-vase'+cls)+roomSoft(2,'rg-tea'+cls)+roomSoft(3,'rg-flowers'+cls);}
 if(has(7))out+=roomSoft(4,'rg-curtains')+roomSoft(3,'rg-porch');
 if(has(11))out+=roomSoft(5,'rg-stars');
 return out;
}
function roomObject(i,styleOverride,legacy=false){
 const c=collectibles[i],pos=(legacy&&i<4?roomLegacyPositions:roomPositions)[i][styleOverride??roomStyle(i)],preview=styleOverride===undefined&&roomPreview?.i===i;
 const awaiting=styleOverride===undefined&&i===0&&!preview&&!firstLightComplete();
 return '<button class="rg-object rg-object-'+i+(preview?' rg-preview':'')+(awaiting?' rg-await-light':'')+((styleOverride??roomStyle(i))?' rg-style-1':'')+(legacy?' rg-legacy-layout':'')+(styleOverride===undefined&&roomArrivalActive(i)?' rg-arriving':'')+'" style="--x:'+pos[0]+'%;--y:'+pos[1]+'%;--w:'+pos[2]+'%" data-action="rgObject" data-item="'+i+'" aria-label="'+c.name+(preview?'，效果预览':awaiting?'，轻触点亮':'，点击互动')+'">'+collectionArt(i)+(awaiting?'<span class="rg-light-hint">轻触点亮</span>':'')+(i===1&&musicBoxPlaying?'<span class="rg-music-petals">✿</span>':'')+'</button>';
}
function roomProgress(i){return '<div class="rg-progress" aria-label="心愿进度 '+stageCount(i)+'/3">'+[0,1,2].map(n=>'<span class="'+(data.stars[i*3+n]?'done':'')+'">'+(data.stars[i*3+n]?'✓':n+1)+'</span>').join('')+'<small>'+stageCount(i)+'/3 关</small></div>';}
function roomDock(){
 if(roomPreview){const {i}=roomPreview,c=collectibles[i],own=ownedItem(i);return '<div class="rg-dock rg-preview-dock"><div class="rg-dock-heading"><b>'+c.name+'</b><span>'+(own?'摆放预览':'尚未获得 · 效果预览')+'</span></div><div class="rg-style-choice"><button data-action="rgStyle" data-style="0" aria-pressed="'+(roomPreview.style===0)+'">'+(roomStyleLabels[i]?.[0]||'经典布置')+'</button><button data-action="rgStyle" data-style="1" aria-pressed="'+(roomPreview.style===1)+'">'+(roomStyleLabels[i]?.[1]||'轻巧布置')+'</button></div><p>'+ (roomBundles[i]|| (own?'点击确认才会保存，其他收藏会留在原位。':'再过 '+(3-stageCount(i))+' 关，就能把它带回家。'))+'</p><div class="rg-dock-buttons"><button class="secondary" data-action="rgCancel">取消预览</button><button class="primary art-gold" data-action="'+(own?'rgPlace':'journey')+'" data-item="'+i+'">'+(own?'摆进小屋':'去收集')+'</button></div></div>';}
 if(ownedItem(0)&&roomPlaced(0)&&!firstLightComplete())return '<div class="rg-dock first-light-dock"><div class="rg-wish"><span class="rg-prize">'+collectionArt(0)+'</span><div><small>前三关完成 · 最后一步</small><b>夜灯已经摆好了</b><small>轻触房间里的灯，或点下面的按钮</small></div><button class="rg-preview-link" data-action="rgPreview" data-item="0">换位置</button></div><button class="primary art-gold" data-action="rgLight">亲手点亮第一盏灯</button></div>';
 const earlyDock=roomChapterDock();if(earlyDock)return earlyDock;
 const fresh=ownedItem(0)&&!firstLightComplete()?0:roomFirstPending(),i=fresh>=0?fresh:roomNextGroup(),all=collectibles.every((c,n)=>ownedItem(n));
 if(all&&fresh<0)return returnJourneyDock();
 return '<div class="rg-dock"><div class="rg-wish"><button class="rg-prize" data-action="rgPreview" data-item="'+i+'" aria-label="预览'+collectibles[i].name+'">'+collectionArt(i)+'</button><div><small>'+(fresh>=0?'新收藏已到家':all?'十二份心愿，已全部带回家':'下一份心愿')+'</small><b>'+collectibles[i].name+(roomBundles[i]?' ＋ 软装':'')+'</b>'+(i===4&&forestWishAvailable()?'<button class="forest-wish-link" data-action="forestWish">森林来信 · 点亮阅读角 ›</button>':'')+roomProgress(i)+'</div><button class="rg-preview-link" data-action="rgPreview" data-item="'+i+'">预览 ›</button></div><button class="primary art-gold" data-action="'+(fresh>=0?'rgPreview':all?'rgMemories':'journey')+'" data-item="'+i+'">'+(fresh>=0?'亲手摆进小屋':all?'翻开我们的回忆':'去收集 · 还差 '+(3-stageCount(i))+' 关')+'</button></div>';
}
function renderGrowingRoom(){
 const note=roomDailyNote();
 const lamp=roomLayerOn(0)&&(roomPreview?.i===0||data.home.lamp),candle=roomLayerOn(4),celebrating=roomCelebration!==null;
 const line=roomPreview?'看看它摆进家里的样子。':celebrating?roomLines[roomCelebration]:roomPlaced(0)&&!firstLightComplete()?'灯已经摆好啦，最后这束光，留给你亲手点亮。':note.text;
 return '<section class="art-page growing-room '+(lamp?'rg-lit ':'')+(candle?'rg-candle-lit ':'')+(musicBoxPlaying?'box-playing ':'')+(roomLayerOn(7)?'rg-forest ':'')+(roomLayerOn(11)?'rg-complete ':'')+'rg-theme-'+roomThemeLevel()+' '+(celebrating?'rg-celebrating ':'')+(roomStory?.i===0&&roomStory.beat===0?'rg-firstlight-reveal ':'')+'"><div class="rg-canvas"><div class="rg-background"></div>'+roomJourneyLayer()+'<div class="rg-warmth" style="--lamp-x:'+roomPositions[0][roomStyle(0)][0]+'%;--lamp-y:'+roomPositions[0][roomStyle(0)][1]+'%"></div><div class="rg-candle-glow"></div>'+roomSurfaceLighting(roomLayerOn,lamp)+roomContactShadows()+roomDecor()+roomLayers()+collectibles.map((c,i)=>roomLayerOn(i)?roomObject(i):'').join('')+'<button class="rg-person-hotspot" data-action="rgTalk" aria-label="和月见聊聊"></button><button class="rg-cat-hotspot" data-action="rgCat" aria-label="摸摸猫咪"><i class="rg-cat-motion-tail" aria-hidden="true"></i><i class="rg-cat-motion-ears" aria-hidden="true"></i><i class="rg-cat-motion-paws" aria-hidden="true"></i></button><div class="rg-cat-spark" aria-hidden="true">♪</div><p class="rg-speech" role="status"><b>月见 · 今日便签</b><span>'+releaseEsc(line)+'</span></p></div><header class="rg-header"><button data-action="home" aria-label="返回大厅">‹</button><div><h1 class="screen-title" tabindex="-1">星光小屋</h1><small>'+roomStage()+'</small></div><span>收藏 '+collectibles.filter((c,i)=>ownedItem(i)).length+'/12</span></header><nav class="rg-tools" aria-label="小屋功能"><button data-action="roomDailyNote" class="'+(note.read?'':'daily-note-new')+'">今日便签</button><button data-action="rgArrange">布置</button><button data-action="rgMemories">回忆</button>'+(roomThemeAvailable()?'<button data-action="rgTheme" aria-label="切换小屋氛围">'+roomThemeNames[roomThemeLevel()]+'</button>':'')+'</nav>'+roomDock()+roomStoryMarkup()+(celebrating?'<div class="rg-celebration"><span>✦</span><strong>'+(roomCelebration===0?'第一盏灯，为你亮起':collectibles[roomCelebration].name+' · 已安放')+'</strong><button data-action="rgSkip">跳过演出</button></div>':'')+'</section>';
}
function roomSay(text,cat=false){
 const speaker=document.querySelector('.rg-speech b');if(speaker)speaker.textContent='月见';
 const node=document.querySelector('.rg-speech span');if(node)node.textContent=text;
 const scene=document.querySelector('.growing-room');if(cat&&scene){scene.classList.remove('rg-cat-react');void scene.offsetWidth;scene.classList.add('rg-cat-react');clearTimeout(roomReactionTimer);roomReactionTimer=setTimeout(()=>scene.classList.remove('rg-cat-react'),2300);}
}
function showRoomArrange(){
 showDialog('<h2 id="dialogTitle">布置我们的小屋</h2><p>每件收藏都有自己的位置，摆上新物件不会挤掉旧物件。</p><button class="secondary" data-action="roomChapter">家的模样 · 前四份心愿</button><div class="rg-arrange-grid">'+collectibles.map((c,i)=>'<div><button data-action="rgPreview" data-item="'+i+'">'+collectionArt(i)+'<b>'+c.name+'</b><small>'+(ownedItem(i)?roomPlaced(i)?'已布置 · 点击调整':'已获得 · 点击摆放':'第 '+(i*3+3)+' 关获得 · 可预览')+'</small></button>'+(roomPlaced(i)?'<button class="rg-store" data-action="rgStore" data-item="'+i+'">收起</button>':'')+'</div>').join('')+'</div><button class="secondary" data-action="shop" data-tab="diamonds">查看装饰商店</button>');
}
function showRoomMemories(){
 const items=data.home.memories;
 showDialog('<h2 id="dialogTitle">我们的小屋回忆</h2><p>第一次点灯、第一次合照，都在这里。</p>'+prologueReplayButton()+(items.length?'<div class="rg-memory-list">'+items.map(id=>{const i=collectibles.findIndex(c=>c.id===id);return '<button data-action="rgMemory" data-item="'+i+'">'+collectionArt(i)+'<div><b>'+collectibles[i].name+'</b><small>'+roomLines[i]+'</small></div></button>';}).join('')+'</div>':'<p class="rg-empty-memory">完成前三关、亲手摆放并点亮夜灯，就能留下第一段回忆。</p><button class="primary" data-action="firstLightRoom">'+(ownedItem(0)?'去点亮第一盏灯':'一起去找第一盏灯')+'</button>')+(data.home.events.length?'<h3>一起生活的小故事</h3><div class="room-event-memories">'+data.home.events.map(m=>{const i=collectibles.findIndex(c=>c.id===m.id);return '<button data-action="roomEventMemory" data-item="'+i+'">'+roomEventTitles[i]+' ›</button>';}).join('')+'</div>':'')+postcardAlbum()+'<button class="secondary" data-action="artAlbum">查看关卡心愿册</button>');
}
function roomMemoryPicture(i,record=null){
 const m=record||data.home.moments.find(x=>x.id===collectibles[i].id);if(!m)return collectionArt(i,'collection-large');
 const has=n=>m.items.includes(collectibles[n].id),lamp=has(0)&&m.lamp,lampPos=(m.layoutVersion===2?roomPositions:roomLegacyPositions)[0][m.styles.nightlight||0];
 return '<div class="rg-memory-picture '+(lamp?'rg-lit':'')+'" role="img" aria-label="'+collectibles[i].name+'的小屋纪念画面"><div class="rg-background"></div><div class="rg-warmth" style="--lamp-x:'+lampPos[0]+'%;--lamp-y:'+lampPos[1]+'%"></div>'+roomSurfaceLighting(has,lamp,m.styles.nightlight||0)+roomContactShadows(has,n=>m.styles[collectibles[n].id]||0)+roomLayers(has,m.styles.letter||0,m.layoutVersion!==2)+collectibles.map((c,n)=>has(n)?roomObject(n,m.styles[c.id]||0,m.layoutVersion!==2).replace(/<button\b/g,'<span').replace(/<\/button>/g,'</span>').replace(/data-action="[^"]*"/g,''): '').join('')+'<span class="rg-memory-caption">'+(record?roomEventTitles[i]:collectibles[i].name+(i===0?' · 第一次点亮':' · 第一次安放'))+'</span></div>';
}
function handleRoomGrowthAction(b){
 if(handleJourneyPostcardAction(b))return true;
 if(handleRoomLifeAction(b))return true;
 if(handleRoomChapterAction(b))return true;
 const a=b.dataset.action,i=Number(b.dataset.item),valid=Number.isInteger(i)&&i>=0&&i<collectibles.length;
 if(a==='wcPlaceItem'){if(valid&&ownedItem(i))roomPreviewFor(i);return true;}
 if(a==='wcSlot'||a==='wcCabinet'){showRoomArrange();return true;}
 if(!a.startsWith('rg'))return false;
 switch(a){
 case 'rgPreview':if(valid)roomPreviewFor(i);break;
 case 'rgStyle':if(roomPreview){roomPreview.style=Number(b.dataset.style)===1?1:0;showScreen('records');}break;
 case 'rgCancel':roomPreview=null;showScreen('records');break;
 case 'rgArrange':showRoomArrange();break;
 case 'rgTheme':{const max=roomThemeAvailable();if(max){data.home.theme=(roomThemeLevel()+1)%(max+1);persist();showScreen('records');toast('已切换到'+roomThemeNames[roomThemeLevel()]);}break;}
 case 'rgStore':if(valid&&ownedItem(i)){delete data.home.placements[collectibles[i].id];if(i===1)stopMusicBox();persist();showScreen('records');toast('已收回收藏柜，其他布置保持原样。');}break;
 case 'rgPlace':{
  if(!valid||!ownedItem(i)||roomPreview?.i!==i)break;
  const id=collectibles[i].id,first=!data.home.memories.includes(id);
  data.home.placements[id]=id;data.home.styles[id]=roomPreview.style;roomArrival={i,until:Date.now()+1000};
  recordRoomNoteSignal('place',i);
  if(!data.home.seen.includes(id))data.home.seen.push(id);
  if(i===0&&first)data.home.lamp=false;
  if(i!==0||!first)roomMemory(i);StarCandyPlaytest.record('room_place',{item:i});persist();roomPreview=null;roomCelebration=null;
  if(first&&i>3)celebrateRoomItem(i);else{showScreen('records');roomSay(i===0&&first?'已经放好了。轻触这盏灯，让第一束星光亮起来。':roomLines[i]);}
  break;
 }
 case 'rgSkip':roomCelebration=null;clearTimeout(roomCelebrationTimer);showScreen('records');break;
 case 'rgLight':lightFirstLamp();break;
 case 'rgMemories':showRoomMemories();break;
 case 'rgMemory':if(valid&&data.home.memories.includes(collectibles[i].id)){showDialog('<h2 id="dialogTitle">'+collectibles[i].name+' · 初次相遇</h2>'+roomMemoryPicture(i)+'<p>'+roomLines[i]+'</p><p>'+collectibles[i].story+'</p>'+(roomBundles[i]?'<p>'+roomBundles[i]+'</p>':'')+'<button class="secondary" data-action="rgMemories">返回回忆册</button>');}break;
 case 'rgTalk':{
  showRoomDailyNote();break;
 }
 case 'rgCat':roomPetCat();break;
 case 'rgObject':{
  if(!valid)break;if(roomPreview?.i===i){roomSay('这是效果预览；确认摆放后，才会保存到小屋。');break;}if(!roomPlaced(i))break;
  if(i===0){if(!firstLightComplete()){lightFirstLamp();break;}data.home.lamp=!data.home.lamp;persist();showScreen('records');roomSay(data.home.lamp?roomLines[0]:'晚安，今晚让月光陪我们。');}
  else if(i===1){if(!roomEventComplete(1)){startRoomStory(1);break;}if(musicBoxPlaying)stopMusicBox();else playMusicBox();showScreen('records');roomSay(musicBoxPlaying?roomLines[1]:'八音盒轻轻合上了。',musicBoxPlaying);}
  else if(i===2){startRoomStory(2);}
  else if(i===3){startRoomStory(3);}
  else{roomSay(roomItemReply(i),i===8);const node=document.querySelector('.rg-object-'+i);node?.classList.add('rg-object-react');setTimeout(()=>node?.classList.remove('rg-object-react'),1400);}
  break;
 }
 }
 return true;
}

// Small home events; previews never complete an event or grant a collectible.
const roomStyleLabels=[['窗台守候','茶桌微光'],['茶桌花语','窗边旋律'],['挂在墙上','桌边合影'],['窗边茶叙','花香小憩']];
const roomEventTitles=['第一束光','花语的第一首歌','我们的第一张合照','家的模样'];
const roomLegacyPositions=[[[17,42,17],[9,77,16]],[[27,73,18],[27,73,16]],[[82,25,20],[82,25,18]],[[42,79,10],[42,79,9]]];
const roomEventBeats=[
 ['月见：这束光，是你亲手点亮的。','窗台不再清冷，猫咪也有了暖暖的夜晚。','第一束光已留在回忆里。下一次，我们带一段旋律回家。'],
 ['澪：把温室里的声音，轻轻转给你听。','花瓣随着旋律转动；不赶路的时候，就在这里坐一会儿。','月见：灯和旋律都有了，下一次拍一张我们的合照吧。'],
 ['月见：位置选好了，大家一起看这里。','澪、小焰和青芽也来入镜。咔嚓——这一刻留下来了。','月见：把一路的心愿摆在身边，房间就有了我们的故事。'],
 ['月见拆开来信：森林里的朋友，正在等我们。','抱枕、花香和两杯茶，把清冷的房间变成了可以安心歇脚的家。','月见：先喝完这杯茶，再一起去森林。家的第一套布置完成了。下一站去萤火营地，把云朵烛台带回来。']
];
let roomStory=null,roomStoryTimer=0;
function resetRoomStory(){clearTimeout(roomStoryTimer);roomStory=null;}
function roomEventComplete(i){return data.home.events.some(m=>m.id===collectibles[i].id);}
function roomEventSnapshot(i){return {id:collectibles[i].id,items:Object.values(data.home.placements),styles:{...data.home.styles},lamp:data.home.lamp,layoutVersion:2};}
function roomChapterTask(){
 for(let i=0;i<4;i++){
  if(!ownedItem(i))return {i,kind:'collect'};
  if(!roomPlaced(i))return {i,kind:'place'};
  if(i===0&&!firstLightComplete())return {i,kind:'light'};
  if(!roomEventComplete(i))return {i,kind:'event'};
 }
 return null;
}
function roomTaskWish(){
 const task=roomChapterTask();if(!task||task.kind==='collect')return null;
 const {i,kind}=task,c=collectibles[i];
 return {index:i,title:kind==='place'?'把'+c.name+'摆进小屋':roomEventTitles[i],detail:kind==='place'?'两种免费布置，选你喜欢的位置':['让夜灯亮起，留下这份回忆','轻触八音盒，听听花语的旋律','拍下属于我们的第一张合照','展开来信，看看家的新模样'][i],action:kind==='place'?'rgPreview':'roomEvent',button:kind==='place'?'选择布置':['重温第一束光','听第一首花语','一起拍张合照','展开来信'][i]};
}
function roomChapterDock(){
 const task=roomChapterTask();if(!task||task.kind==='collect'||task.kind==='light')return '';
 const w=roomTaskWish();return '<div class="rg-dock room-event-dock"><div class="rg-wish"><span class="rg-prize">'+collectionArt(w.index)+'</span><div><small>家的模样 · 第 '+(w.index+1)+'/4 份心愿</small><b>'+w.title+'</b><small>'+w.detail+'</small></div><button class="rg-preview-link" data-action="rgPreview" data-item="'+w.index+'">布置</button></div><button class="primary art-gold" data-action="'+w.action+'" data-item="'+w.index+'">'+w.button+'</button></div>';
}
function roomStoryMarkup(){
 if(!roomStory)return '';const {i,beat}=roomStory;
 return '<section class="room-story story-'+i+'" role="dialog" aria-label="'+roomEventTitles[i]+'"><button class="room-story-skip" data-action="roomStorySkip">跳过故事</button>'+(i===2&&beat===1?'<div class="room-photo-flash" aria-hidden="true"></div><div class="room-visit-faces">'+partners.slice(0,4).map((p,n)=>'<div>'+portrait(n)+'<span>'+p.name+'</span></div>').join('')+'</div>':'')+'<div class="room-story-copy" role="status"><small>'+roomEventTitles[i]+' · '+(beat+1)+'/3</small><p>'+roomEventBeats[i][beat]+'</p><div class="room-story-dots">'+[0,1,2].map(n=>'<i class="'+(n<=beat?'done':'')+'"></i>').join('')+'</div><button class="room-story-next" data-action="roomStoryNext">'+(beat<2?'下一句 ›':'珍藏这段回忆')+'</button></div></section>';
}
function finishRoomStory(){
 if(!roomStory)return;const {i,snapshot,replay}=roomStory;resetRoomStory();
 if(!replay&&!roomEventComplete(i)){data.home.events.push(snapshot);StarCandyPlaytest.record('room_event',{item:i});roomMemory(i);if(i===3&&!data.home.read.includes('forest'))data.home.read.push('forest');persist();}
 showScreen('records');roomSay(roomEventBeats[i][2],i<2);
}
function advanceRoomStory(){
 if(!roomStory)return;if(roomStory.beat>=2){finishRoomStory();return;}
 roomStory.beat++;showScreen('records');
}
function startRoomStory(i,replay=false){
 if(i<0||i>3||!ownedItem(i))return;
 if(!roomPlaced(i)){roomPreviewFor(i);return;}
 if(i===0&&!data.home.lamp){data.home.lamp=true;roomMemory(0);persist();}
 showScreen('records');roomPreview=null;roomCelebration=null;clearTimeout(roomCelebrationTimer);resetRoomStory();
 if(i===1&&!musicBoxPlaying)playMusicBox();
 roomStory={i,beat:0,replay:replay||roomEventComplete(i),snapshot:roomEventSnapshot(i)};showScreen('records');
}
function roomChapterOverview(){
 showDialog('<h2 id="dialogTitle">把四份心愿带回家</h2><p>从一盏灯，到一间有故事的房间。</p><div class="room-chapter-cards">'+collectibles.slice(0,4).map((c,i)=>'<button data-action="'+(ownedItem(i)?roomPlaced(i)?'roomEvent':'rgPreview':'rgPreview')+'" data-item="'+i+'">'+collectionArt(i)+'<div><b>'+c.name+(i===3?' ＋ 首套软装':'')+'</b><small>第 '+(i*3+3)+' 关 · '+(roomEventComplete(i)?'故事已珍藏':ownedItem(i)?roomPlaced(i)?'点击开启小故事':'已获得，等你摆放':'收集进度 '+stageCount(i)+'/3')+'</small><span>'+roomStyleLabels[i].join(' / ')+'</span></div></button>').join('')+'</div>'+forestWishCard());
}
function handleRoomChapterAction(b){
 const a=b.dataset.action,i=Number(b.dataset.item);
 if(a==='roomChapter'){roomChapterOverview();return true;}
 if(a==='roomStorySkip'){finishRoomStory();return true;}
 if(a==='roomStoryNext'){advanceRoomStory();return true;}
 if(a==='roomEvent'){if(Number.isInteger(i)&&i>=0&&i<4)startRoomStory(i);return true;}
 if(a==='roomEventMemory'){
  const m=data.home.events.find(x=>x.id===collectibles[i]?.id);if(!m)return true;
  showDialog('<h2 id="dialogTitle">'+roomEventTitles[i]+'</h2>'+roomMemoryPicture(i,m)+'<p>'+roomEventBeats[i].join('</p><p>')+'</p><button class="secondary" data-action="rgMemories">返回回忆册</button>');return true;
 }
 return false;
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(roomStoryTimer);else if(route==='records')showScreen('records');});

// Daily notes are small keepsakes, not an additional reward currency or streak.
const roomDailyLines={
 quiet:[
  ['给刚到家的你','窗边的位置一直为你留着。今天不用急着走很远，一起找回一点星光就好。'],
  ['一份小小邀请','我把今天的第一杯茶留给了你。等我们找到夜灯，就能在暖光里慢慢喝。'],
  ['窗外的云','今天的云像一颗柔软的星糖。猫咪看了好久，我想，它也在等你回来。'],
  ['空着的位置','屋子还有许多空位置，正好留给我们的故事。先从喜欢的一件小东西开始吧。'],
  ['不着急的日子','如果今天只想坐一会儿，也很好。冒险可以慢慢来，小屋会一直在这里。'],
  ['猫咪的约定','猫咪在沙发上给你留了一小块地方。它装作睡着了，耳朵却一直朝着门口。'],
  ['把心愿带回家','我喜欢你认真挑选的样子。等第一盏灯亮起来，我们就有自己的归处了。']
 ],
 warm:[
  ['窗边的微光','你安放的夜灯，让这个角落有了家的感觉。今晚回来时，我们再一起点亮它。'],
  ['把脚步放轻','猫咪今天绕着夜灯走了一圈，又回到沙发上。它好像也认得你带回来的光。'],
  ['给忙碌的你','不必每次都带礼物回来。你推开门的时候，这间屋子就已经热闹了一点。'],
  ['下一段旋律','屋子里有了灯，我开始想象音乐响起的样子。下一次，一起去温室听听吧。'],
  ['云后的月亮','月亮躲进云里也没关系。窗台还有你留下的那盏灯，陪我们等它出来。'],
  ['温柔的角落','我把窗边收拾好了。你若想休息，就坐在离夜灯近一点的地方。'],
  ['今天也欢迎回家','有些心愿很小，却会让一整天变暖。比如留一盏灯，也比如等一个人回来。']
 ],
 lived:[
  ['旋律里的午后','我刚刚又听了一遍八音盒。你带回来的旋律，把普通的午后也变成了回忆。'],
  ['慢半拍也很好','猫咪跟着八音盒的旋律点了点头。今天我们也慢半拍，不急着赶路。'],
  ['关于下一次冒险','有音乐陪伴的小屋，连等待都变得轻快。下一份心愿，你想先摆在哪里？'],
  ['只属于这里的声音','窗外有风，屋里有你选的旋律。闭上眼睛，也能认出这是我们的家。'],
  ['一首歌的时间','如果今天很忙，就留下听一小段吧。等你回来，我们再接着讲旅途的故事。'],
  ['猫咪的听众席','它今天选好了听歌的位置，还把尾巴摆得整整齐齐。看来八音盒有一位忠实听众。'],
  ['留给明天的心愿','今天不用完成所有事。我们可以留一点期待，等下次回来时再一起打开。']
 ],
 home:[
  ['今天的两杯茶','茶具已经摆好，我也留好了你的位置。小屋的模样，是我们一点一点带回来的。'],
  ['合照旁边','我又看了看我们的合照。旅途里的风已经过去，那时候的笑容却一直留在这里。'],
  ['森林的来信','森林的朋友说，营地里有像云一样的烛台。等它来到家里，阅读角就能亮起来了。'],
  ['好好休息的理由','抱枕、花香，还有你喜欢的摆设，都是可以安心休息的理由。今天也辛苦啦。'],
  ['下一页故事','我把书页翻到了一处喜欢的地方。等你有空，我们一起把后面的故事读完。'],
  ['家的声音','听，猫咪的呼噜声混在窗外的风里。原来家的声音，可以这样轻。'],
  ['为你留下的位置','不管旅途走到了哪里，这里总有一个位置留给你。回来坐坐，再决定下一次出发。']
 ]
};
function roomDayNumber(){const [y,m,d]=localDay().split('-').map(Number);return Math.floor(Date.UTC(y,m-1,d)/86400000);}
const roomHomeExtra=[
 ['窗台的新影子','你摆下的每件收藏，都在月光里有了自己的位置。今天回家，先看看哪一角最亮。'],
 ['一页新的回忆','旅途后记又添了一页。等你坐下，我想听你说说最喜欢哪一段。'],
 ['茶桌边的晚安','杯子已经放好，猫咪也找到了舒服的位置。今晚的小屋很安静。'],
 ['星光的方向','窗外的星光换了方向，屋里这盏灯却还在原来的地方等你。'],
 ['把故事放慢','我们不急着翻完所有书页。先在小屋坐一会儿，也算今天的心愿。'],
 ['门口的脚步声','每次听见你回来，猫咪都会先抬起耳朵，再装作什么都没发生。'],
 ['新的摆法','今天把收藏换个位置，熟悉的小屋也会出现一点新的风景。'],
 ['月光留给你','我把窗边收拾好了。你若想看星星，就坐在最亮的地方。']
];
function recordRoomNoteSignal(type,id){
 if(!data.home||!['clear','place','partner'].includes(type)||!Number.isInteger(id))return;
 data.home.noteSignals=[...(data.home.noteSignals||[]),{type,id,at:Date.now()}].slice(-12);
}
function roomSignalNote(signal){
 if(signal.type==='place'&&collectibles[signal.id])return ['新收藏到家','你刚把'+collectibles[signal.id].name+'摆进小屋。我还想再看一眼你选的位置。'];
 if(signal.type==='partner'&&partners[signal.id])return ['新伙伴的座位',partners[signal.id].name+'已经和我们同行。我在小屋里给大家留了说话的位置。'];
 if(signal.type==='clear'&&levels[signal.id])return ['刚走过的这一站','第'+(signal.id+1)+'关已经完成。'+(signal.id+1===48?'森林夜色也来到了窗边。':signal.id+1===60?'潮汐的光留在了地板上。':signal.id+1===72?'现在，归航的星夜也在小屋里等你。':'回来歇一会儿，再决定下一站。')];
 return null;
}
function roomDailyNote(){
 const day=localDay();let note=data.home.dailyNotes.find(n=>n.day===day);if(note)return note;
 const kind=roomPlaced(3)&&roomPlaced(2)?'home':roomPlaced(1)?'lived':roomPlaced(0)?'warm':'quiet';
 const signals=(data.home.noteSignals||[]).filter(s=>Date.now()-s.at<=3*86400000&&s.at<=Date.now()).sort((a,b)=>b.at-a.at);
 const signal=signals[0];let chosen=signal&&roomSignalNote(signal);
 if(signal)data.home.noteSignals=data.home.noteSignals.filter(s=>s!==signal&&Date.now()-s.at<=3*86400000);
 if(!chosen){const pool=[...roomDailyLines[kind],...(kind==='home'?roomHomeExtra:[])],recent=new Set(data.home.dailyNotes.slice(-14).map(n=>n.title));const start=roomDayNumber()%pool.length;chosen=Array.from({length:pool.length},(_,i)=>pool[(start+i)%pool.length]).find(row=>!recent.has(row[0]))||pool[start];}
 note={day,title:chosen[0],text:chosen[1],read:false};data.home.dailyNotes=[...data.home.dailyNotes.filter(n=>n.day!==day),note].sort((a,b)=>a.day.localeCompare(b.day)).slice(-14);persist();return note;
}
function showRoomDailyNote(){
 const note=roomDailyNote();if(!note.read){note.read=true;persist();}
 const older=data.home.dailyNotes.filter(n=>n.day<note.day).slice(-6).reverse();
 showDialog('<section class="room-note"><small>月见留给你的便签 · '+releaseEsc(note.day)+'</small><h2 id="dialogTitle">'+releaseEsc(note.title)+'</h2><p>'+releaseEsc(note.text)+'</p><span class="room-note-sign">月见 ✧</span></section><button class="primary" data-action="roomNoteReturn">回小屋坐坐</button>'+(older.length?'<details class="room-note-history"><summary>翻看最近的便签</summary>'+older.map(n=>'<article><small>'+releaseEsc(n.day)+'</small><b>'+releaseEsc(n.title)+'</b><p>'+releaseEsc(n.text)+'</p></article>').join('')+'</details>':''));
}
const roomCatLines=[
 ['你轻轻挠了挠它的下巴。猫咪把眼睛眯成了一条线。','它用额头碰了碰你的手，尾巴慢慢扫过沙发。','你把手伸过去，它先闻了闻，再安心地靠过来。'],
 ['猫咪听见八音盒，耳朵一动一动地跟着旋律。','它安静地趴好，像是在认真听这一小段歌。','音乐停顿了一下，它抬头看你，似乎想再听一遍。'],
 ['它在你铺好的星毯上翻了个身，把最暖的位置让出一点。','猫咪踩了踩柔软的星毯，又把爪子整齐地收好。','它把星毯当成了自己的小岛，邀请你在旁边坐坐。']
];
let roomCatTouches=0,roomChimeTimer=0;
function roomPetCat(){
 if(roomStory)return;
 const lines=roomCatLines[roomPlaced(8)?2:musicBoxPlaying?1:0],text=lines[(roomDayNumber()+roomCatTouches++)%lines.length];
 roomSay(text,true);const speaker=document.querySelector('.rg-speech b');if(speaker)speaker.textContent='猫咪';if(data.sound)tone(1);
 const scene=document.querySelector('.growing-room');if(scene){scene.classList.remove('rg-cat-tail','rg-cat-ears','rg-cat-roll');void scene.offsetWidth;scene.classList.add(['rg-cat-tail','rg-cat-ears','rg-cat-roll'][roomCatTouches%3]);}
}
function roomItemReply(i){
 const replies={
  4:['烛光晃了一下。月见把书挪近一点：“这一页，我们一起读。”','云朵般的暖光落在书页上。猫咪也靠近了阅读角。'],
  5:['你轻轻碰了碰叶尖，小花盆里的绿意随风晃了晃。','月见替花盆转了个方向：“这样，今天也能多晒一点月光。”'],
  6:['书页里夹着澪留下的书签，刚好停在一个温柔的结尾。','你翻开故事集。月见笑着说：“上次，我们就读到这里。”'],
  7:['灯笼轻轻摇了一下，门廊上的月影也跟着动起来。','你抬头看了看灯笼。晚归的时候，它会替我们照亮门口。'],
  8:['猫咪踩过你铺的星毯，留下一小片暖暖的褶皱。','你抚平星毯的一角，猫咪立刻又把那里当成了枕头。'],
  9:['星晶映出一小片柔光，像把海边的夜色留在了屋里。','换个角度看，星晶里的光就变了。月见说，这是海浪留下的小秘密。'],
  10:['你轻轻转动星望镜，窗外的一点星光落进视野。','月见凑过来：“下一次，一起去看看那颗更远的星星吧。”'],
  11:['你碰了碰星海挂饰，十二站的心愿轻轻晃在一起。','星链发出细小的光。一路带回来的故事，都在这里了。']
 };
 return replies[i]?.[roomDayNumber()%2]||roomLines[i];
}
function forestWishAvailable(){return !!data.stars[11];}
function forestWishCard(){
 if(!forestWishAvailable())return '';
 const owned=ownedItem(4),left=3-stageCount(4);
 return '<button class="forest-wish-card" data-action="forestWish">'+collectionArt(4)+'<span><small>下一段故事 · 萤火营地</small><b>为阅读角带回云朵烛台</b><span>'+(owned?'已获得 · 点击看看它的故事':'第15关获得 · 还差'+left+'关')+'</span></span><i aria-hidden="true">›</i></button>';
}
function showForestWish(){
 if(!forestWishAvailable())return;
 const owned=ownedItem(4),left=3-stageCount(4);
 showDialog('<section class="forest-letter"><small>森林来信 · 萤火营地</small><h2 id="dialogTitle">把一小片暖光带回家</h2>'+collectionArt(4,'collection-large')+'<p>“营地里的夜晚有一点凉。我们做了一盏像云朵一样的烛台，想送给愿意听故事的朋友。”</p><p>月见把来信折好：“等它来到家里，我们就能在阅读角，一起读完睡前的故事了。”</p><strong>'+(owned?'云朵烛台已收入收藏柜':'完成第13—15关 · 还差'+left+'关')+'</strong><p class="forest-wish-effect">摆放后：阅读角亮起第二层暖光，轻触烛台可听见月见的回应。</p></section><button class="primary" data-action="rgPreview" data-item="4">'+(owned?'把烛台摆进小屋':'预览摆进小屋的样子')+'</button>'+(!owned?'<button class="secondary" data-action="journey">出发去萤火营地</button>':''));
}
function handleRoomLifeAction(b){
 const a=b.dataset.action;
 if(a==='roomDailyNote'){showRoomDailyNote();return true;}
 if(a==='roomNoteReturn'){closeDialog();showScreen('records');return true;}
 if(a==='forestWish'){showForestWish();return true;}
 if(a==='roomChime'){
  if(!data.economy.activeDecor.includes('wishStar')||roomStory)return true;
  roomSay('你轻碰窗铃，清亮的一声落在窗边。月见说：“这是属于我们家的声音。”');
  const node=document.querySelector('.wish-chime');if(node){node.classList.remove('chime-playing');void node.offsetWidth;node.classList.add('chime-playing');clearTimeout(roomChimeTimer);roomChimeTimer=setTimeout(()=>node.classList.remove('chime-playing'),1500);}if(data.sound)tone(2);return true;
 }
 return false;
}

// Return-journey keepsakes are story pages. The original twelve room objects stay independent.
function journeyComplete(){return levels.length>0&&levels.every((_,i)=>data.stars[i]>0);}
function journeyEndingWords(){return '这一程的星光，已经带回家。下一次冒险，我们还要一起出发。';}
function journeyEndingActions(){return '<button class="primary art-gold" data-action="records">回小屋 · 等下一封来信</button><button class="secondary" data-action="challenge">进入90秒星光挑战</button><button class="text-button" data-action="map">重访旅途 · 收集三星</button>';}
function showJourneyEnding(){
 if(!journeyComplete()){showScreen('map');return;}
 showDialog('<section class="journey-ending"><div class="result-small-art">'+portrait(0)+'</div><small>当前 '+levels.length+' 关已全部完成</small><h2 id="dialogTitle">未完待续</h2><blockquote>“'+journeyEndingWords()+'”<span>—— 月见</span></blockquote><p>谢谢你，把每一份心愿带回家。</p></section><div class="journey-ending-actions">'+journeyEndingActions()+'</div>');
}
function decorateJourneyEnding(screen){
 if(!lastResult?.won||state.mode!=='story'||!journeyComplete()||(!lastResult.firstClear&&state.level!==levels.length-1))return;
 const result=screen.querySelector('.mobile-result');if(!result)return;
 result.classList.add('journey-finale');
 result.querySelector('h1').textContent='未完待续';
 const copy=result.querySelector('h1 + p');if(copy)copy.textContent='当前 '+levels.length+' 关已全部完成，感谢你一路同行。';
 if(copy)copy.insertAdjacentHTML('afterend','<blockquote class="journey-ending-quote">“'+journeyEndingWords()+'”<span>—— 月见</span></blockquote>');
 const actions=result.querySelector('.result-actions');if(actions)actions.innerHTML=journeyEndingActions();
}
function journeyReward(group){return group<collectibles.length?collectibles[group]:journeyPostcards[group-collectibles.length];}
function journeyRewardArt(group,extra=''){
 if(group<collectibles.length)return collectionArt(group,extra);
 const c=journeyReward(group);return '<span class="journey-postcard-art postcard-scene-'+c.scene+' '+extra+'" role="img" aria-label="'+c.name+'"><i aria-hidden="true">✦</i></span>';
}
function postcardOwned(i){return !!data.stars[journeyPostcards[i].level-1];}
function postcardAlbum(){
 const owned=journeyPostcards.filter((_,i)=>postcardOwned(i)).length;
 return '<section class="postcard-album"><h3>旅途后记 · '+owned+'/'+journeyPostcards.length+'</h3><p>第37—72关，每三关留下一页故事。</p><div class="postcard-grid">'+journeyPostcards.map((c,i)=>'<button data-action="journeyPostcard" data-card="'+i+'" class="'+(postcardOwned(i)?'':'postcard-locked')+'">'+journeyRewardArt(i+12)+'<b>'+c.name+'</b><small>'+(postcardOwned(i)?data.home.postcardsRead.includes(c.id)?'已珍藏':'新故事 · 待阅读':'第'+c.level+'关收藏')+'</small></button>').join('')+'</div></section>';
}
function showJourneyPostcard(i){
 const c=journeyPostcards[i];if(!c)return;const owned=postcardOwned(i);
 if(owned&&!data.home.postcardsRead.includes(c.id)){data.home.postcardsRead.push(c.id);persist();}
 showDialog('<section class="postcard-letter">'+journeyRewardArt(i+12)+'<small>'+c.place+' · '+(owned?'已收入旅途后记':'故事预告')+'</small><h2 id="dialogTitle">'+c.name+'</h2><p>'+(owned?c.story:'和'+c.speaker+'重访'+c.place+'。完成第'+(c.level-2)+'—'+c.level+'关，把这一页故事收入小屋回忆。')+'</p><span>—— '+c.speaker+'</span></section><button class="primary" data-action="'+(owned?'rgMemories':'journey')+'">'+(owned?'放回小屋回忆册':'继续旅途 · 第'+data.unlocked+'关')+'</button>');
}
function returnJourneyWish(){
 if(journeyComplete())return {title:'未完待续',action:'journeyEnding',button:'未完待续 · 下一程再相见',detail:'这一程的心愿已带回家，下一次冒险，我们还要一起出发',upcoming:true};
 const unread=journeyPostcards.findIndex((c,i)=>postcardOwned(i)&&!data.home.postcardsRead.includes(c.id));
 if(unread>=0)return {title:'新故事 · '+journeyPostcards[unread].name,action:'journeyPostcardNext',button:'读一页旅途后记',detail:journeyPostcards[unread].place+' · 已收入小屋回忆',upcoming:true};
 const next=journeyPostcards.findIndex((_,i)=>!postcardOwned(i));
 if(next>=0)return {title:'下一页故事 · '+journeyPostcards[next].name,action:'journey',button:'继续第 '+data.unlocked+' 关',detail:journeyPostcards[next].place+' · 再过'+(3-stageCount(next+12))+'关收藏',upcoming:true};
 return {title:'七十二关的故事，都在这里',action:'rgMemories',button:'翻开我们的旅途后记',detail:'十二件小屋收藏与十二页旅途后记，已经全部带回家',upcoming:true};
}
function returnJourneyDock(){
 const next=journeyPostcards.findIndex((_,i)=>!postcardOwned(i)),unread=journeyPostcards.findIndex((c,i)=>postcardOwned(i)&&!data.home.postcardsRead.includes(c.id));
 const i=unread>=0?unread:next<0?11:next,c=journeyPostcards[i],owned=postcardOwned(i);
 return '<div class="rg-dock"><div class="rg-wish"><span class="rg-prize">'+journeyRewardArt(i+12)+'</span><div><small>'+(journeyComplete()?'未完待续 · 下一程再相见':owned?'新故事到家':'下一页旅途后记')+'</small><b>'+c.name+'</b><small>'+c.place+(owned?'':' · 再过'+(3-stageCount(i+12))+'关')+'</small></div><button class="rg-preview-link" data-action="journeyPostcard" data-card="'+i+'">'+(owned?'阅读':'预告')+' ›</button></div><button class="primary art-gold" data-action="'+(owned?'journeyPostcard':'journey')+'" data-card="'+i+'">'+(owned?'翻开这一页故事':'继续第 '+data.unlocked+' 关')+'</button></div>';
}
function renderReturnResult(){
 const r=lastResult,i=state.level,g=Math.floor(i/3),c=journeyReward(g),gift=r.won&&i%3===2,rew=r.reward||{coins:0,diamonds:0};
 return '<section class="mobile-result"><div class="result-small-art">'+portrait(data.partner)+'</div><div class="result-stars">'+(r.won?'★'.repeat(r.stars)+'☆'.repeat(3-r.stars):'✧')+'</div><h1 class="screen-title" tabindex="-1">'+(r.won?gift?'这一页故事，留给我们的家':'又留下一点新的星光':'调整一步，再出发')+'</h1><p>第'+(i+1)+'关 · '+levels[i].title+'</p><div class="result-tally"><span>本局星光<strong>'+state.score.toLocaleString()+'</strong></span><span>剩余步数<strong>'+state.moves+'</strong></span></div>'+chapterResultGoals()+(r.won?'<div class="earned-currency">'+lobbyIcon('coin')+'<b>+'+rew.coins+'</b>'+(rew.diamonds?lobbyIcon('diamond')+'<b>+'+rew.diamonds+'</b>':'')+'<small>'+(r.firstClear?'首次通关奖励':'重玩奖励')+'</small></div>'+(gift?'<div class="world-reward-reveal">'+journeyRewardArt(g)+'<h2>'+c.name+'</h2><p>'+(r.firstClear?'旅途后记已收入小屋回忆':'故事已珍藏 · 星级记录已更新')+'</p><button class="secondary" data-action="journeyPostcard" data-card="'+(g-12)+'">读'+c.speaker+'的故事</button></div>':stagePreparation(i))+(r.firstClear&&[47,59,71].includes(i)?'<p class="room-theme-unlock">小屋新氛围已解锁 · '+['森林夜色','潮汐星光','归航星夜'][[47,59,71].indexOf(i)]+'。回小屋就能看到，也可切换。</p>':'')+'<div class="result-actions">'+(i<levels.length-1?'<button class="primary art-gold" data-action="next">继续第 '+(i+2)+' 关</button>':'<button class="primary art-gold" data-action="records">七十二关完成 · 一起回家</button>')+'<button class="secondary" data-action="rgMemories">回小屋翻看旅途后记</button></div>':chapterFailure()+'<button class="primary" data-action="retry">调整伙伴与道具，再试一次</button>')+'<button class="text-button" data-action="map">回旅途地图</button></section>';
}
function handleJourneyPostcardAction(b){
 if(b.dataset.action==='journeyEnding'){showJourneyEnding();return true;}
 if(b.dataset.action==='journeyPostcard'){const i=Number(b.dataset.card);if(Number.isInteger(i))showJourneyPostcard(i);return true;}
 if(b.dataset.action==='journeyPostcardNext'){const i=journeyPostcards.findIndex((c,n)=>postcardOwned(n)&&!data.home.postcardsRead.includes(c.id));showJourneyPostcard(i<0?11:i);return true;}
 return false;
}

// First visit guidance shares the normal game/save flow; it never grants rewards.
function firstLightComplete(){return data.home.memories.includes('nightlight');}
function firstLesson(level,mode='story'){return !trialPending&&mode==='story'&&level>=0&&level<3&&!data.stars[level]&&!firstLightComplete();}
function lessonActive(){return !state.trial&&state.mode==='story'&&state.level<3&&['match','four','skill','react'].includes(state.lesson);}
function lessonAdvice(){
 if(state.lesson==='skill')return !skillMode?'点「共鸣」，月见会帮你移动水附着。':skillMode.source===null?'点亮框中的水糖，选中它的水附着。':'点第一行亮框中的星糖，把水附着放上去。';
 if(state.lesson==='react')return '交换亮框中的两颗糖，让三颗火糖碰到水附着。';
 return state.lesson==='four'?'交换亮框中的两颗糖，连成四颗火糖。':'交换亮框中的两颗糖，连成三颗火糖。';
}
function lessonTargets(){
 if(!lessonActive())return [];
 if(state.lesson==='skill')return !skillMode?[]:skillMode.source===null?[24]:[3];
 return [2,9];
}
function paintLessonTargets(){
 const targets=lessonTargets();
 board.querySelectorAll('.tile').forEach(el=>el.classList.toggle('lesson-target',targets.includes(Number(el.dataset.index))));
 $('skill').classList.toggle('lesson-skill',state.lesson==='skill'&&!skillMode&&lessonActive());
}
function lessonAllowsSwap(a,b){
 if(!lessonActive())return true;
 if(state.lesson==='skill'||!(a===2&&b===9||a===9&&b===2)){toast(lessonAdvice());return false;}
 return true;
}
function lessonAllowsSkillTarget(i){
 if(state.lesson!=='skill'||!lessonActive())return true;
 if(i===(skillMode.source===null?24:3))return true;
 toast(lessonAdvice());return false;
}
function handleFirstLightAction(b){
 if(b.dataset.action==='lessonSkip'){
  if(canAct()){state.lesson='done';skillMode=null;state.selected=-1;render();hud();snapshot();toast('可以自由尝试；提示按钮随时为你找一步。');}return true;
 }
 if(b.dataset.action==='firstLightRoom'){
  if(!ownedItem(0)){intro('story',Math.min(2,data.unlocked-1));return true;}
  if(roomPlaced(0))showScreen('records');else roomPreviewFor(0);return true;
 }
 if(b.dataset.action==='firstLightPreview'){roomPreviewFor(0);return true;}
 if(b.dataset.action==='lobbyMore'){
  showDialog('<h2 id="dialogTitle">旅途小帮手</h2><p>先把第一盏灯带回家，也可以随时来这里逛逛。</p><div class="first-light-menu">'+[['daily','calendar','每日签到'],['shop','shop','心愿商店'],['wcMailbox','mail','月光信箱'],['challenge','stars','限时挑战'],['prologueReplay','mail','重看序章']].map(([action,art,label])=>'<button class="secondary" data-action="'+action+'">'+lobbyIcon(art)+'<span>'+label+'</span></button>').join('')+'</div>');return true;
 }
 return false;
}

// Chapter-one goals live on board positions, independently of falling candy.
const legacyLevels=levels.map(l=>({...l}));
const chapterDesigns=[
 {title:'星灯工坊 · 寻光',goal:900,moves:12,stars:[3,6],tip:'先完成一次三消，把第一束光收起来。'},
 {title:'星灯工坊 · 四连',goal:1050,moves:14,stars:[4,8],tip:'四连留下直线糖，消除它可以扫清整行或整列。'},
 {title:'星灯工坊 · 共鸣',goal:1200,moves:15,stars:[4,8],tip:'让月见移动水附着，安排一次水火接力。'},
 {title:'花溪温室 · 收集露珠',goal:600,moves:16,color:1,count:14,opening:'water',turn:1,stars:[4,8],recommend:1,tip:'优先收集水糖；澪可以给已有火附着的糖施加水，引发蒸腾。'},
 {title:'花溪温室 · 薄霜初融',goal:900,moves:17,ice:[15,16,17,23,24,25],opening:'fire',turn:2,stars:[4,9],recommend:0,tip:'在结霜格消除一次，就能清掉薄霜。薄霜固定在格子上，不跟着糖移动。'},
 {title:'花溪温室 · 花语回响',goal:1000,moves:19,color:1,count:10,ice:[10,17,23,24,25,31],opening:'water',turn:0,stars:[5,10],recommend:1,tip:'水糖和薄霜都要完成。直线糖可以帮你扫过多个结霜格。'},
 {title:'云桥观景台 · 水火相遇',goal:900,moves:17,reactions:1,types:['steam'],opening:'fire',turn:0,auras:[[3,'water'],[25,'water']],stars:[4,8],recommend:0,tip:'先找水附着，再在附近消除火糖。水火蒸腾才计入本关目标。'},
 {title:'云桥观景台 · 花种约定',goal:1000,moves:19,reactions:1,types:['bloom'],opening:'water',turn:2,auras:[[45,'grass'],[24,'grass']],stars:[4,9],recommend:1,tip:'水遇到草附着会绽芽。留下的种子在下一步结束时绽放，不重复计数。'},
 {title:'云桥观景台 · 一起入镜',goal:1200,moves:22,ice:[16,18,30,32],reactions:2,types:['any'],opening:'fire',turn:1,auras:[[27,'water'],[24,'grass']],stars:[5,10],recommend:1,tip:'先做反应，再照顾剩下的结霜格。两次反应不必在同一步完成。'},
 {title:'月光邮局 · 信纸冰纹',goal:1500,moves:21,color:2,count:10,ice:[9,10,11,16,18,23,24,25],opening:'star',turn:3,pool:[0,1,2,3,4],stars:[5,10],recommend:0,tip:'星糖与薄霜要一起收集，先找能同时完成两项目标的交换。'},
 {title:'月光邮局 · 邀你喝茶',goal:1500,moves:22,color:1,count:12,reactions:2,types:['steam','bloom'],opening:'water',turn:0,auras:[[3,'grass'],[25,'fire']],pool:[0,1,2,3,4],stars:[5,10],recommend:1,tip:'水火蒸腾、水草绽芽都算。澪能直接施加水，月见也能把水附着移到合适的位置。'},
 {title:'月光邮局 · 家的模样',goal:1800,moves:25,ice:[9,10,11,16,17,18,23,24,25,31],reactions:2,types:['any'],opening:'fire',turn:2,auras:[[45,'water'],[24,'grass']],pool:[0,1,2,3,4],stars:[6,11],recommend:1,tip:'这是本章的小挑战：清薄霜、安排两次反应，再把星光带回家。'}
];
chapterDesigns.forEach((d,i)=>Object.assign(levels[i],{...d,color:d.color??-1,count:d.count||0,pool:d.pool||[0,1,2,3],ice:d.ice||[],types:d.types||[],reactions:d.reactions||0,recommend:d.recommend??0}));
function validChapterSnapshot(c){
 return c===undefined||c===null||c&&c.version===1&&typeof c.legacy==='boolean'&&Array.isArray(c.ice)&&c.ice.length<=49&&c.ice.every(i=>Number.isInteger(i)&&i>=0&&i<49)&&Number.isInteger(c.reactions)&&c.reactions>=0&&c.reactions<=10000;
}
function battleLevel(){return state.levelTargets||(state.chapter?.legacy?legacyLevels[state.level]:levels[state.level]);}
function setupChapter(saved){
 state.chapter=null;if(state.mode!=='story'||state.trial||(state.level>=12&&!levels[state.level].managedGoals))return;
 const d=levels[state.level],old=saved?.chapter;
 state.chapter={version:1,legacy:!!saved&&(!old||old.legacy),ice:[],reactions:0};
 if(state.chapter.legacy)return;
 engine.pool=[...d.pool];
 state.chapter.ice=saved?[...new Set((old?.ice||[]).filter(i=>d.ice.includes(i)))]:[...d.ice];
 state.chapter.reactions=saved?Math.min(d.reactions,old?.reactions||0):0;
}
function rotateChapterIndex(i,turn=0){for(let n=0;n<turn;n++)i=i%7*7+6-Math.floor(i/7);return i;}
function chapterOpening(opening='fire',turn=0){
 // Companion practice needs one known exchange; all surrounding cells remain random.
 const k={fire:0,water:1,star:2,grass:3}[opening]??0,other=engine.pool.find(c=>c!==k);
 const fixed=[[0,k],[1,k],[2,other],[3,2],[9,k],[24,1]].map(([i,c])=>[rotateChapterIndex(i,turn),c]);
 engine.generate({fixed});
}
function makeChapterBoard(){
 if(!state.chapter||state.chapter.legacy||state.level<3)return false;
 const d=levels[state.level];engine.generate();for(const [i,e] of d.auras||[])elements.attach(i,e);return true;
}
function chapterClear(indices){if(state.chapter&&!state.chapter.legacy)state.chapter.ice=state.chapter.ice.filter(i=>!indices.has(i));}
function chapterReactions(events){
 const c=state.chapter,d=battleLevel();if(!c||c.legacy||!d.reactions)return;
 for(const ev of events)if(ev.type&&ev.type!=='replace'&&(d.types.includes('any')||d.types.includes(ev.type)))c.reactions=Math.min(d.reactions,c.reactions+1);
}
function reactionGoalName(d){return d.types?.length===1&&d.types[0]==='steam'?'水火蒸腾':d.types?.length===1&&d.types[0]==='bloom'?'水草绽芽':d.types?.includes('any')?'元素反应':'水火／水草';}
function chapterGoalLines(level=state.level,live=true){
 const d=live?battleLevel():levels[level],c=live?state.chapter:null,lines=[];
 if(d.color>=0)lines.push({label:names[d.color],now:live?Math.min(d.count,state.collected[d.color]):0,total:d.count});
 if(d.ice?.length)lines.push({label:'薄霜',now:live?d.ice.length-(c?.ice.length??d.ice.length):0,total:d.ice.length});
 if(d.reactions)lines.push({label:reactionGoalName(d),now:live?c?.reactions||0:0,total:d.reactions});
 return lines;
}
function chapterWon(){return chapterGoalLines().every(g=>g.now>=g.total);}
function chapterStars(){const thresholds=battleLevel().stars||[4,9];return 1+Number(state.moves>=thresholds[0])+Number(state.moves>=thresholds[1]);}
function chapterHUD(){
 if(state.practice){$('levelTitle').textContent=partners[data.partner].name+' · 伙伴练习';$('levelSubtitle').textContent='独立练习 · 不消耗背包道具';$('movesLabel').textContent='自由练习';$('moves').textContent='免费';$('moves').classList.remove('low');$('targetLabel').textContent='体验一次主动技能';$('targetText').textContent=state.practice.done?'配合完成':'点共鸣，再点亮框中的目标';$('goalBar').style.width=state.practice.done?'100%':'0%';return;}
 if(state.mode!=='story'||(state.level>=12&&!levels[state.level].managedGoals))return;
 const d=battleLevel(),goals=chapterGoalLines();
 $('targetLabel').textContent=goals.length?goals.map(g=>g.label+' '+g.now+'/'+g.total).join(' · '):'心愿目标';
 $('targetText').textContent=(goals.length?'星光 ':'')+Math.min(state.score,d.goal).toLocaleString()+' / '+d.goal.toLocaleString();
 $('goalBar').style.width=Math.min(1,state.score/d.goal,...goals.map(g=>g.now/g.total))*100+'%';
}
function paintChapterBoard(){
 board.querySelectorAll('.tile').forEach(el=>{
  const icy=!!state.chapter?.ice.includes(Number(el.dataset.index));el.classList.toggle('chapter-ice',icy);
  let frost=el.querySelector('.chapter-frost');
  if(icy&&!frost){frost=document.createElement('span');frost.className='chapter-frost';frost.setAttribute('aria-hidden','true');frost.textContent='❄';el.append(frost);}else if(!icy&&frost)frost.remove();
  if(icy)el.setAttribute('aria-label',el.getAttribute('aria-label')+'，这一格有薄霜');
  el.classList.toggle('practice-target',!!state.practice&&!state.practice.done&&Number(el.dataset.index)===(data.partner===0?(!skillMode||skillMode.source===null?24:3):24));
 });
}
function chapterPrep(level){
 if(level>=12&&!levels[level].managedGoals)return '<small class="chapter-stars">剩余 4 步获两星 · 9 步获三星</small>';const d=levels[level],goals=chapterGoalLines(level,false),p=d.recommend;
 return '<section class="chapter-brief"><div class="chapter-goals">'+goals.map(g=>'<span>'+g.label+' <b>'+g.total+'</b></span>').join('')+'</div><p>'+d.tip+'</p>'+(level>=3?'<div class="chapter-recommend">'+portrait(p)+'<div><b>推荐 '+partners[p].name+'</b><small>'+(p===1?'主动施加水附着，配合火或草':'移动已有附着，安排下一步')+' · '+(partnerOwned(p)?'已拥有':'可免费练习')+'</small></div><button data-action="practicePartner" data-partner="'+p+'">练习</button></div>':'')+'<small class="chapter-stars">剩余 '+d.stars[0]+' 步获两星 · '+d.stars[1]+' 步获三星</small></section>';
}
function chapterGoalSummary(level){const d=levels[level];return [d.goal+' 星光',...chapterGoalLines(level,false).map(g=>g.label+' '+g.total)].join(' · ');}
function chapterResultGoals(){const goals=chapterGoalLines();return goals.length?'<div class="chapter-result-goals">'+goals.map(g=>'<span class="'+(g.now>=g.total?'complete':'')+'">'+(g.now>=g.total?'✓ ':'')+g.label+' '+g.now+'/'+g.total+'</span>').join('')+'</div>':'';}
function chapterFailure(){
 const d=battleLevel(),missing=chapterGoalLines().filter(g=>g.now<g.total),parts=missing.map(g=>g.label+'还差 '+(g.total-g.now));if(state.score<d.goal)parts.push('星光还差 '+(d.goal-state.score));
 const tip=missing.some(g=>g.label==='薄霜')?'优先在结霜格附近制造直线糖。消除该格，或让特殊糖和反应扫过它，都能清掉薄霜。':d.reactions&&state.chapter?.reactions<d.reactions?'先留下水、火或草附着，再安排下一步接触；伙伴共鸣也能完成反应目标。':missing.length?'先找目标颜色的四连，多余颜色可用特殊糖一起清走。':'目标已经接近完成，试着用四连和特殊糖提高一次交换的收获。';
 return '<div class="chapter-failure"><b>'+parts.join(' · ')+'</b><p>'+tip+'</p></div>';
}
function chapterInvitation(){
 if(state.level!==5||!lastResult?.won)return '';
 return '<aside class="mio-invitation">'+portrait(1)+'<div><b>澪想和你一起出发</b><p>水附着由她来准备，下一次反应由你决定。</p><small>'+(partnerOwned(1)?'已拥有 · 可在准备页选择':partnerPrice(1)+' · 当前 '+data.economy.coins+' 金币')+'</small></div><button data-action="partnerOffer" data-partner="1">'+(partnerOwned(1)?'邀请同行':'先认识澪')+'</button></aside>';
}
function chapterSupply(reward,won,first){
 if(!won||!first||state.mode!=='story'||state.trial||state.level!==5||data.economy.chapterSupply)return;
 data.economy.chapterSupply=true;reward.chapterCoins=60;reward.coins+=60;data.economy.coins+=60;
}

// Free practice uses the same isolated backup as the mirror trial.
function startPartnerPractice(p){
 if(!Number.isInteger(p)||p<0||p>4||state.busy)return;
 if(state.trial)exitTrial();
 trialBackup={state:structuredClone(state),cells:structuredClone(engine.cells),pool:[...engine.pool],rng:engine.rng,elements:structuredClone(elements.export()),partner:data.partner,snapshot:data.snapshot,result:lastResult,preparation:preparation?{...preparation}:null,route};
 trialPending=true;data.partner=p;start('time',0);trialPending=false;state.practice={partner:p,done:false,skill:false};state.energy=skillCost();engine.pool=[0,1,2,3];chapterOpening();
 elements.restore(null);elements.attach(24,p===0?'water':p===1?'fire':p===2?'water':p===3?'water':'grass');
 setPartner(p);render();hud();$('caption').textContent='独立练习 · 不发放通关奖励';
}
function practiceCoach(){
 if(!state.practice)return false;
 const p=data.partner,copy=state.practice.done?'配合完成了，可以重新练习或回到旅途。':p===0?(!skillMode?'点共鸣，把水附着移到第一行的星糖。':skillMode.source===null?'先点亮框中的水附着。':'再点第一行的星糖，放下水附着。'):p===4?'先在下方选「水」，点共鸣，把亮框中的草附着转换成水。':'点共鸣，再点亮框中有'+(p===1?'火':'水')+'附着的糖，看看'+partners[p].name+'的配合。';
 const box=$('coach'),html='<div class="lesson-copy"><small>'+partners[p].name+' · 免费练习</small><p>'+copy+'</p></div>';box.hidden=false;if(box.innerHTML!==html)box.innerHTML=html;return true;
}
function practiceAfterSkill(events){
 if(!state.practice||state.practice.done)return;
 const p=data.partner,success=p===0||p===4||events.some(e=>e.type===(p===3?'bloom':'steam'));
 if(!success)return;state.practice.done=true;const epoch=state.epoch;
 setTimeout(()=>{if(!state.trial||state.epoch!==epoch||!state.practice?.done||route!=='game')return;
  showDialog('<div class="practice-portrait">'+portrait(p)+'</div><h2 id="dialogTitle">'+partners[p].name+' · 配合完成</h2><p>'+[ '月见把已有的水附着搬到了新的位置，不需要等它自己落过去。','澪给火附着施加了水，直接触发蒸腾；她也能和草附着配合绽芽。','小焰把火送到水附着上，触发蒸腾。遇到草还可以留下余焰。','青芽与水附着配合留下种子，下一步结束时会绽放。','绯镜改变已有附着，帮你为下一次交换准备新的元素。'][p]+'</p><button class="primary" data-action="practiceReturn">'+(trialBackup?.preparation?'返回关卡准备':'返回伙伴')+'</button><button class="secondary" data-action="practicePartner" data-partner="'+p+'">再练一次</button>'+(!partnerOwned(p)?'<button class="text-button" data-action="practiceOffer">查看解锁 · '+partnerPrice(p)+'</button>':'')+'<p class="economy-note">练习不会解锁角色，也不会消耗你的旅途资源。</p>');
 },950);
}
function returnFromPractice(){
 const prep=trialBackup?.preparation,back=trialBackup?.route,p=data.partner;exitTrial();
 if(prep){showScreen(back||'home');preparation=prep;showPreparation();}else{artPartnerView=p;showScreen('partners');}
}
function handleChapterAction(b){
 if(b.dataset.action==='practicePartner'){startPartnerPractice(Number(b.dataset.partner));return true;}
 if(b.dataset.action==='practiceReturn'||b.dataset.action==='exitTrial'&&state.practice){returnFromPractice();return true;}
 if(b.dataset.action==='restartPrompt'&&state.practice){showDialog('<h2 id="dialogTitle">再练习一次？</h2><p>重新准备附着与满格共鸣，不消耗道具。</p><button class="primary" data-action="practicePartner" data-partner="'+data.partner+'">重新练习</button><button class="secondary" data-action="practiceReturn">结束练习并返回</button>');return true;}
 if(b.dataset.action==='practiceOffer'){const p=data.partner;exitTrial();artPartnerView=p;showScreen('partners');showPartnerOffer(p);return true;}
 return false;
}

// Keep the original level indices and collection unlocks. Bridge chapter 1 to the return journey.
const bridgeMoves=[[25,25,25],[25,25,26],[25,26,26],[26,26,26],[26,26,27],[26,27,27],[27,27,27],[27,27,27]];
for(let i=12;i<36;i++){
 const group=Math.floor((i-12)/3),stage=(i-12)%3;
 Object.assign(levels[i],{goal:1900+(i-12)*100,moves:bridgeMoves[group][stage],count:10+group+stage,
  pool:i<18?[0,1,2,3,4]:[0,1,2,3,4,5],stars:[4,9]});
 if(!levels[i].pool.includes(levels[i].color))levels[i].pool.push(levels[i].color);
}
// Eight three-level arcs: familiar objective, changed board, combined challenge.
const bridgeArcs=[
 {ice:'window',type:'steam',color:3,tip:'先收集草芽；再用已有水附着与火糖配合，清理窗边薄霜。'},
 {ice:'corners',type:'bloom',color:0,tip:'先收集火糖；水与草附着会绽芽，边角薄霜可用直线糖处理。'},
 {ice:'steps',type:'steam',color:3,tip:'颜色逐步增加到六种；先适应新棋盘，再安排水火蒸腾。'},
 {ice:'path',type:'steam',color:1,tip:'沿着薄霜路径规划交换，水火反应能帮你打开局面。'},
 {ice:'waves',type:'bloom',color:4,tip:'试着留下直线糖，清理薄霜后安排水草绽芽。'},
 {ice:'ring',type:'bloom',color:5,tip:'先处理环形薄霜，再用水草反应收好海边的星光。'},
 {ice:'frame',type:'steam',color:0,tip:'用特殊糖清理冰纹，水火反应完成最后一步。'},
 {ice:'stars',type:'any',color:2,tip:'把已学会的薄霜、元素反应和收集目标连起来。'}
];
for(let i=12;i<36;i++){
 const arc=bridgeArcs[Math.floor((i-12)/3)],stage=(i-12)%3,d=levels[i];
 d.managedGoals=true;d.color=stage===1?-1:arc.color;d.count=stage===1?0:stage===2?12+Math.floor((i-12)/3):10+Math.floor((i-12)/3);
 d.ice=stage===0?[]:[...returnIce[arc.ice]];
 d.reactions=stage===0?0:stage===1?arc.type==='any'?1:1:arc.type==='any'?2:1;
 d.types=d.reactions?[arc.type]:[];d.auras=d.reactions?arc.type==='bloom'?[[3,'grass'],[24,'water'],[45,'grass']]:[[3,'water'],[24,'fire'],[45,'water']]:[];
 d.recommend=arc.type==='bloom'?1:0;d.tip=stage===0?'用熟悉的收集目标热身；连成四颗可留下直线糖。':stage===1?arc.tip:'这是本组三关的小挑战：'+arc.tip;
 if(i===18)d.pool=[0,1,2,3,4]; // Level 19 remains five colors; level 20 introduces six.
 if(i>=19&&i<36)d.pool=[0,1,2,3,4,5];
 if(!d.pool.includes(d.color)&&d.color>=0)d.pool.push(d.color);
}
// In-progress rounds from older builds keep their original targets until that round ends.
function roundLevel(saved){
 if(state.mode!=='story')return null;
 const base=state.chapter?.legacy||saved&&!saved.rulesVersion&&state.level>=12&&state.level<36?legacyLevels[state.level]:levels[state.level];
 const old=saved?.levelTargets;
 if(old&&Number.isInteger(old.goal)&&old.goal>=100&&old.goal<=100000&&Number.isInteger(old.count)&&old.count>=0&&old.count<=100&&Number.isInteger(old.color)&&old.color>=-1&&old.color<=6)
  return {...base,goal:old.goal,count:old.count,color:old.color};
 return {...base};
}

// Public weekly challenge. Platform scores are separate from local legacy bestTime.
const challengeRules='weekly-v1';
let challengeContext=null,challengePrepSerial=0,challengeSubmitBusy=false;
function normalizeWeeklyPending(raw){
 if(!raw||raw.rules!=='weekly-v1'||!/^\d{9,13}-\d{9,13}$/.test(raw.period)||!Number.isSafeInteger(raw.score)||raw.score<1000||raw.score>999999)return null;
 return {rules:'weekly-v1',period:raw.period,score:raw.score,finishedAt:Number.isFinite(raw.finishedAt)?raw.finishedAt:0};
}
function weeklyPendingExpired(p){return !p||Number(p.period.split('-')[1])*1000<=Date.now();}
function weeklyPendingMarkup(){
 const p=normalizeWeeklyPending(data.weeklyPending);if(!p)return '';
 return '<section class="weekly-prizes"><h2>待提交成绩</h2><p>'+p.score.toLocaleString()+' 分 · '+(weeklyPendingExpired(p)?'本周赛期已结束，无法再提交。':'提交失败或尚未提交，可在这里重试。')+'</p><p id="weeklySubmitStatus" role="status"></p>'+(weeklyPendingExpired(p)?'<button class="secondary" data-action="weeklyDismiss">清除过期记录</button>':'<button class="secondary" data-action="weeklySubmit">重试提交周榜</button>')+'</section>';
}
function challengeCalendar(ms=Date.now()){
 const day=new Date(ms+8*3600000).toISOString().slice(0,10),date=new Date(day+'T00:00:00Z');
 date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);
 return {day,week:date.toISOString().slice(0,10)};
}
function normalizeChallenge(raw){
 const date=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)?s:'';
 return {version:1,day:date(raw?.day),week:date(raw?.week),daily:raw?.daily===true,
  tiers:[6000,10000].filter(n=>raw?.tiers?.includes(n)),best:Number.isSafeInteger(raw?.best)&&raw.best>=0?Math.min(999999,raw.best):0};
}
function mergeChallenge(a,b){
 a=normalizeChallenge(a);b=normalizeChallenge(b);
 const daily=a.day>b.day?a:b,weekly=a.week>b.week?a:b;
 return {...weekly,day:daily.day,daily:a.day===b.day?a.daily||b.daily:daily.daily,
  tiers:a.week===b.week?[...new Set([...a.tiers,...b.tiers])]:weekly.tiers,
  best:a.week===b.week?Math.max(a.best,b.best):weekly.best};
}
function challengeLedger(){return data.economy.challenge;}
function challengeProgress(){const now=challengeCalendar(),l=challengeLedger();return {...now,daily:l.day>=now.day&&l.daily,tiers:l.week===now.week?l.tiers:[],best:l.week===now.week?l.best:0};}
function challengeRng(seed){
 let n=2166136261;for(const c of seed)n=Math.imul(n^c.charCodeAt(0),16777619);
 return ()=>{n+=0x6D2B79F5;let t=n;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};
}
function challengeConfigured(){return !!StarCandyRelease.weeklyLeaderboard?.id;}
function challengeManager(){
 const id=StarCandyRelease.weeklyLeaderboard?.id;
 if(!id)throw Error('周榜尚未在平台完成配置，当前可玩本机挑战并领取挑战奖励。');
 if(typeof globalThis.tap?.getLeaderboardManager!=='function')throw Error('请在支持排行榜的 TapTap 客户端中打开游戏。');
 return globalThis.tap.getLeaderboardManager();
}
function challengeCall(method,args){
 return new Promise((resolve,reject)=>{
  let done=false;const finish=(fn,v)=>{if(done)return;done=true;clearTimeout(timer);fn(v);};
  const timer=setTimeout(()=>finish(reject,Error('排行榜请求超时，请稍后重试。')),12000);
  try{const manager=challengeManager();if(typeof manager?.[method]!=='function')throw Error('当前客户端尚不支持此排行榜接口，请更新 TapTap。');
   manager[method]({...args,callback:{onSuccess:r=>finish(resolve,r),onFailure:(code,message)=>finish(reject,Error('排行榜暂不可用（'+String(code)+'）：'+String(message||'请稍后重试')))}});
  }catch(e){finish(reject,e);}
 });
}
async function challengePeriod(){
 const r=await challengeCall('loadLeaderboardScores',{leaderboardId:StarCandyRelease.weeklyLeaderboard.id,collection:'public',maxSize:1});
 const period=r?.leaderboard?.period,token=period?.periodToken;
 if(typeof token!=='string'||!/^\d{9,13}-\d{9,13}$/.test(token))throw Error('平台未返回有效周赛周期，暂不上传成绩。');
 const [start,end]=token.split('-').map(Number);if(end-start<5*86400||end-start>8*86400)throw Error('平台榜单不是周榜，暂不上传成绩。');
 return {token,label:period.display||'本周',receivedAt:performance.now()};
}
function challengeRulesHtml(){return '<ul class="weekly-rules"><li>每局90秒，统一月见、6种星糖；免费星锤1个、重排1次，不消耗背包。</li><li>每周使用相同开局与掉落随机序列；操作不同会产生不同的棋盘。</li><li>完成至少3次有效交换且达到1000分，才计入奖励；退出、练习和读档不计。</li><li>周榜须连续完成；暂停、离开游戏或切到后台后，本局仅领取本机奖励。</li><li>周榜保留本周最高分，周期结束自动重置；不按排名发放货币。</li></ul>';}
function renderChallenge(next,screen){
 if(next==='challenge'){
  const p=challengeProgress();screen.innerHTML='<section class="weekly-page"><small>WEEKLY STARLIGHT</small><h1 class="screen-title" tabindex="-1">90秒星光挑战</h1><p>和月见一起，刷新这一周的星光纪录。</p><div class="weekly-score"><small>本机本周最佳</small><strong>'+p.best.toLocaleString()+'</strong><span>'+p.week+' 起 · 北京时间</span></div><div class="weekly-prizes"><h2>本周的小目标</h2><p>每日首场有效挑战 <b>＋60金币</b> · '+(p.daily?'今日已领':'今日待领')+'</p>'+[[6000,100],[10000,150]].map(([score,coins])=>'<p>本周首次达到 '+score+' 分 <b>＋'+coins+'金币</b> · '+(p.tiers.includes(score)?'已领取':'待完成')+'</p>').join('')+'</div>'+weeklyPendingMarkup()+'<button class="primary" data-action="challengeStart">开始挑战</button><button class="secondary" data-action="weeklyBoard">查看 TapTap 周榜</button>'+(!challengeConfigured()?'<p class="weekly-note">平台周榜配置中，本机挑战与奖励已开放。</p>':'')+'<details><summary>挑战与周榜规则</summary>'+challengeRulesHtml()+'<p>奖励次数保存在存档中，恢复旧备份不叠加本机已领次数。跨设备请先恢复同一份最新备份。</p></details><button class="text-button" data-action="home">回大厅</button></section>';return true;
 }
 if(next==='result'&&state.mode==='time'&&lastResult){
  const r=lastResult,c=r.challenge;screen.innerHTML='<section class="weekly-page"><small>CHALLENGE COMPLETE</small><h1 class="screen-title" tabindex="-1">星光已收好</h1><div class="weekly-score"><small>本局得分</small><strong>'+state.score.toLocaleString()+'</strong></div><div class="weekly-prizes"><h2>'+(r.reward.coins?'获得 '+r.reward.coins+' 金币':'本局奖励')+'</h2><p>'+releaseEsc(c?.rewardNote||'旧版恢复对局不计入新挑战奖励。')+'</p></div><p id="weeklySubmitStatus" role="status">'+releaseEsc(c?.rankNote||'本局不参加周榜。')+'</p>'+(c?.eligible&&!c.submitted?'<button class="secondary" data-action="weeklySubmit">将本局成绩提交周榜</button>':'')+'<button class="primary" data-action="challengeStart">再挑战一次</button><button class="secondary" data-action="weeklyBoard">查看周榜</button><button class="text-button" data-action="challenge">返回挑战</button><button class="text-button" data-action="home">回大厅</button></section>';return true;
 }
 return false;
}
function showChallengePreparation(){
 const serial=++challengePrepSerial;challengeContext=null;
 showDialog('<section class="weekly-prep"><small>WEEKLY STARLIGHT</small><h2 id="dialogTitle">和月见挑战90秒</h2><p>本局统一使用月见，免费星锤1个、重排1次。</p><p id="weeklyReady" role="status">'+(challengeConfigured()?'正在连接本周赛场…':'本机挑战已就绪，平台周榜配置完成后开放。')+'</p>'+challengeRulesHtml()+'<button class="primary" data-action="weeklyStart" '+(challengeConfigured()?'disabled':'')+'>开始本机挑战</button></section>');
 if(!challengeConfigured())return;
 challengePeriod().then(c=>{if(serial!==challengePrepSerial||!$('weeklyReady'))return;challengeContext=c;$('weeklyReady').textContent=c.label+' · 周榜赛场已就绪';const b=dialog.querySelector('[data-action="weeklyStart"]');b.disabled=false;b.textContent='开始周榜挑战';}).catch(e=>{if(serial!==challengePrepSerial||!$('weeklyReady'))return;$('weeklyReady').textContent=e.message+' 可以先玩本机挑战。';dialog.querySelector('[data-action="weeklyStart"]').disabled=false;});
}
function setupChallenge(saved,loadout){
 engine.rng=Math.random;state.challenge=null;
 if(state.mode!=='time'||state.trial)return;
 const c=loadout?.weeklyContext,now=challengeCalendar();
 state.challenge={rules:challengeRules,day:now.day,week:now.week,period:c?.token||'',fresh:!saved,eligible:!saved&&!!c,
  started:performance.now(),activeMs:0,swaps:0,oldPartner:loadout?.oldPartner??data.partner,reason:saved?'恢复的挑战不参加周榜。':c?'':'本局未连接周榜。'};
 engine.serial=0;engine.pool=[0,1,2,3,4,6];engine.rng=challengeRng(challengeRules+':'+(c?.token||now.week));
 data.partner=0;state.hammers=1;state.shuffles=1;state.energy=0;
}
 function challengeInterrupt(reason){if(state.active&&state.challenge?.eligible){state.challenge.eligible=false;state.challenge.reason=reason+'本局仍可完成并领取本机奖励。';toast('周榜资格已取消：'+reason+'本局仍可领取本机奖励');challengeEligibilityStatus();}}
 function challengeEligibilityStatus(){
  const head=$('levelTitle')?.parentElement;if(!head)return;
  let badge=$('weeklyEligibility');if(!badge){badge=document.createElement('div');badge.id='weeklyEligibility';badge.className='weekly-eligibility';head.append(badge);}
  badge.hidden=!state.active||state.mode!=='time';
  if(!badge.hidden){badge.classList.toggle('lost',!state.challenge?.eligible);badge.textContent=state.challenge?.eligible?'周榜资格有效 · 请连续完成90秒':'本局不计周榜 · '+(state.challenge?.reason||'可领取本机奖励');}
 }
function finishChallenge(){
 const c=state.challenge,now=challengeCalendar(),l=challengeLedger();let coins=0,notes=[];
 const valid=!!c?.fresh&&c.rules===challengeRules&&state.remaining<=0&&c.activeMs>=89500&&c.swaps>=3&&state.score>=1000&&Number.isSafeInteger(state.score)&&state.score<=999999&&data.partner===0;
 if(valid&&c.day===now.day&&l.day<=now.day){if(l.day!==now.day){l.day=now.day;l.daily=false;}if(!l.daily){coins+=60;l.daily=true;notes.push('每日首场 +60金币');}}
 if(valid&&c.week===now.week&&l.week<=now.week){if(l.week!==now.week){l.week=now.week;l.tiers=[];l.best=0;}l.best=Math.max(l.best,state.score);for(const [score,reward] of [[6000,100],[10000,150]])if(state.score>=score&&!l.tiers.includes(score)){l.tiers.push(score);coins+=reward;notes.push(score+'分目标 +'+reward+'金币');}}
 data.economy.coins=Math.min(10000000,data.economy.coins+coins);
 const eligible=valid&&c.eligible&&performance.now()-c.started>=89500;
  if(eligible){
   const pending=normalizeWeeklyPending(data.weeklyPending);
   if(!pending||weeklyPendingExpired(pending)||pending.period!==c.period||state.score>pending.score)
    data.weeklyPending={rules:challengeRules,period:c.period,score:state.score,finishedAt:Date.now()};
  }
 return {reward:{coins,diamonds:0},challenge:{eligible,period:c?.period||'',score:state.score,finishedAt:performance.now(),submitted:false,
  rewardNote:notes.join('；')||(valid?'今日首场和已达成的周目标已领取；继续挑战可提高纪录。':'需新开一局，完成90秒、至少3次有效交换并达到1000分。'),
  rankNote:eligible?'点击提交，以 TapTap 账号参加公开周榜。':c?.reason||'本局未满足周榜条件。'}};
}
async function submitChallenge(){
 const result=normalizeWeeklyPending(data.weeklyPending);if(!result||challengeSubmitBusy)return;
 challengeSubmitBusy=true;const status=t=>{if($('weeklySubmitStatus'))$('weeklySubmitStatus').textContent=t;};status('正在核对周赛周期并提交…');
 try{
  const current=await challengePeriod();if(current.token!==result.period)throw Error('本周比赛已经结束，请开始新一周挑战。');
  const end=Number(current.token.split('-')[1])*1000;if(end-Date.now()<30000)throw Error('本周即将结算，本局暂不上传。');
  const r=await challengeCall('submitScores',{scores:[{leaderboardId:StarCandyRelease.weeklyLeaderboard.id,score:result.score}]});
  const item=r?.results?.find(x=>x.leaderboardId===StarCandyRelease.weeklyLeaderboard.id);
  if(!item?.scoreResult||item.periodToken!==result.period)throw Error('平台未返回当前周期的成绩确认，请打开周榜核对。');
   if(data.weeklyPending?.period===result.period&&data.weeklyPending.score===result.score){data.weeklyPending=null;persist();}
   if(lastResult?.challenge?.period===result.period&&lastResult.challenge.score===result.score)lastResult.challenge.submitted=true;
   status(item.scoreResult.newBest?'成绩已提交，刷新了本周最佳！':'成绩已提交，周榜保留你的更高纪录。');
   document.querySelectorAll('[data-action="weeklySubmit"]').forEach(b=>{b.disabled=true;b.textContent='已提交成绩';});
  }catch(e){status(e.message+' 成绩已保留，可稍后重试。');}finally{challengeSubmitBusy=false;}
}
function handleChallengeAction(b){
 switch(b.dataset.action){
 case 'weeklyStart':{
  if(challengeContext&&performance.now()-challengeContext.receivedAt>60000){showChallengePreparation();return true;}
  const context=challengeContext,oldPartner=state.challenge?.oldPartner??data.partner;challengePrepSerial++;preparation=null;start('time',0,null,{hammer:true,shuffle:true,weeklyContext:context,oldPartner});setPartner(0);return true;
 }
 case 'weeklySubmit':submitChallenge();return true;
  case 'weeklyDismiss':if(weeklyPendingExpired(data.weeklyPending)){data.weeklyPending=null;persist();showScreen('challenge');}return true;
 case 'weeklyBoard':challengeCall('openLeaderboard',{leaderboardId:StarCandyRelease.weeklyLeaderboard?.id,collection:'public'}).catch(e=>toast(e.message));return true;
 }
 return false;
}

// Local water surfaces only: directions follow the illustrated channels.
function startWorldWater(ch){
 cancelAnimationFrame(waterFrame);waterFrame=0;
 const canvas=$('worldWater');if(!canvas||route!=='map'||document.hidden||!data.motion||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 let last=0;
 const falls=ch===0?[
  {x:.895,y:.455,w:.022,h:.025},{x:.912,y:.494,w:.057,h:.033},
  {x:.833,y:.568,w:.071,h:.092},{x:.439,y:.727,w:.063,h:.077}
 ]:ch===1?[
  {x:.377,y:.315,w:.023,h:.034},{x:.325,y:.354,w:.035,h:.034},
  {x:.567,y:.531,w:.036,h:.045},{x:.245,y:.697,w:.080,h:.040},
  {x:.252,y:.824,w:.065,h:.041},{x:.431,y:.828,w:.038,h:.040}
 ]:[];
 const streams=ch===0?[[[.92,.53],[.89,.55],[.83,.56]],[[.39,.711],[.42,.721],[.44,.725]]]:ch===1?[[[.27,.738],[.35,.762],[.48,.784]],[[.4,.889],[.56,.91],[.75,.94]]]:[[[.49,.71],[.60,.72],[.54,.77]],[[.36,.80],[.45,.81],[.57,.82]],[[.5,.88],[.64,.90],[.69,.94]],[[.36,.47],[.41,.49],[.43,.51]]];
 function paint(now){
  if(!canvas.isConnected||route!=='map'||document.hidden||!data.motion)return;
  waterFrame=requestAnimationFrame(paint);if(now-last<32)return;last=now;
  const rect=canvas.getBoundingClientRect(),scale=Math.min(1.5,window.devicePixelRatio||1),cw=Math.round(rect.width*scale),cht=Math.round(rect.height*scale);
  if(cw<1||cht<1)return;if(canvas.width!==cw||canvas.height!==cht){canvas.width=cw;canvas.height=cht;}
  const w=canvas.width,h=canvas.height,t=now/1000;ctx.clearRect(0,0,w,h);
  for(const f of falls){
   const x=f.x*w,y=f.y*h,fw=f.w*w,fh=f.h*h;
   ctx.save();ctx.beginPath();ctx.moveTo(x-fw*.5,y);ctx.lineTo(x+fw*.45,y);ctx.lineTo(x+fw*.60,y+fh);ctx.lineTo(x-fw*.60,y+fh);ctx.closePath();ctx.clip();
   const glow=ctx.createLinearGradient(0,y,0,y+fh);glow.addColorStop(0,'#b3edff05');glow.addColorStop(.2,'#74cfff77');glow.addColorStop(.8,'#d5faff55');glow.addColorStop(1,'#ecffff00');ctx.fillStyle=glow;ctx.fillRect(x-fw,y,fw*2,fh);
   for(let n=0;n<14;n++){const phase=(t*(.75+n%3*.12)+n*.187)%1,px=x+(n/13-.5)*fw*.86,py=y+phase*fh;ctx.strokeStyle=n%3===0?'#fffaf0ed':'#c8f3ffb0';ctx.lineWidth=Math.max(.6,fw*.032);ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px+Math.sin(t*2+n)*fw*.035,py+fh*.08,px+fw*.025,py+fh*.18);ctx.stroke();}
   ctx.restore();
   for(let n=0;n<5;n++){const p=(t*.5+n*.2)%1;ctx.strokeStyle='rgba(222,250,255,'+((1-p)*.55)+')';ctx.lineWidth=Math.max(.7,w*.002);ctx.beginPath();ctx.ellipse(x,y+fh+2,fw*(.3+p*.7),Math.max(1,fw*.14*p),0,0,Math.PI*2);ctx.stroke();}
   for(let n=0;n<7;n++){const p=(t*.9+n*.17)%1;ctx.fillStyle='rgba(242,255,255,'+((1-p)*.7)+')';ctx.beginPath();ctx.arc(x+Math.sin(n*4.7)*fw*p,y+fh-Math.sin(p*Math.PI)*fw*.48,Math.max(.5,w*.0015),0,7);ctx.fill();}
  }
  for(const points of streams){
   ctx.save();ctx.lineCap='round';ctx.strokeStyle='#b8efff88';ctx.lineWidth=Math.max(1,w*.003);ctx.setLineDash([w*.008,w*.025]);ctx.lineDashOffset=-t*w*.045;
   for(let n=0;n<3;n++){ctx.beginPath();ctx.moveTo(points[0][0]*w,points[0][1]*h+n*2);ctx.quadraticCurveTo(points[1][0]*w,points[1][1]*h+n*2,points[2][0]*w,points[2][1]*h+n*2);ctx.stroke();}ctx.restore();
  }
  if(ch===1){for(let n=0;n<12;n++){const x=(.12+((n*37)%76)/100)*w,y=(.37+((n*19)%43)/100)*h+Math.sin(t*.7+n)*4;ctx.fillStyle='rgba(255,236,139,'+(.15+.35*(Math.sin(t*1.4+n)+1)/2)+')';ctx.beginPath();ctx.arc(x,y,Math.max(.7,w*.002),0,7);ctx.fill();}}
 }
 waterFrame=requestAnimationFrame(paint);
}

// Approved art, with live controls and saved progress layered above clean scenes.
let artPartnerView=null;
const artSymbols=['☾','♧','♨','❧','◇'];
function artHeader(title,extra=''){
 return '<header class="art-header"><button data-action="home" aria-label="返回大厅">‹</button><h1 class="screen-title" tabindex="-1">'+title+'</h1>'+extra+'</header>';
}
function artPicks(){return '<div class="art-picks" aria-label="浏览伙伴">'+partners.map((p,i)=>'<button data-action="viewArtPartner" data-partner="'+i+'" aria-pressed="'+(artPartnerView===i)+'" aria-label="查看'+p.name+'">'+portrait(i)+'<span>'+p.name+'</span>'+(i===4?'<small>特别伙伴</small>':'')+'</button>').join('')+'</div>';}
function renderArtFlow(next,screen){
 const stars=data.stars.reduce((a,b)=>a+b,0);
 if(next==='home'){
  const pending=state.active?state:data.snapshot,earned=data.stars.slice(0,3).filter(Boolean).length;
  screen.innerHTML='<section class="art-page art-lobby"><div class="art-backdrop"></div><header class="art-lobby-head"><h1 class="screen-title" tabindex="-1">星糖物语<small>与你一起，点亮小小心愿</small></h1><span class="art-pill">✦ '+stars+'</span></header><button class="art-preferences" data-action="preferences" aria-label="音乐与设置">⚙</button><div class="art-chapter-tag">'+chapterNames()[Math.floor((data.unlocked-1)/4)]+'</div><button class="art-event" data-action="challenge"><span>◷</span>限时挑战</button><div class="art-lobby-copy"><small>月见</small><p>回来啦，今天也一起出发吧。</p></div><div class="art-dock"><p class="art-next">'+(['下一份心愿 · 星光夜灯','下一份心愿 · 花语八音盒','下一份心愿 · 伙伴合照','小屋心愿已集齐 · 继续旅途'][earned])+'</p><button class="primary art-gold" data-action="'+(pending?'resume':'journey')+'">'+(pending?(pending.mode==='time'?'继续限时挑战':'继续第 '+(pending.level+1)+' 关'):'开始第 '+data.unlocked+' 关')+' <span>▸</span></button><button class="art-link" data-action="map">查看星愿旅途 ›</button></div></section>';return true;
 }
 if(next==='partners'){
  if(artPartnerView===null)artPartnerView=data.partner;
  const i=artPartnerView,p=partners[i];
  screen.innerHTML='<section class="art-page art-partners art-character-'+i+'"><div class="art-partner-scene"></div>'+artHeader('同行伙伴')+'<div class="art-name"><span>'+artSymbols[i]+'</span><h2>'+p.name+'</h2><small>'+skillNames[i]+'</small></div><div class="art-dock partner-dock"><section class="art-skill"><div class="art-skill-symbol">'+artSymbols[i]+'</div><div><h3>主动技能 · '+skillNames[i]+'</h3><p>'+skillCopies[i]+'</p><small>'+(i===4?'50':'40')+' 能量 · 每步一次</small><button class="art-link" data-action="artSkill">查看技能说明 ›</button></div></section>'+artPicks()+'<button class="partner-practice" data-action="practicePartner" data-partner="'+i+'">免费练习 · 体验'+p.name+'的技能</button><button class="primary art-gold" data-action="'+(!partnerOwned(i)?'partnerOffer':'choosePartner')+'" data-partner="'+i+'">'+(!partnerOwned(i)?partnerPrice(i)+' · 解锁同行':i===data.partner?'正在同行 · '+p.name:'邀请同行')+'</button>'+('<small class="art-unavailable">'+(partnerOwned(i)?'已拥有':i===4?'金币永久解锁 · 可免费试用':'金币可通过签到与闯关获得')+'</small>')+'</div></section>';return true;
 }
 if(next==='map'){
  if(chapterView===null)chapterView=Math.floor((data.unlocked-1)/4);
  const ch=chapterView,done=data.stars.slice(ch*4,ch*4+4).filter(Boolean).length,target=Math.min(ch*4+3,data.unlocked-1),locked=ch*4>=data.unlocked;
  screen.innerHTML='<section class="art-page art-journey"><div class="art-map-stage chapter-tone-'+ch+'"><div class="art-backdrop"></div>'+[[58,50,8,10],[37,71,7,9],[84,42,7,7],[62,62,7,6]].map((a,i)=>'<i aria-hidden="true" class="art-water water-'+i+'" style="left:'+a[0]+'%;top:'+a[1]+'%;width:'+a[2]+'%;height:'+a[3]+'%"><b></b><em></em></i>').join('')+'</div>'+artHeader('星愿旅途','<span class="art-pill">✦ '+stars+'/36</span>')+'<div class="art-chapters"><button data-action="chapter" data-step="-1" '+(ch===0?'disabled':'')+' aria-label="上一章">‹</button><div><h2>'+chapterNames()[ch]+'</h2><small>'+done+' / 4 站</small></div><button data-action="chapter" data-step="1" '+(ch===2?'disabled':'')+' aria-label="下一章">›</button></div><div class="art-stops">'+levels.slice(ch*4,ch*4+4).map((l,j)=>{const n=ch*4+j,closed=n>=data.unlocked,current=n===data.unlocked-1;return '<div class="art-stop '+(current?'is-current':'')+'" style="left:'+([22,34,62,83][j])+'%;top:'+([74,57,40,24][j])+'%"><button data-action="level" data-level="'+n+'" '+(closed?'disabled':'')+' aria-label="第'+(n+1)+'关 '+l.title+(closed?' 尚未解锁':'')+'">'+(closed?'♙':n+1)+'</button><small>'+(closed?'待解锁':data.stars[n]?'★'.repeat(data.stars[n])+'☆'.repeat(3-data.stars[n]):'当前关卡')+'</small><strong>'+l.title+'</strong></div>';}).join('')+'</div><div class="art-dock map-dock"><p class="art-next">'+(locked?'完成前一章，开启新的旅途':'第 '+(target+1)+' 关 · '+levels[target].title)+'</p><button class="primary art-gold" data-action="level" data-level="'+target+'" '+(locked?'disabled':'')+'>'+(locked?'尚未开启':'开始挑战 ▸')+'</button></div></section>';return true;
 }
 if(next==='records'){
  const earned=roomRewards.map((_,i)=>data.stars[i]>0),count=earned.filter(Boolean).length,first=earned.indexOf(false);
  screen.innerHTML='<section class="art-page art-room"><div class="art-backdrop"></div>'+artHeader('我们的小屋','<span class="art-pill">心愿 '+count+'/3</span>')+'<div class="art-room-objects">'+earned.map((yes,i)=>yes?'<button class="art-object art-object-'+i+'" data-action="artReward" data-reward="'+i+'" aria-label="查看'+roomRewards[i].name+'"><span class="reward-art reward-'+i+'"></span></button>':'').join('')+'</div><div class="art-dock room-dock"><div class="art-gifts">'+roomRewards.map((r,i)=>'<button data-action="artReward" data-reward="'+i+'" class="'+(earned[i]?'earned':'locked')+'"><span class="reward-art reward-'+i+'"></span><b>'+r.name+'</b><small>'+(earned[i]?'✓ 已布置':'第 '+(i+1)+' 关解锁')+'</small></button>').join('')+'</div><p class="art-next">'+(first<0?'心愿已珍藏，新的旅途仍在继续':'下一份心愿 · '+roomRewards[first].name)+'</p><button class="primary art-gold" data-action="journey">前往第 '+data.unlocked+' 关 ▸</button><button class="art-link" data-action="artAlbum">心愿册 · '+stars+' / 36 星章 ›</button></div></section>';return true;
 }
 return false;
}
function handleArtAction(b){
 switch(b.dataset.action){
  case 'viewArtPartner':artPartnerView=Math.max(0,Math.min(4,Number(b.dataset.partner)));showScreen('partners');return true;
  case 'artSkill':{const i=artPartnerView??data.partner;showDialog('<h2 id="dialogTitle">'+partners[i].name+' · '+skillNames[i]+'</h2><p>'+skillCopies[i]+'</p><p>消除星糖积攒 '+(i===4?50:40)+' 能量，点击战斗中的伙伴技能，再选择棋盘上的目标。每步限一次，元素反应仍受每步次数限制。</p><button class="primary" data-action="close">知道了</button>');return true;}
  case 'artReward':{const i=Number(b.dataset.reward),r=roomRewards[i];if(!r)return true;showDialog('<h2 id="dialogTitle">'+r.name+'</h2><span class="reward-art reward-'+i+'" style="display:block;width:150px;margin:auto"></span><p>'+(data.stars[i]?r.copy:'首次完成第 '+(i+1)+' 关后，礼物会自动布置到小屋。')+'</p><button class="primary" data-action="close">'+(data.stars[i]?'好好珍藏':'继续收集')+'</button>');return true;}
  case 'artAlbum':showDialog('<h2 id="dialogTitle">旅途心愿册</h2>'+levels.map((l,i)=>'<div class="record-row"><span>'+String(i+1).padStart(2,'0')+' · '+l.title+'</span><span>'+'★'.repeat(data.stars[i])+'☆'.repeat(3-data.stars[i])+'</span></div>').join('')+'<button class="primary" data-action="close">合上心愿册</button>');return true;
 }
 return false;
}

// The opening is narrative only. It never grants rewards or changes battle state.
let prologueReader=null,prologueEntry={first:false,back:'home'};
function prologueBeforeRoute(next){if(prologueReader){prologueReader.destroy();prologueReader=null;}}
function shouldIntroduce(){return !data.prologueSeen&&!data.stars.some(Boolean)&&!data.snapshot&&!state.active;}
function openPrologue(first=false){
 if(state.trial){toast('结束伙伴练习后，可以在设置里重看序章。');return;}
 const back=['home','map','partners','records','challenge','game','result','splash'].includes(route)?route:'home';
 prologueEntry={first,back:first?'home':back};showScreen('prologue');
}
function finishPrologue(skipped=false){
 StarCandyPlaytest.record('prologue_end',{skipped});data.prologueSeen=true;persist();
 const goToFirst=prologueEntry.first&&!skipped&&!data.stars.some(Boolean)&&!state.active&&!data.snapshot;
 let back=prologueEntry.first?'home':prologueEntry.back;
 if(back==='game'&&!state.active||back==='result'&&!lastResult)back='home';
 // Consume the comic's history entry so Back does not reopen a finished replay.
 showScreen(back,true);try{history.replaceState({starCandyRoute:back},'');}catch(_){}
 if(goToFirst)intro('story',0);
}
function renderPrologue(next,screen){
 if(next!=='prologue')return false;
 const canStart=prologueEntry.first&&!data.stars.some(Boolean)&&!state.active&&!data.snapshot;
 prologueReader=new StarCandyPrologue(screen,{reduced:()=>!data.motion,skipLabel:prologueEntry.first?'跳过':'返回',finishLabel:canStart?'和月见去找第一盏灯':'合上序章 · 返回',onSkip:()=>finishPrologue(true),onFinish:()=>finishPrologue(false)});
 return true;
}
function handlePrologueAction(b){
 if(b.dataset.action==='prologueReplay'){openPrologue(false);return true;}
 if(b.dataset.action==='enterLobby'){if(shouldIntroduce())openPrologue(true);else showScreen('home');return true;}
 return false;
}
function prologueReplayButton(){return '<button class="secondary prologue-replay" data-action="prologueReplay"><span aria-hidden="true">✦</span><span>重看序章<small>一束光的来信 · 四格漫画</small></span><span aria-hidden="true">›</span></button>';}

// Inserted into the existing application closure for the platform candidate only.
let tapCloudItems=[],tapCloudPreview=null,tapCloudView=0;
function tapCloudDate(entry){const stamp=Number(String(entry.name||'').split('_')[3]);return Number.isFinite(stamp)&&stamp>0?new Date(stamp).toLocaleString('zh-CN'):'云端备份';}
function tapCloudSafe(){return !state.active&&!state.trial&&!StarCandySave.blocked&&['saved','ready'].includes(StarCandySave.status);}
function showTapCloudCenter(note=''){
 tapCloudView++;tapCloudPreview=null;
 releasePanel('TapTap 云备份','<p>将普通进度备份到当前 TapTap 账号，换设备后可选择恢复。每次创建独立快照，不覆盖旧云档；不会合并两份金币或奖励。</p>'+(note?'<p id="tapCloudStatus" role="status">'+releaseEsc(note)+'</p>':'')+'<div class="release-status"><b>'+releaseSummary(data)+'</b><p>'+(StarCandyCloud.available()?'已检测到平台接口，实际读写状态以下方操作结果为准。':'当前没有 TapTap 云存档环境。请从 TapTap 测试入口打开；在这里仍可使用本地备份。')+'</p></div><p>上传内容包括关卡、金币、钻石、全部已解锁伙伴（含绯镜）、道具与小屋布置。请用v33或更新版本恢复新版备份。</p><div class="release-actions"><button class="primary" data-action="tapCloudUploadAsk" '+(!StarCandyCloud.available()||!tapCloudSafe()||StarCandyCloud.busy?'disabled':'')+'>备份当前进度</button><button class="secondary" data-action="tapCloudList" '+(!StarCandyCloud.available()||StarCandyCloud.busy?'disabled':'')+'>刷新云端列表</button></div>'+(!tapCloudSafe()?'<p>请先结束当前对局或伙伴练习，并处理本地保存提示，再上传或恢复。</p>':'')+'<div id="tapCloudList"></div><p class="release-muted">第一阶段为手动云备份联调版，不会自动同步；平台存档数量和频率受限。删除旧快照请使用平台存档管理。本机备份功能仍然保留。</p><button class="secondary" data-action="saveCenter">本地存档与备份</button>');
}
async function tapCloudList(){
 showTapCloudCenter('正在读取当前账号的云存档…');const view=tapCloudView;
 try{const result=await StarCandyCloud.list();if(view!==tapCloudView||!$('tapCloudList'))return;tapCloudItems=result.items.slice(0,20);
  if($('tapCloudStatus'))$('tapCloudStatus').textContent=result.pending?'云端列表已更新；上次上传仍需核对。':'云端列表已更新，共 '+result.items.length+' 份备份。';
  $('tapCloudList').innerHTML='<h3>云端快照</h3>'+(result.recovered?'<p>上次上传已在云端找到并完成读回核对。</p>':'')+(result.pending?'<p>上次上传仍在核对中，请稍后刷新。</p>':'')+(tapCloudItems.length?tapCloudItems.map((x,i)=>'<button class="secondary" data-action="tapCloudPreview" data-index="'+i+'">'+releaseEsc(x.summary||'星糖物语云备份')+'<small>'+releaseEsc(tapCloudDate(x))+'</small></button>').join(''):'<p>当前账号还没有本版本创建的云备份。</p>')+(result.items.length>20?'<p>显示最近20份快照。</p>':'');
 }catch(e){if(view===tapCloudView&&$('tapCloudList')){if($('tapCloudStatus'))$('tapCloudStatus').textContent='云端列表读取未完成。';$('tapCloudList').textContent=e.message;}}
}
async function tapCloudUpload(){
 if(!tapCloudSafe()){toast('请先完成对局并处理本地保存提示');return;}
 const payload=portableSave();showTapCloudCenter('正在上传并从云端读回核对，请保持页面打开…');const view=tapCloudView;
 try{await StarCandyCloud.create(payload);if(view===tapCloudView&&$('tapCloudList'))showTapCloudCenter('当前进度已上传，并成功从云端读回核对。你可以在另一台设备刷新云端列表。');}
 catch(e){if(view===tapCloudView&&$('tapCloudList'))showTapCloudCenter(e.message);}
}
async function tapCloudPreviewEntry(index){
 const entry=tapCloudItems[index];if(!entry||!tapCloudSafe())return toast('请先完成对局并处理本地保存提示');
 const expectedRaw=StarCandySave.currentRaw();if(expectedRaw===undefined)return toast('暂不能安全读取本地存档，请先导出备份。');
 showTapCloudCenter('正在下载快照，当前本地进度保持不变…');const view=tapCloudView;
 try{const value=await StarCandyCloud.read(entry);if(view!==tapCloudView||!$('tapCloudList'))return;
  if(!tapCloudSafe()||StarCandySave.currentRaw()!==expectedRaw)throw Error('本地进度已变化，请重新预览云档。');
  const payload=normalizeImported(value.payload,{legacyStripped:value.schema===1});tapCloudPreview={payload,expectedRaw};
  releasePanel('选择恢复这份云备份？','<div class="release-compare"><div><small>当前设备</small><b>'+releaseSummary(data)+'</b></div><div><small>云端备份</small><b>'+releaseSummary(payload)+'</b></div></div><p>备份时间：'+releaseEsc(value.createdAt)+'</p><p>确认后替换普通进度，不叠加奖励。当前本地记录保留为「导入前副本」，未完成的棋盘不恢复。新版恢复包含两种货币与全部伙伴；旧版快照缺失的钻石及装饰保留本机记录。</p><button class="primary" data-action="tapCloudApply">恢复并重新打开游戏</button><button class="secondary" data-action="tapCloudCenter">取消，保留本地进度</button>');
 }catch(e){if(view===tapCloudView&&$('tapCloudList'))showTapCloudCenter(e.message);}
}
function handleTapCloudAction(b){
 switch(b.dataset.action){
 case 'tapCloudCenter':showTapCloudCenter();return true;
 case 'tapCloudList':tapCloudList();return true;
 case 'tapCloudUploadAsk':if(!tapCloudSafe())return true;tapCloudView++;releasePanel('备份到当前 TapTap 账号？','<p>'+releaseSummary(data)+'</p><p>将向 TapTap 上传普通游戏进度，创建一份新的云端快照。原有云档和本地记录都保留，金币、钻石和全部伙伴会一起备份。请确认当前客户端登录的是你要保存到的账号。</p><button class="primary" data-action="tapCloudUpload">确认备份</button><button class="secondary" data-action="tapCloudCenter">取消</button>');return true;
 case 'tapCloudUpload':tapCloudUpload();return true;
 case 'tapCloudPreview':tapCloudPreviewEntry(Number(b.dataset.index));return true;
 case 'tapCloudApply':{
  const preview=tapCloudPreview;if(!preview||!tapCloudSafe())return true;
  if(!StarCandySave.replace(preview.payload,preview.expectedRaw)){tapCloudPreview=null;showTapCloudCenter('本地进度发生变化或保存失败，没有覆盖；请重新预览。');return true;}
  StarCandySave.blocked=true;state.active=false;state.epoch++;tapCloudPreview=null;location.reload();return true;
 }
 }
 return false;
}
function showTapCloudPrivacy(){releasePanel('隐私与试玩说明','<p>星糖物语 · 免费游玩与自愿广告补给</p><p>本版本没有人民币商品。'+(StarCandyRelease.ads?'只有主动点击视频补给才向 TapTap 请求激励视频。完整观看后领取奖励，提前关闭或播放失败不发奖。':'视频接口已准备，后台开通与广告位配置完成前不加载广告、不发放广告奖励。')+'</p><p>进度默认保存在当前浏览器。主动确认云备份时，才向当前 TapTap 账号上传关卡、金币、钻石、伙伴、道具、小屋布置与广告领取记录；主动读取时从平台下载。普通浏览器没有平台环境时仍可导出本地备份。</p><p>领取记录和视频完成后的待保存凭据存放在本机，用于避免重复发奖。恢复备份时保留本机已使用的广告次数；此版本不是服务端统一计次，也不自动合并设备余额。</p><p>挑战奖励领取状态随进度保存，恢复备份会保留本机已领次数。主动连接周赛时读取平台周期；点击提交成绩时，向 TapTap 上传本局分数并以 TapTap 账号公开展示排名。不开启好友关系权限。旧纪录、伙伴练习和恢复的对局不上传。</p><p>试玩记录默认关闭，不自动上传。换账号前请关闭游戏，重新从平台进入并核对云端列表。含广告领取记录的备份请使用v34或更新版本恢复。</p><p>本说明用于当前开发测试；客服邮箱：1416303829@qq.com。正式发布前仍需补齐运营主体及正式隐私政策。广告仍需完成手机真实播放、取消及发奖联调。</p><button class="secondary" data-action="tapCloudCenter">云备份</button><button class="secondary" data-action="saveCenter">本地备份</button>');}

// Settings-only tools for the independent H5 playtest. All data stays on this device.
let releaseImport=null,releaseExportText='',releaseExportName='',releaseRun=null,releaseTrialRun=null,releaseLastTick=performance.now(),releaseIssue='';
const releaseEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const releaseStatusText=()=>({ready:'尚未开始 · 本机保存',saved:'已保存到当前浏览器',unavailable:'保存失败 · 当前进度仅在本次页面中',damaged:'存档无法读取 · 原文件已保护',conflict:'其他窗口已更新进度 · 已停止覆盖',invalid:'本次存档格式异常 · 原记录已保留'}[StarCandySave.status]||'本机保存');
function releaseButtons(){return '<div class="release-settings"><button class="secondary" data-action="tapCloudCenter">TapTap 云备份<small>手动备份与恢复</small></button><button class="secondary" data-action="saveCenter">存档与备份 <small>'+releaseStatusText()+'</small></button><button class="secondary" data-action="supportCenter">联系客服</button><button class="secondary" data-action="playtestCenter">试玩记录与反馈</button><button class="text-button" data-action="releasePrivacy">隐私与试玩说明</button></div>';}
function showSupportCenter(){
 const email=StarCandyRelease.support.email;
 releasePanel('联系客服','<p>遇到卡关、存档或广告问题，可以发邮件告诉我们。</p><p style="overflow-wrap:anywhere;user-select:text"><strong>'+releaseEsc(email)+'</strong></p><button class="primary" data-action="supportCopy">复制客服邮箱</button><p>请附上游戏版本、手机型号、问题截图和出现问题前的操作。不要发送密码、验证码或身份证件。</p><p class="release-muted">当前版本：'+releaseEsc(StarCandyRelease.build)+'</p>');
}
function releaseSummary(p){return '已通关 '+p.stars.filter(Boolean).length+'/'+levels.length+' · '+p.stars.reduce((a,b)=>a+b,0)+' 星章 · '+(p.economy?.coins||0)+' 金币 · '+(p.economy?.diamonds||0)+' 钻石';}
function releasePanel(title,body){showDialog('<section class="release-panel"><header><small>STAR CANDY · PLAYTEST</small><h2 id="dialogTitle">'+title+'</h2></header><div class="release-scroll">'+body+'</div></section>');}
function showSaveCenter(){
 const backups=StarCandySave.backups(),problem=!['saved','ready'].includes(StarCandySave.status);
 releasePanel('把心愿好好保存','<div class="release-status '+(problem?'issue':'')+'"><b>'+releaseStatusText()+'</b><p>'+releaseSummary(data)+'</p><small>'+(StarCandySave.lastSavedAt?'上次保存 '+new Date(StarCandySave.lastSavedAt).toLocaleString('zh-CN'):'尚无保存时间')+'</small></div><p>存档保存在当前浏览器。清理浏览器或更换文件、设备后可能无法读取；请先导出备份。自动备份也在同一浏览器，不能替代下载备份。</p><div class="release-actions"><button class="primary" data-action="backupExport" '+(state.trial?'disabled':'')+'>导出当前试玩进度</button><button class="secondary" data-action="backupImport" '+(state.trial?'disabled':'')+'>导入备份</button></div>'+(state.trial?'<p>请先退出伙伴练习，再导出或导入旅途进度。</p>':'')+(problem?'<button class="secondary" data-action="saveRetry">重新尝试保存</button><button class="secondary" data-action="saveReloadAsk">读取浏览器里的最新存档</button><button class="text-button" data-action="saveRawExport">导出原始记录，保留排查副本</button>':'')+'<p class="release-muted">请只保留一个游戏窗口。支持写入锁的浏览器会限制为单窗口保存；其他浏览器仅能检测已发生的存档变化。</p><h3>恢复自动备份</h3><p>恢复前会展示内容，不合并金币和奖励。</p>'+backups.map(x=>'<button class="secondary" data-action="backupRestore" data-backup="'+x.id+'">'+({'backup1':'最近备份','backup2':'上一份备份','before-import':'导入前副本'}[x.id])+'<small>'+releaseSummary(x.payload)+'<br>'+(x.payload._local?.savedAt?new Date(x.payload._local.savedAt).toLocaleString('zh-CN'):'旧版存档')+'</small></button>').join('')+(!backups.length?'<p class="release-muted">暂时没有自动备份。正常保存会保留最近两个备份版本。</p>':'')+'<p class="release-muted">新版备份包含金币、钻石、全部已解锁伙伴、道具和小屋布置，恢复整份进度，不相加。旧版备份不含钻石及装饰，这些项目沿用当前设备记录。</p>');
}
function portableSave(){
 const p=JSON.parse(JSON.stringify({...data,partner:trialBackup?trialBackup.partner:state.challenge?.oldPartner??data.partner}));
 delete p._local;p.monthCard=normalizeMonthCard();return p;
}
function showExport(text,name,title='备份已准备好'){
 releaseExportText=text;releaseExportName=name;
 releasePanel(title,'<p>可以保存文件，或复制下面的文字。下载是否完成以手机浏览器的提示为准。</p><div class="release-actions"><button class="primary" data-action="releaseDownload">保存文件</button><button class="secondary" data-action="releaseCopy">复制全部</button></div><textarea id="releaseExport" readonly aria-label="可复制的导出内容" spellcheck="false"></textarea><p class="release-muted">自行保管备份。反馈报告与存档备份是不同文件；向别人反馈问题时优先发送不含完整存档的试玩报告。</p>');
 $('releaseExport').value=text;
}
function exportBackup(){
 if(state.trial){toast('先退出伙伴练习再备份');return;}
 snapshot();const file={format:'star-candy-playtest-backup',schema:2,build:StarCandyRelease.build,createdAt:new Date().toISOString(),scope:'free-economy-progress',payload:portableSave()};
 StarCandyPlaytest.record('backup_export');showExport(JSON.stringify(file,null,2),'star-candy-backup-'+localDay()+'.json');
}
function showImport(){
 if(state.trial){toast('先退出伙伴练习再导入');return;}
 releaseImport=null;releasePanel('导入试玩备份','<p>选择本游戏导出的 JSON 文件，或粘贴备份内容。下一步先预览，不会立即覆盖当前进度。</p><label class="release-file">选择备份文件<input id="backupFile" type="file" accept="application/json,.json"></label><textarea id="backupText" aria-label="粘贴备份内容" placeholder="粘贴备份 JSON" maxlength="262144" spellcheck="false"></textarea><button class="primary" data-action="backupPreview">查看备份内容</button><p id="backupError" role="status"></p>');
 $('backupFile').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>262144){$('backupError').textContent='文件超过256 KB，不能作为本游戏存档导入。';return;}try{const text=await file.text();if($('backupText'))$('backupText').value=text;}catch(_){if($('backupError'))$('backupError').textContent='文件读取失败，请尝试粘贴备份文字。';}});
}
function normalizeImported(raw,{legacyStripped=false}={}){
 if(!StarCandySaveStore.parse(JSON.stringify(raw)))throw Error('这不是受支持的星糖物语存档，当前记录没有改动。');
 const current=data,old=raw.stars.length===12;
 const p={...defaults,stars:(old?raw.stars.flatMap(n=>[n,n,n]):[...raw.stars]).concat(Array(levels.length).fill(0)).slice(0,levels.length),prologueSeen:true,partner:0,snapshot:null};
 p.unlocked=1;for(let i=0;i<p.stars.length;i++){if(!p.stars[i])break;p.unlocked=Math.min(levels.length,i+2);}
 for(const k of ['music','sound','motion','vibration','prologueSeen'])if(typeof raw[k]==='boolean')p[k]=raw[k];
 p.bestTime=Number.isSafeInteger(raw.bestTime)&&raw.bestTime>=0?Math.min(1e9,raw.bestTime):0;
 try{
  // Normalizers read ownership from data.stars; restore the live reference even on failure.
  data=p;p.economy=normalizeEconomy(raw.economy);
  // Restoring older progress must not reset already used local ad quotas.
  p.economy.challenge=mergeChallenge(p.economy.challenge,current.economy.challenge);
  p.economy.adSupply=mergeAdLedger(p.economy.adSupply,current.economy.adSupply);
  p.economy.mirrorAdViews=Math.min(2,Math.max(p.economy.mirrorAdViews||0,current.economy.mirrorAdViews||0,p.economy.adSupply.receipts.filter(r=>r.offer==='mirror').length));
  if(p.economy.mirrorAdViews===2&&!p.economy.ownedPartners.includes(4))p.economy.ownedPartners.push(4);
  // Pre-v33 backups stripped premium fields; don't erase current free assets with those placeholders.
  if(legacyStripped&&raw.economy?.version!==3){
   const completed=Array.from({length:levels.length/3},(_,g)=>g).filter(g=>p.stars.slice(g*3,g*3+3).every(Boolean));
   const claims=new Set(current.economy.milestoneClaims||[]);
   p.economy.diamonds=current.economy.diamonds+completed.filter(g=>!claims.has(g)).length*5;
   p.economy.milestoneClaims=[...new Set([...claims,...completed])];
   p.economy.milestoneRate=5;
   p.economy.decor=[...current.economy.decor];p.economy.activeDecor=[...current.economy.activeDecor];
   if(current.economy.ownedPartners.includes(4)&&!p.economy.ownedPartners.includes(4))p.economy.ownedPartners.push(4);
  }
  p.monthCard=normalizeMonthCard();p.stamina=normalizeStamina(raw.stamina);
  p.partner=[0,1,2,3,4].includes(raw.partner)&&p.economy.ownedPartners.includes(raw.partner)?raw.partner:0;
  p.home=normalizeHome(raw.home);
  const pending=[normalizeWeeklyPending(raw.weeklyPending),normalizeWeeklyPending(current.weeklyPending)].filter(Boolean);
  p.weeklyPending=pending.sort((a,b)=>Number(b.period.split('-')[1])-Number(a.period.split('-')[1])||b.score-a.score)[0]||null;
 }finally{data=current;}
 return p;
}
function previewImport(text,from='file'){
 try{
  if(text.length>262144)throw Error('文件超过256 KB。');let obj=JSON.parse(text),raw=obj;
  if(obj?.format){if(obj.format!=='star-candy-playtest-backup'||![1,2].includes(obj.schema))throw Error('备份版本不受支持，请使用对应版本打开。');raw=obj.payload;}
  const p=normalizeImported(raw,{legacyStripped:obj?.format==='star-candy-playtest-backup'&&obj.schema===1}),expected=StarCandySave.currentRaw();if(expected===undefined)throw Error('当前浏览器无法读取存储，暂不能安全替换存档。请先导出当前进度。');
  releaseImport={payload:p,expectedRaw:expected};
  releasePanel('确认恢复这份进度','<div class="release-compare"><div><small>现在</small><b>'+releaseSummary(data)+'</b></div><div><small>恢复后</small><b>'+releaseSummary(p)+'</b></div></div><p>将替换关卡、金币、钻石、伙伴、道具和小屋布置，不会叠加两份奖励。未完成的棋盘不导入；恢复后从关卡准备继续，开始新局按正常规则消耗体力。</p><p>旧版备份未携带的钻石及装饰保留本机记录。当前磁盘记录会保留为「导入前副本」。</p><button class="primary" data-action="backupApply">确认替换并重新打开游戏</button><button class="secondary" data-action="saveCenter">取消，保留现在的进度</button>');
 }catch(e){toast(e instanceof SyntaxError?'备份内容不是有效 JSON，原存档没有改动。':e.message);if($('backupError'))$('backupError').textContent=e instanceof SyntaxError?'JSON 格式错误，原存档没有改动。':e.message;}
}
function showPlaytestCenter(){
 const report=StarCandyPlaytest.report(),count=name=>report.events.filter(e=>e.name===name&&!e.props.trial).length;
 releasePanel('试玩记录与反馈','<div class="release-status"><b>只在本机记录 · 不自动上传</b><p>帮助回看在哪一关卡住、是否使用技能、有没有点亮夜灯。你可以自由选择，关闭不影响游戏。</p><button class="secondary" data-action="playtestToggle">'+(StarCandyPlaytest.enabled?'关闭并清除记录':'开启本机试玩记录')+'</button></div><p>开启后记录关卡开始/结果、页面去向、技能与摆放、错误类别；不记录姓名、账号、完整棋盘、地址或错误原文。最多保留7天、300条。</p><div class="release-stats"><span>开始新局<b>'+count('level_start')+'</b></span><span>完成结算<b>'+count('level_end')+'</b></span><span>记录条数<b>'+report.events.length+'</b></span></div><p class="release-muted">只是这台设备的片段，不能当成所有玩家的通关率或留存率。切后台/离开与失败分开记录。'+(!StarCandyPlaytest.storageOK?'浏览器未能保存记录，当前报告可能仅在本次页面有效。':'')+'</p><button class="primary" data-action="playtestExport">查看并导出反馈报告</button><button class="secondary" data-action="playtestClear">清空本机记录</button><details><summary>最近的记录</summary><ol class="release-events">'+report.events.slice(-20).reverse().map(e=>'<li>'+new Date(e.at).toLocaleTimeString('zh-CN')+' · '+releaseEsc(e.name)+(e.props.level?' · 第'+e.props.level+'关':'')+'</li>').join('')+'</ol></details><p>客服邮箱：1416303829@qq.com。遇到问题时，可将报告和截图发至客服邮箱，并说明最后做了哪一步。</p>');
}
function showReleasePrivacy(){showTapCloudPrivacy();}

function handleReleaseAction(b){
 if(handleTapCloudAction(b))return true;
 const a=b.dataset.action;
 switch(a){
 case 'supportCenter':showSupportCenter();return true;
 case 'supportCopy':{const email=StarCandyRelease.support.email;if(navigator.clipboard?.writeText)navigator.clipboard.writeText(email).then(()=>toast('客服邮箱已复制')).catch(()=>toast('请长按邮箱地址复制'));else toast('请长按邮箱地址复制');return true;}
 case 'saveCenter':showSaveCenter();return true;
 case 'backupExport':exportBackup();return true;
 case 'backupImport':showImport();return true;
 case 'backupPreview':previewImport($('backupText')?.value||'');return true;
 case 'backupRestore':{if(state.trial){toast('请先退出伙伴练习');return true;}const item=StarCandySave.backups().find(x=>x.id===b.dataset.backup);if(item)previewImport(item.raw,'backup');return true;}
 case 'backupApply':{
  if(!releaseImport||state.trial)return true;const p=releaseImport;
  if(!StarCandySave.replace(p.payload,p.expectedRaw)){releaseImport=null;showSaveCenter();toast('未覆盖存档，请查看保存状态并重新预览备份。');return true;}
  StarCandyPlaytest.record('backup_import');StarCandySave.blocked=true;state.active=false;state.epoch++;releaseImport=null;location.reload();return true;
 }
 case 'saveRetry':if(StarCandySave.retry()&&persist())toast('已重新保存');else toast('暂未保存，请先导出备份或读取最新存档。');showSaveCenter();return true;
 case 'saveReloadAsk':releasePanel('读取最新存档？','<p>重新打开会放弃本页面中尚未保存的变化。建议先导出当前进度，再读取其他窗口已保存的记录。</p><button class="secondary" data-action="backupExport">先导出当前进度</button><button class="primary" data-action="saveReload">重新打开并读取</button>');return true;
 case 'saveReload':state.active=false;state.epoch++;StarCandySave.blocked=true;location.reload();return true;
 case 'saveRawExport':{const raw=StarCandySave.currentRaw();if(raw===undefined||raw===null)toast('没有可读取的原始记录');else showExport(raw,'star-candy-original-record.txt','原始记录副本');return true;}
 case 'releaseDownload':{const url=URL.createObjectURL(new Blob([releaseExportText],{type:'application/json;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download=releaseExportName;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);toast('已请求下载；若手机未保存，请用复制全部。');return true;}
 case 'releaseCopy':{const area=$('releaseExport');if(area){area.focus();area.select();}if(navigator.clipboard?.writeText)navigator.clipboard.writeText(releaseExportText).then(()=>toast('已复制')).catch(()=>toast('请长按文字，选择全选并复制。'));else toast('请长按文字，选择全选并复制。');return true;}
 case 'playtestCenter':showPlaytestCenter();return true;
 case 'playtestToggle':StarCandyPlaytest.toggle();showPlaytestCenter();return true;
 case 'playtestClear':StarCandyPlaytest.clear();showPlaytestCenter();toast('本机试玩记录已清空');return true;
 case 'playtestExport':showExport(JSON.stringify({...StarCandyPlaytest.report(),diagnostics:{saveStatus:StarCandySave.status,viewport:{width:Math.round(innerWidth),height:Math.round(window.visualViewport?.height||innerHeight)},completedLevels:data.stars.filter(Boolean).length,roomItems:data.home.seen.length,lightOn:data.home.lamp===true}},null,2),'star-candy-feedback-'+localDay()+'.json','试玩反馈报告');return true;
 case 'releasePrivacy':showReleasePrivacy();return true;
 }
 return false;
}
function releaseRoundStart(saved){
 if(state.trial)releaseTrialRun=releaseRun;
 else if(releaseRun&&!releaseRun.ended)StarCandyPlaytest.record('level_leave',{...releaseRun.props,reason:'new_round',durationSec:releaseRun.seconds});
 const run=globalThis.crypto?.randomUUID?.()||('run-'+Date.now());releaseRun={props:{run,level:state.level+1,partner:data.partner,mode:state.mode,trial:state.trial===true,resumed:!!saved},seconds:0,ended:false};
 StarCandyPlaytest.record(saved?'level_resume':'level_start',releaseRun.props);
}
function releaseAfterTrial(){releaseRun=releaseTrialRun;releaseTrialRun=null;releaseLastTick=performance.now();}
function releaseRoundEnd(won,stars,firstClear){if(!releaseRun||releaseRun.ended)return;releaseRun.ended=true;StarCandyPlaytest.record('level_end',{...releaseRun.props,won,stars,firstClear,score:state.score,moves:state.moves,durationSec:releaseRun.seconds});}
function releaseRoute(next){
 if(next===route)return;
 if(route==='game'&&state.active&&next!=='result'&&releaseRun)StarCandyPlaytest.record('level_leave',{...releaseRun.props,reason:'navigation',durationSec:releaseRun.seconds});
 StarCandyPlaytest.record('route_view',{route:next});
}
function installReleaseOps(){
 const notice=document.createElement('button');notice.id='saveNotice';notice.dataset.action='saveCenter';notice.hidden=true;document.body.append(notice);
 const update=()=>{storageOK=['ready','saved'].includes(StarCandySave.status);notice.hidden=storageOK;notice.textContent=releaseStatusText()+' · 查看';if(!storageOK&&releaseIssue!==StarCandySave.status){releaseIssue=StarCandySave.status;StarCandyPlaytest.record('save_issue',{code:StarCandySave.status});}};
 window.addEventListener('starcandy-storage-status',update);update();
 StarCandySave.onReady=()=>{if(!StarCandySave.blocked)persist();update();};
 if(StarCandySave.lockMode==='compare-only')notice.title='此浏览器不支持多窗口写入锁，请只保留一个游戏页面。';
 setInterval(()=>{const now=performance.now();if(releaseRun&&!releaseRun.ended&&state.active&&!state.paused&&!document.hidden)releaseRun.seconds+=Math.min(2,(now-releaseLastTick)/1000);releaseLastTick=now;},1000);
 document.addEventListener('visibilitychange',()=>StarCandyPlaytest.record(document.hidden?'session_hidden':'session_return',{route,level:state.active?state.level+1:undefined,trial:state.trial===true}));
}

// Included inside the application closure by build-game.cjs.
function chapterNames(){return ['云端来信','森林奇遇','星海约定','云端重逢','森林夜话','星海归航'];}
function prepareSplash(screen){
 const button=screen.querySelector('.cover-start'),picture=screen.querySelector('.cover-paint'),copy=screen.querySelector('.cover-progress');
 button.dataset.action='enterLobby';
 const ready=()=>{if(!button.isConnected)return;button.disabled=false;button.textContent='开始游戏 ▶';if(copy)copy.textContent='v42 · 72关 · 自由闯关';};
 if(picture.complete)ready();else{button.disabled=true;button.textContent='正在载入画面…';picture.addEventListener('load',ready,{once:true});picture.addEventListener('error',ready,{once:true});}
}
function renderGameFlow(next,screen){
 if(renderChallenge(next,screen))return true;
 if(renderPrologue(next,screen))return true;
 if(renderWorldFlow(next,screen))return true;
 if(renderArtFlow(next,screen))return true;
 if(next==='home'){
  const pending=state.active?state:data.snapshot,earned=data.stars.slice(0,3).filter(Boolean).length;
  screen.innerHTML='<section class="lobby"><div class="lobby-top"><span>✦ '+data.stars.reduce((a,b)=>a+b,0)+' 星章</span><span>'+chapterNames()[Math.floor((data.unlocked-1)/12)]+'</span></div><div class="room-scene lobby-scene"><div class="lobby-glow"></div><div class="lobby-person">'+portrait(data.partner)+'</div><div class="lobby-greeting"><small>今日同行 · '+partners[data.partner].name+'</small><p>'+partners[data.partner].line+'</p></div><button class="lobby-side side-challenge" data-action="challenge"><b>◷</b>限时挑战</button><button class="lobby-side side-room" data-action="records"><b>⌂</b>小屋 '+earned+'/3</button></div><div class="lobby-bottom"><div class="lobby-chapter"><span>星愿旅途</span><strong>第 '+data.unlocked+' 关 · '+levels[data.unlocked-1].title+'</strong><small>'+(['下一份心愿：星光夜灯','下一份心愿：花语八音盒','下一份心愿：伙伴合照','小屋心愿已集齐，继续探索新章节'][earned])+'</small></div><button class="primary lobby-play" data-action="'+(pending?'resume':'journey')+'">'+(pending?(pending.mode==='time'?'继续限时挑战':'继续第 '+(pending.level+1)+' 关'):'开始第 '+data.unlocked+' 关')+' <span>▶</span></button><button class="lobby-map" data-action="map">查看旅途地图 ›</button></div></section>';return true;
 }
 if(next==='map'){
  if(chapterView===null)chapterView=Math.floor((data.unlocked-1)/12);
  const ch=chapterView,earned=data.stars.slice(ch*4,ch*4+4).filter(Boolean).length;
  screen.innerHTML='<section class="journey-page"><div class="chapter-switch"><button data-action="chapter" data-step="-1" '+(ch===0?'disabled':'')+' aria-label="上一章">‹</button><div><small>第 '+(ch+1)+' 章 · '+earned+'/4 站</small><h1 class="screen-title" tabindex="-1">'+chapterNames()[ch]+'</h1></div><button data-action="chapter" data-step="1" '+(ch===2?'disabled':'')+' aria-label="下一章">›</button></div><section class="chapter journey-world chapter-'+ch+'"><div class="trail"><svg viewBox="0 0 300 420" preserveAspectRatio="none" aria-hidden="true"><path d="M75 65C75 120 210 100 210 165S80 205 80 265 205 300 205 365" fill="none" stroke="#ffffff77" stroke-width="18"/><path d="M75 65C75 120 210 100 210 165S80 205 80 265 205 300 205 365" fill="none" stroke="#e8d0a6" stroke-width="2" stroke-dasharray="3 9"/></svg>'+levels.slice(ch*4,ch*4+4).map((l,j)=>{const i=ch*4+j,locked=i>=data.unlocked;return '<div class="level-stop" style="left:'+([25,70,26.7,68.3][j])+'%;top:'+([15.5,39.3,63.1,86.9][j])+'%"><button class="node '+(data.stars[i]?'done':i===data.unlocked-1?'current':'')+'" data-action="level" data-level="'+i+'" '+(locked?'disabled':'')+' aria-label="第'+(i+1)+'关'+(locked?'尚未解锁':'')+'">'+(locked?'锁':i+1)+'</button><strong>'+l.title+'</strong><small>'+(locked?'完成前一关解锁':'★'.repeat(data.stars[i])+'☆'.repeat(3-data.stars[i]))+'</small>'+(i<3?'<span class="node-reward">'+roomRewards[i].glyph+' '+roomRewards[i].name+'</span>':'')+'</div>';}).join('')+'</div></section><div class="chapter-prize"><span>✦</span><div><strong>'+(earned===4?'本章心愿已完成':ch===2?'终点：点亮全部十二站':'终点：开启「'+chapterNames()[ch+1]+'」')+'</strong><small>'+ (earned===4?'重玩关卡，继续收集三星':'完成本章四关，留下新的旅途纪念')+'</small></div></div></section>';return true;
 }
 if(next==='records'){
  screen.innerHTML=pageHead('我们的星光小屋','OUR LITTLE HOME','每一件小礼物，都来自一起完成的关卡。')+roomView()+'<div class="room-summary">✦ 已收集 '+data.stars.reduce((a,b)=>a+b,0)+' / 36 星章</div><details class="wish-album"><summary>打开旅途心愿册</summary>'+levels.map((l,i)=>'<div class="record-row"><span>'+String(i+1).padStart(2,'0')+' · '+l.title+'</span><span class="record-stars">'+'★'.repeat(data.stars[i])+'☆'.repeat(3-data.stars[i])+'</span></div>').join('')+'</details><button class="primary" data-action="journey">继续收集下一份心愿</button>';return true;
 }
 if(next==='result'&&lastResult){
  const r=lastResult,l=levels[state.level],time=state.mode==='time',chapterEnd=!time&&r.won&&(state.level+1)%4===0;
  screen.innerHTML='<section class="mobile-result '+(r.won?'won':'lost')+'"><div class="result-small-art">'+portrait(data.partner)+'</div><div class="result-stars">'+(r.won?'★'.repeat(r.stars)+'☆'.repeat(3-r.stars):'✧')+'</div><h1 class="screen-title" tabindex="-1">'+(time?'挑战完成':r.won?'心愿达成！':'再试一次，就更近一点')+'</h1><p>'+ (chapterEnd?'「'+chapterNames()[Math.floor(state.level/4)]+'」已完成':r.won?partners[data.partner].line:'换个伙伴，或试着先制造一颗特殊星糖。')+'</p><div class="result-tally"><span>本局星光<strong>'+state.score.toLocaleString()+'</strong></span><span>'+(time?'最佳纪录':'剩余步数')+'<strong>'+(time?data.bestTime.toLocaleString():state.moves)+'</strong></span></div>'+(!time&&r.won&&state.level<3?'<div class="reward-reveal"><span class="reward-art reward-'+state.level+'"></span><div><small>'+(r.firstClear?'新的小屋礼物':'已珍藏的心愿')+'</small><h2>'+roomRewards[state.level].name+'</h2><p>'+roomRewards[state.level].copy+'</p><small>已自动放入小屋</small></div></div>':'')+(!r.won&&!time?'<div class="remaining-goal">还差 '+Math.max(0,l.goal-state.score)+' 星光'+(l.color>=0?' / '+Math.max(0,l.count-state.collected[l.color])+' 颗'+names[l.color]:'')+'</div>':'')+(chapterEnd?'<div class="chapter-unlock">'+(state.level<11?'下一章 · '+chapterNames()[Math.floor(state.level/4)+1]+' 已开启':'十二站心愿全部点亮')+'</div>':'')+'<div class="result-actions"><button class="primary" data-action="'+(!time&&r.won&&state.level<11?'next':'retry')+'">'+(!time&&r.won&&state.level<11?'下一关 · '+levels[state.level+1].title:time?'再挑战一次':r.won?'再玩一次':'调整伙伴与道具，再试一次')+'</button>'+(!time&&r.won&&state.level<3?'<button class="secondary" data-action="records">回小屋看看礼物</button>':'')+'<button class="text-button" data-action="map">返回旅途地图</button><button class="text-button" data-action="home">回大厅</button></div></section>';return true;
 }
 return false;
}
function showPreparation(){
 const p=preparation;if(!p)return;if(p.mode==='time'){showChallengePreparation();return;}const l=levels[p.level],time=p.mode==='time',guided=firstLesson(p.level,p.mode);
 const tip=p.level<3?lessons[p.level]:'先留下元素附着，再安排下一步反应。';
 const partnersHtml=guided?'<div class="prep-companion">'+portrait(0)+'<div><b>月见陪你 · '+['第一次三消','制造四连','元素配合'][p.level]+'</b><p>'+['交换两颗亮框星糖，开始第一次三消。','把火糖连成四颗，做出一颗直线糖。','先用共鸣移动水附着，再用火糖触发反应。'][p.level]+'</p></div></div>':'<h3 class="prep-label">同行伙伴</h3><div class="prep-partners">'+partners.map((x,i)=>!partnerOwned(i)?'':'<button data-action="prepPartner" data-partner="'+i+'" aria-pressed="'+(p.partner===i)+'">'+portrait(i)+'<span>'+x.name+'</span></button>').join('')+'</div>';
 const help='<details class="prep-help"><summary>'+(guided?'道具与玩法提示':skillNames[p.partner]+' · 技能与过关提示')+'</summary><p>'+skillCopies[p.partner]+'</p><p>'+(time?'连续消除创造更高纪录。':tip)+'</p>'+(guided?prepInventory(p):'')+'</details>';
 showDialog('<section class="prep-sheet '+(guided?'first-light-prep':'')+'"><header class="prep-header '+(time?'':'place-'+Math.floor(p.level/3))+'"><div><small>'+(time?'限时挑战':'第 '+(p.level+1)+' 关')+'</small><h2 id="dialogTitle">'+(time?'90 秒星光挑战':l.title)+'</h2></div><button class="text-button" data-action="close" aria-label="关闭准备">×</button></header><div class="prep-scroll"><div class="prep-goals"><div><span>✦</span><strong>'+(time?'尽可能多':l.goal)+'</strong><small>星光</small></div>'+(!time&&l.color>=0?'<div>'+icon(l.color)+'<strong>'+l.count+'</strong><small>'+names[l.color]+'</small></div>':'')+'<div><span>'+(time?'◷':'↔')+'</span><strong>'+(time?'90 秒':l.moves+' 步')+'</strong></div></div>'+(time?'':stagePreparation(p.level))+(time?'':chapterPrep(p.level))+partnersHtml+help+(guided?'':prepInventory(p))+((state.active||data.snapshot)?'<p class="prep-warning">新挑战将替换未完成对局。<button class="text-button" data-action="resume">继续原对局</button></p>':'')+'</div><footer class="prep-footer"><button class="primary prep-start" data-action="confirmStart">开始挑战 · 自由闯关 ▶</button></footer></section>');
}
  function handleFlowAction(b){
 if(handleChallengeAction(b))return true;
 if(handleAdAction(b))return true;
 if(handleReleaseAction(b))return true;
 if(handlePrologueAction(b))return true;
 if(handleChapterAction(b))return true;
 if(handleFirstLightAction(b))return true;
 if(handleMonthCardAction(b))return true;
   if(handleStaminaAction(b))return true;
 if(handleEconomyAction(b))return true;
 if(handleWorldAction(b))return true;
 if(handleArtAction(b))return true;
 switch(b.dataset.action){
  case 'enterLobby':showScreen('home');return true;
  case 'chapter':chapterView=Math.max(0,Math.min(chapterNames().length-1,(chapterView??Math.floor((data.unlocked-1)/12))+Number(b.dataset.step)));showScreen('map');return true;
  case 'prepPartner':if(preparation){const n=Number(b.dataset.partner);if(Number.isInteger(n)&&n>=0&&n<partners.length&&partnerOwned(n)){preparation.partner=n;showPreparation();}}return true;
  case 'prepTool':if(preparation&&['hammer','shuffle'].includes(b.dataset.tool)){const key=b.dataset.tool;if(!preparation[key]&&data.economy.inventory[key]<1){toast('背包不足，可先去心愿商店购买');return true;}preparation[key]=!preparation[key];showPreparation();}return true;
  case 'confirmStart':if(preparation){const p={...preparation};if(!consumeLoadout(p))return true;preparation=null;setPartner(p.partner);start(p.mode,p.level,null,p);}return true;
 }
 return false;
}
function fitBattleBoard(){
 if(route!=='game')return;
 const game=$('gamePage').querySelector('.game'),shell=$('boardShell'),style=getComputedStyle(game);
 const children=[...game.children].filter(el=>el!==shell&&getComputedStyle(el).display!=='none');
 const used=children.reduce((sum,el)=>{const s=getComputedStyle(el);return sum+el.getBoundingClientRect().height+parseFloat(s.marginTop||0)+parseFloat(s.marginBottom||0);},0);
 const available=game.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-used-parseFloat(style.rowGap||0)*children.length-2;
 const width=game.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
 shell.style.width=Math.max(140,Math.min(width,available))+'px';
}
function installGameFlow(){
   const fitViewport=()=>{const v=window.visualViewport;document.documentElement.style.setProperty('--game-vh',(v?v.height:window.innerHeight)+'px');document.documentElement.style.setProperty('--game-vtop',(v?v.offsetTop:0)+'px');requestAnimationFrame(fitBattleBoard);};
   fitViewport();window.addEventListener('resize',fitViewport);window.visualViewport?.addEventListener('resize',fitViewport);window.visualViewport?.addEventListener('scroll',fitViewport);
 document.addEventListener('visibilitychange',()=>{document.body.dataset.artHidden=String(document.hidden);});
 const game=$('gamePage').querySelector('.game');
 if(window.ResizeObserver){const observer=new ResizeObserver(()=>requestAnimationFrame(fitBattleBoard));[game,$('coach'),game.querySelector('.hud'),game.querySelector('.skill-box'),game.querySelector('.element-panel')].filter(Boolean).forEach(el=>observer.observe(el));}
 window.addEventListener('resize',()=>requestAnimationFrame(fitBattleBoard));
}

window.StarCandyBoot.stage('准备游戏界面');
extraUI();
installGameFlow();installReleaseOps();
StarCandyMusic.set(data.music);

 $('float1').innerHTML=icon(4);$('float2').innerHTML=icon(2);$('float3').innerHTML=icon(0);
 window.addEventListener('popstate',e=>{const next=e.state?.starCandyRoute;if(['splash','home','map','partners','records','challenge','game','result','prologue'].includes(next)&&!(next==='result'&&!lastResult))showScreen(next,true);else showScreen('home',true);});
 setPartner(data.partner);render(false);hud();showScreen('splash');if(migrated)toast('星章已保留。元素规则升级，上次未完成的棋盘需要重新开始。');window.StarCandyBoot.finish();
routingReady=true;try{history.replaceState({starCandyRoute:'splash'},'');}catch(_){}
})();
 function premiumDialog(){showMirrorOffer();}


