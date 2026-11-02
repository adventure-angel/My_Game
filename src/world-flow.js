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
