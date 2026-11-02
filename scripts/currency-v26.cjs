const fs=require('fs');
let p='scripts/build-game.cjs',s=fs.readFileSync(p,'utf8');
if(!s.includes("'currency-coin':"))s=s.replace("const artFiles={", "const artFiles={\n 'currency-coin':'currency-coin-v26.webp',\n 'currency-diamond':'currency-diamond-b-v26.webp',");
// The lobby had identical bytes embedded twice; the legacy name can share the live image.
s=s.replace(" 'scene-lobby':'world-lobby-v16.webp',\n",'');
s=s.replace("const faceCss='.portrait-art", "const faceCss=':root{--scene-lobby:var(--world-lobby)}.portrait-art");
if(!s.includes("fs.readFileSync('src/currency-v26.css','utf8')"))s=s.replace("fs.readFileSync('src/room-growth.css','utf8')", "fs.readFileSync('src/room-growth.css','utf8')+fs.readFileSync('src/currency-v26.css','utf8')");
fs.writeFileSync(p,s);
p='scripts/package-mobile.cjs';s=fs.readFileSync(p,'utf8').replace('v25 小屋成长','v26 月滴晶石与星纹金币');fs.writeFileSync(p,s);
