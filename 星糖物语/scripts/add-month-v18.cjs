const fs=require('fs');function edit(p,fn){fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));}
edit('scripts/build-game.cjs',s=>s.replace("fs.readFileSync('src/stamina.js','utf8')", "fs.readFileSync('src/month-card.js','utf8')+'\\n'+fs.readFileSync('src/stamina.js','utf8')"));
edit('src/appScript.js',s=>s.replace("if(raw.stamina&&typeof raw.stamina==='object')data.stamina=raw.stamina;", "if(raw.stamina&&typeof raw.stamina==='object')data.stamina=raw.stamina;\n    if(raw.monthCard&&typeof raw.monthCard==='object')data.monthCard=raw.monthCard;"));
edit('src/game-flow.js',s=>s.replace('if(handleStaminaAction(b))return true;', 'if(handleMonthCardAction(b))return true;\n   if(handleStaminaAction(b))return true;'));
edit('src/economy-flow.js',s=>s.replace("+(shopTab==='topup'?recharge:goods)","+monthCardBanner()+(shopTab==='topup'?recharge:goods)").replace('钻石仅通过充值获取，签到、通关和初始礼包均不赠送。','钻石可通过充值或有效月卡每日领取，普通签到、通关和初始礼包均不赠送。').replace('钻石仅充值获得，当前支付尚未接入。','钻石通过充值或付费月卡权益获得，当前支付尚未接入。'));
edit('src/stamina.js',s=>{
 s=s.replace('const staminaRules={max:50,cost:5,interval:5*60*1000};','const staminaRules={get max(){return monthCardActive()?100:50;},cost:5,get interval(){return monthCardActive()?200000:300000;}};');
 s=s.replace("![1,2].includes(raw.version)","![1,2,3].includes(raw.version)").replaceAll('version:2','version:3').replace('Math.min(staminaRules.max,raw.value+', 'Math.min(100,raw.value+');
 s=s.replace('updatedAt:now};','updatedAt:now,recovery:0};');
 s=s.replace('return {version:3,value:Number.isInteger', 'return {version:3,recovery:raw.version===3&&Number.isFinite(raw.recovery)?Math.max(0,Math.min(.999999,raw.recovery)):0,value:Number.isInteger');
 const a=s.indexOf('function syncStamina(){'),b=s.indexOf('function staminaCountdown',a);
 s=s.slice(0,a)+`function syncStamina(){
 const s=data.stamina,now=Date.now(),before=s.value;
 if(now<s.updatedAt){s.updatedAt=now;s.recovery=0;persist();return s;}
 const boundaries=[s.updatedAt,...[data.monthCard.startsAt,data.monthCard.expiresAt].filter(t=>t>s.updatedAt&&t<now),now].sort((a,b)=>a-b);
 for(let i=1;i<boundaries.length;i++){
  const start=boundaries[i-1],end=boundaries[i],active=monthCardActive(start),cap=active?100:50,interval=active?200000:300000;
  if(s.value>=cap){s.recovery=0;continue;}
  const amount=(s.recovery||0)+(end-start)/interval,points=Math.floor(amount);
  s.value=Math.min(cap,s.value+points);s.recovery=s.value>=cap?0:amount-points;
 }
 s.updatedAt=now;if(s.value!==before)persist();return s;
}
`+s.slice(b);
 s=s.replace("s.value===staminaRules.max?'体力已满':staminaCountdown(staminaRules.interval-(Date.now()-s.updatedAt))", "s.value>=staminaRules.max?'体力已满':staminaCountdown(staminaRules.interval*(1-(s.recovery||0)))");
 s=s.replaceAll('(s.value/staminaRules.max*100)','(Math.min(1,s.value/staminaRules.max)*100)');
 s=s.replace('上限 <b>50 点</b>','上限 <b>\'+staminaRules.max+\' 点</b>').replace('每 <b>5 分钟</b>恢复 1 点','每 <b>\'+(monthCardActive()?\'3分20秒\':\'5分钟\')+\'</b>恢复 1 点').replace('连续开始 10 局','连续开始 \'+Math.floor(staminaRules.max/staminaRules.cost)+\' 局');
 s=s.replace("el.setAttribute('aria-valuenow',s.value);", "el.setAttribute('aria-valuenow',s.value);el.setAttribute('aria-valuemax',staminaRules.max);");
 s=s.replace('(staminaRules.cost-s.value)*staminaRules.interval-(Date.now()-s.updatedAt)', '(staminaRules.cost-s.value-(s.recovery||0))*staminaRules.interval');
 return s;
});
edit('scripts/package-mobile.cjs',s=>s.replace('v17 手机自适应','v18 星愿月卡'));
