const fs=require('fs');
let p='src/economy-flow.js',s=fs.readFileSync(p,'utf8');
const heading='<header class="art-lobby-head"><h1 class="screen-title" tabindex="-1">星糖物语<small>和你一起，把心愿带回家</small></h1></header>';
const settings='<button class="lobby-medallion lobby-settings" data-action="preferences" aria-label="设置">\'+lobbyIcon(\'settings\')+\'<span>设置</span></button>';
const old='<div class="lobby-topbar">\'+walletView(true)+staminaView()+\''+settings+'</div>'+heading;
const next=heading.replace('</header>',settings+'</header>')+'<div class="lobby-topbar">\'+walletView(true)+staminaView()+\'</div>';
if(!s.includes(old))throw Error('Expected v20 header not found');fs.writeFileSync(p,s.replace(old,next));
p='src/stamina.js';s=fs.readFileSync(p,'utf8');const a=s.indexOf('function staminaBottle(){'),b=s.indexOf('function staminaView',a);
if(a<0||b<0)throw Error('Missing icon');
s=s.slice(0,a)+`function staminaBottle(){return '<svg class="stamina-bottle" viewBox="0 0 32 38" aria-hidden="true"><path d="m16 1 12 10-3 18-9 8-9-8-3-18Z" fill="#b88e63" stroke="#ffe3aa" stroke-width="1.2"/><path d="m16 4 9 8-3 15-6 7-6-7-3-15Z" fill="#7660a6"/><path d="m16 4 0 30-6-7-3-15Z" fill="#b8a2e9"/><path d="m16 4 9 8-9 5-9-5Z" fill="#e2d4ff"/><path d="m16 17 9-5-3 15-6 7Z" fill="#614582"/><path d="m18 9-8 13h6l-2 9 10-15h-7Z" fill="#fff1ba" stroke="#b99160" stroke-width=".5"/><path d="m9 11 5-5M8 14l2 8" fill="none" stroke="#fff6e8" stroke-width="1.2" stroke-linecap="round"/></svg>';}
`+s.slice(b);
s=s.replace("+s.value+'/'+staminaRules.max+'</b></button>'", "+s.value+'/'+staminaRules.max+'</b><small>体力</small></button>'");fs.writeFileSync(p,s);
p='scripts/package-mobile.cjs';s=fs.readFileSync(p,'utf8').replace('v20 顶部资源栏','v21 大厅标题与资源栏');fs.writeFileSync(p,s);
