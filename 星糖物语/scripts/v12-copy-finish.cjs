const fs=require('fs');
let s=fs.readFileSync('src/economy-flow.js','utf8');
s=s.replace("(pending?'继续未完成对局':'开始第 '+data.unlocked+' 关')","(pending?'继续未完成对局':data.stars.every(Boolean)?'心愿已集齐 · 重访旅途':'开始第 '+data.unlocked+' 关')");
s=s.replace('首次过关 60 金币，每组三关末关 90 金币；重玩获胜 10 金币。签到也能领取。','首次过关 60 金币，每组三关末关 90 金币；重玩获胜 10 金币。签到也能领取。初次进入本版赠送 360 金币、30 钻石及入门道具。');
fs.writeFileSync('src/economy-flow.js',s);
