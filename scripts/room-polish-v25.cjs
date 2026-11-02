const fs=require('fs');
const p='src/room-growth.js';let s=fs.readFileSync(p,'utf8');
s=s.replace("i===1?'茶桌右侧':'经典布置'","i===1?'舒展布置':'经典布置'").replace("i===1?'茶桌左侧':'轻巧布置'","i===1?'轻巧布置':'轻巧布置'");
fs.writeFileSync(p,s);
// Sprite windows use each illustration's bounds without altering source pixels.
const boxes=[[20,160,430,420],[458,70,362,520],[805,200,440,390],[20,650,400,525],[430,645,407,530],[850,660,385,510]];
const css='\n/* Transparent art atlas: individual, nonuniform sprite bounds. */\n'+boxes.map(([x,y,w,h],i)=>`.rg-soft-${i}{aspect-ratio:${w}/${h};background-size:${1254/w*100}% ${1254/h*100}%;background-position:${x/(1254-w)*100}% ${y/(1254-h)*100}%}`).join('\n')+'\n.rg-soft-1{clip-path:polygon(0 0,100% 0,100% 65%,95% 65%,95% 100%,0 100%)}.rg-soft-2{clip-path:polygon(8% 0,100% 0,100% 100%,0 100%,0 60%,8% 60%)}\n';
let c=fs.readFileSync('src/room-growth.css','utf8');c=c.split('/* Transparent art atlas:')[0];fs.writeFileSync('src/room-growth.css',c+css);
