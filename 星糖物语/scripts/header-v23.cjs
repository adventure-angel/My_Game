const fs=require('fs');
const build='scripts/build-game.cjs';
let s=fs.readFileSync(build,'utf8');
if(!s.includes("fs.readFileSync('src/single-row-header.css','utf8')"))s=s.replace("fs.readFileSync('src/moonlight-ribbon.css','utf8')","fs.readFileSync('src/moonlight-ribbon.css','utf8')+fs.readFileSync('src/single-row-header.css','utf8')");
fs.writeFileSync(build,s);
const pack='scripts/package-mobile.cjs';
fs.writeFileSync(pack,fs.readFileSync(pack,'utf8').replace('v22 月光连栏','v23 顶部同排'));
