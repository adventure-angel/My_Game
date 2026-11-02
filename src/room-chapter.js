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
