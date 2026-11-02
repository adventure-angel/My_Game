const fs=require('fs');
let flow=fs.readFileSync('src/game-flow.js','utf8');
const old="showDialog('<div class=\"prep-top\"><small>'+(time?'限时挑战':'第 '+(p.level+1)+' 关')";
const next="showDialog((time?'':'<div class=\"prep-place place-'+p.level+'\" role=\"img\" aria-label=\"'+worldPlaces[p.level]+'场景\"><span>'+worldPlaces[p.level]+'</span></div>')+'<div class=\"prep-top\"><small>'+(time?'限时挑战':'第 '+(p.level+1)+' 关')";
if(flow.includes(old)){flow=flow.replace(old,next);fs.writeFileSync('src/game-flow.js',flow);}
