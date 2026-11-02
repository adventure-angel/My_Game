const fs=require('fs');function edit(p,fn){fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));}
edit('src/economy-flow.js',s=>{
 const settings='<button class="lobby-medallion lobby-settings" data-action="preferences" aria-label="设置">\'+lobbyIcon(\'settings\')+\'<span>设置</span></button>';
 if(!s.includes(settings+'</header>'))throw Error('Expected header settings');
 return s.replace(settings+'</header>','</header>').replace("<div class=\"lobby-topbar\">'+walletView(true)+staminaView()+'</div>","<div class=\"lobby-topbar moonlight-ribbon\">'+walletView(true)+staminaView()+'"+settings+'</div>');
});
edit('src/stamina.js',s=>{const a=s.indexOf('function staminaBottle(){'),b=s.indexOf('function staminaView',a);if(a<0||b<0)throw Error('Missing stamina icon');return s.slice(0,a)+`function staminaBottle(){return '<svg class="stamina-bottle" viewBox="0 0 32 40" aria-hidden="true"><path d="M27 2C13 5 3 16 5 30l5 5C25 29 29 16 27 2Z" fill="#4399c9" stroke="#ddf6ff" stroke-width="1.2"/><path d="M27 2C16 8 8 20 5 30l5 5Z" fill="#b5eaff"/><path d="m27 2-9 23-8 10 11-7 6-13Z" fill="#686ac1"/><path d="m3 39 24-37M9 29l-1-11m5 5 0-11m3 15 7-7m-10 11 7-3" fill="none" stroke="#f3f6dc" stroke-width="1.1" stroke-linecap="round"/><path d="m25 7-9 14" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>';}
`+s.slice(b);});
edit('scripts/build-game.cjs',s=>s.replace("fs.readFileSync('src/header-restored.css','utf8')", "fs.readFileSync('src/header-restored.css','utf8')+fs.readFileSync('src/moonlight-ribbon.css','utf8')"));
edit('scripts/package-mobile.cjs',s=>s.replace('v21 大厅标题与资源栏','v22 月光连栏'));
