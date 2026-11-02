const fs=require('fs');function edit(p,fn){fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));}
edit('src/economy-flow.js',s=>{
 s=s.replace('<header class="art-lobby-head">','<div class="lobby-layout"><header class="art-lobby-head">');
 s=s.replace("</h1></header>'+walletView()+staminaView()+'<button", "</h1></header><div class=\"lobby-resources\">'+walletView()+staminaView()+'</div><button");
 s=s.replace('</button></div><button class="lobby-talk"','</button></div></div><button class="lobby-talk"');
 s=s.replace("showDialog('<div class=\"shop-head boutique-head\">", "showDialog('<section class=\"boutique-sheet\"><header class=\"boutique-fixed\"><div class=\"shop-head boutique-head\">");
 s=s.replace("+'</div>'+monthCardBanner()+(shopTab==='topup'?recharge:goods)+'<button class=\"secondary\" data-action=\"shopClose\">'", "+'</div></header><div class=\"boutique-scroll\">'+monthCardBanner()+(shopTab==='topup'?recharge:goods)+'</div><footer class=\"boutique-footer\"><button class=\"secondary\" data-action=\"shopClose\">'");
 s=s.replace("(shopBackToPrep?'返回关卡准备':'收起商店')+'</button>');", "(shopBackToPrep?'返回关卡准备':'收起商店')+'</button></footer></section>');");
 return s;
});
edit('scripts/build-game.cjs',s=>s.replace("fs.readFileSync('src/mobile-fit.css','utf8')", "fs.readFileSync('src/mobile-fit.css','utf8')+'\\n'+fs.readFileSync('src/lobby-layout.css','utf8')"));
edit('scripts/package-mobile.cjs',s=>s.replace('v18 星愿月卡','v19 手机排版'));
