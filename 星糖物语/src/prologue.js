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
