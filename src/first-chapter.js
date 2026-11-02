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
