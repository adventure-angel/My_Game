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
