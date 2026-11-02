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
