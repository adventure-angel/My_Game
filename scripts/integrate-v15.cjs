const fs=require('fs');
function change(file,from,to){let s=fs.readFileSync(file,'utf8');if(!s.includes(from))throw Error('Missing anchor '+file+' '+from.slice(0,70));fs.writeFileSync(file,s.replace(from,to));}
change('src/economy-flow.js','function lobbyIcon(type){',`function lobbyIcon(type){
 if(['coin','diamond','hammer','shuffle','mail','calendar'].includes(type))return '<span class="lobby-icon prop-art prop-'+type+'" aria-hidden="true"></span>';`);
change('src/economy-flow.js',`return '<article><div class="shop-item-art">'`,`return '<article class="product-'+g.type+'"><div class="shop-item-art">'`);
change('src/economy-flow.js',`showDialog('<div class="shop-head"><small>WISH BOUTIQUE</small>`,`showDialog('<div class="shop-head boutique-head"><div class="boutique-emblem">'+lobbyIcon('hammer')+lobbyIcon('diamond')+lobbyIcon('shuffle')+'</div><small>WISH BOUTIQUE</small>`);
let e=fs.readFileSync('src/economy-flow.js','utf8');
const start=e.indexOf('function showDaily(){'),end=e.indexOf('function roomDecor()',start);
if(start<0||end<0)throw Error('daily anchors');
e=e.slice(0,start)+`function showDaily(){
 const d=data.economy.checkin,can=canCheckin(),next=d.count%7,week=Math.floor(Math.max(0,d.count-(can?0:1))/7),claimed=d.count-week*7;
 showDialog('<div class="shop-head daily-heading">'+lobbyIcon('calendar')+'<small>SEVEN LITTLE WISHES</small><h2 id="dialogTitle">每日一份小心愿</h2><p>在心愿册里，记下每一次相遇</p></div><div class="daily-book"><div class="daily-grid">'+dailyRewards.map((r,i)=>'<div class="daily-day '+(i<claimed?'claimed':can&&i===next?'today':'')+'"><small>第 '+(i+1)+' 天</small><div class="daily-treasures">'+lobbyIcon('coin')+(r.hammer?lobbyIcon('hammer'):'')+(r.shuffle?lobbyIcon('shuffle'):'')+'</div><b>'+dailyCopy(r)+'</b><span>'+(i<claimed?'✓ 已收入心愿册':can&&i===next?'今日可领取':'待开启')+'</span></div>').join('')+'</div></div><p class="daily-caption">漏签不清零 · 累计七次开启下一册</p><button class="primary" data-action="dailyClaim" '+(!can?'disabled':'')+'>'+(can?'收下第 '+(next+1)+' 天的心愿':'今日已收下 · 明天再见')+'</button><p class="economy-note">每日领取一次，进度保存在当前浏览器。奖励为金币与道具。</p><button class="secondary" data-action="economyClose">合上心愿册</button>');
}
`+e.slice(end);fs.writeFileSync('src/economy-flow.js',e);
change('src/appScript.js','dialog.innerHTML=html;veil.hidden=false;',`dialog.innerHTML=html;
    dialog.dataset.skin=dialog.querySelector('.boutique-head')?'boutique':dialog.querySelector('.daily-book')?'daily':dialog.querySelector('.mail-heading,.letter-paper')?'mail':dialog.querySelector('.shop-confirm')?'purchase':'';
    veil.hidden=false;`);
change('src/world-flow.js',`case 'wcMailbox':showDialog('<h2 id="dialogTitle">月光信箱</h2>'`,`case 'wcMailbox':showDialog('<div class="mail-heading">'+lobbyIcon('mail')+'<small>MOONLIGHT POST</small><h2 id="dialogTitle">月光信箱</h2><p>把旅途中的温柔，写成一封信</p></div>'`);
change('src/world-flow.js',`data-letter="'+l.id+'"><span>✉</span>`,`data-letter="'+l.id+'"><span class="letter-envelope" aria-hidden="true">✦</span>`);
change('src/world-flow.js',`showDialog('<div class="letter-paper">`,`showDialog('<div class="mail-letter-top">'+lobbyIcon('mail')+'</div><div class="letter-paper">`);
change('scripts/build-game.cjs',`const artFiles={`,`const artFiles={
 'economy-props':'economy-props-v15.webp',`);
change('scripts/build-game.cjs',`fs.readFileSync('src/economy-flow.css','utf8')`,`fs.readFileSync('src/economy-flow.css','utf8')+'\\n'+fs.readFileSync('src/economy-art.css','utf8')`);
change('scripts/package-mobile.cjs','v14 体力与旅途','v15 心愿珍藏');
change('scripts/package-mobile.cjs','9*1048576','12*1048576');
change('scripts/package-mobile.cjs','exceeds 9 MiB','exceeds 12 MiB');
console.log('v15 source integrated');
