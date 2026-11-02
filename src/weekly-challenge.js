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
