const fs=require('fs');function edit(p,fn){fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));}
edit('src/economy-flow.js',s=>{
 s=s.replace('function walletView(){', "function walletView(compact=false){const display=n=>compact&&n>=10000?(n/10000).toFixed(1).replace(/\\.0$/,'')+'万':n;");
 s=s.replace("<b>'+data.economy.coins+'</b>","<b>'+display(data.economy.coins)+'</b>").replace("<b>'+data.economy.diamonds+'</b>","<b>'+display(data.economy.diamonds)+'</b>");
 const old='<header class="art-lobby-head"><h1 class="screen-title" tabindex="-1">星糖物语<small>和你一起，把心愿带回家</small></h1></header>';
 if(!s.includes(old))throw Error('Lobby heading missing');
 s=s.replace(old,'').replace("<div class=\"lobby-resources\">'+walletView()+staminaView()+'</div><button", "<div class=\"lobby-topbar\">'+walletView(true)+staminaView()+'<button");
 s=s.replace("<span>设置</span></button><div class=\"lobby-left-rail\">", '<span>设置</span></button></div>'+old+'<div class="lobby-left-rail">');return s;
});
edit('src/stamina.js',s=>{
 s=s.replace('function staminaView(prep=false){',`function staminaBottle(){return '<svg class="stamina-bottle" viewBox="0 0 32 38" aria-hidden="true"><path d="M11 3h10v6l6 8v13c0 4-22 4-22 0V17l6-8Z" fill="#d9c8f1" stroke="#f4d69a" stroke-width="1.4"/><path d="M7 20q9-5 18 0v9q-9 5-18 0Z" fill="#9865cc"/><path d="M10 18v9" stroke="#fff4ec" stroke-width="2" stroke-linecap="round"/><path d="m18 12-7 11h5l-2 8 9-13h-6Z" fill="#fff0ba"/><path d="M10 3h12v5H10Z" fill="#c99560" stroke="#ffe3aa"/></svg>';}
function staminaView(prep=false){`);
 s=s.replace("const s=syncStamina();\n return '<button", "const s=syncStamina();\n if(!prep)return '<button type=\"button\" class=\"stamina-compact\" data-action=\"staminaInfo\" aria-label=\"体力，点击查看恢复时间和规则\">'+staminaBottle()+'<b class=\"stamina-value\">'+s.value+'/'+staminaRules.max+'</b></button>';\n return '<button");
 s=s.replace('<span class="stamina-gem" aria-hidden="true">♥</span>',"'+staminaBottle()+'");return s;
});
edit('scripts/package-mobile.cjs',s=>s.replace('v19 手机排版','v20 顶部资源栏'));
