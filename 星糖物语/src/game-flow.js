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
