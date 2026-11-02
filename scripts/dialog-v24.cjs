const fs=require('fs');
const p='scripts/build-game.cjs';let s=fs.readFileSync(p,'utf8');
if(!s.includes("fs.readFileSync('src/dialog-close.css','utf8')"))s=s.replace("fs.readFileSync('src/single-row-header.css','utf8')","fs.readFileSync('src/single-row-header.css','utf8')+fs.readFileSync('src/dialog-close.css','utf8')");
fs.writeFileSync(p,s);
const q='scripts/package-mobile.cjs';fs.writeFileSync(q,fs.readFileSync(q,'utf8').replace('v23 顶部同排','v24 右上角关闭'));
