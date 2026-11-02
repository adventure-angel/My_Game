const fs=require('fs');
function edit(p,fn){fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));}
edit('src/stamina.js',s=>s.replace('max:30','max:50').replace("if(!raw||raw.version!==1)return {version:1", "if(!raw||![1,2].includes(raw.version))return {version:2").replace('return {version:1,value:Number.isInteger(raw.value)?Math.max(0,Math.min(staminaRules.max,raw.value))','return {version:2,value:Number.isInteger(raw.value)?Math.max(0,Math.min(staminaRules.max,raw.value+(raw.version===1?20:0)))').replaceAll("s.value+'/30'","s.value+'/'+staminaRules.max").replaceAll("s.value+'/30</span>","s.value+'/'+staminaRules.max+'</span>").replace('aria-valuemax="30"','aria-valuemax="\'+staminaRules.max+\'"').replaceAll('s.value/30','s.value/staminaRules.max').replace('上限 <b>30 点','上限 <b>50 点').replace('连续开始 6 局','连续开始 10 局'));
edit('src/game-flow.js',s=>{
 const a=s.indexOf('function showPreparation(){'),b=s.indexOf('function handleFlowAction',a);
 if(a<0||b<0)throw Error('Missing preparation');
 s=s.slice(0,a)+`function showPreparation(){
 const p=preparation;if(!p)return;const l=levels[p.level],time=p.mode==='time';
 const tip=p.level<3?lessons[p.level]:'先留下元素附着，再安排下一步反应。';
 showDialog('<section class="prep-sheet"><header class="prep-header '+(time?'':'place-'+Math.floor(p.level/3))+'"><div><small>'+(time?'限时挑战':'第 '+(p.level+1)+' 关')+'</small><h2 id="dialogTitle">'+(time?'90 秒星光挑战':l.title)+'</h2></div><button class="text-button" data-action="close" aria-label="关闭准备">×</button></header><div class="prep-scroll"><div class="prep-goals"><div><span>✦</span><strong>'+(time?'尽可能多':l.goal)+'</strong><small>星光</small></div>'+(!time&&l.color>=0?'<div>'+icon(l.color)+'<strong>'+l.count+'</strong><small>'+names[l.color]+'</small></div>':'')+'<div><span>'+(time?'◷':'↔')+'</span><strong>'+(time?'90 秒':l.moves+' 步')+'</strong></div></div>'+(time?'':stagePreparation(p.level))+'<h3 class="prep-label">同行伙伴</h3><div class="prep-partners">'+partners.map((x,i)=>!partnerOwned(i)?'':'<button data-action="prepPartner" data-partner="'+i+'" aria-pressed="'+(p.partner===i)+'">'+portrait(i)+'<span>'+x.name+'</span></button>').join('')+'</div><details class="prep-help"><summary>'+skillNames[p.partner]+' · 技能与过关提示</summary><p>'+skillCopies[p.partner]+'</p><p>'+(time?'连续消除创造更高纪录。':tip)+'</p></details>'+prepInventory(p)+((state.active||data.snapshot)?'<p class="prep-warning">新挑战将替换未完成对局。<button class="text-button" data-action="resume">继续原对局</button></p>':'')+'</div><footer class="prep-footer">'+staminaView(true)+'<button class="primary prep-start" data-action="confirmStart">开始挑战 · 消耗 '+staminaRules.cost+' 体力 ▶</button></footer></section>');
}
  `+s.slice(b);
 return s.replace('function installGameFlow(){',`function installGameFlow(){
   const fitViewport=()=>{const v=window.visualViewport;document.documentElement.style.setProperty('--game-vh',(v?v.height:window.innerHeight)+'px');document.documentElement.style.setProperty('--game-vtop',(v?v.offsetTop:0)+'px');requestAnimationFrame(fitBattleBoard);};
   fitViewport();window.addEventListener('resize',fitViewport);window.visualViewport?.addEventListener('resize',fitViewport);window.visualViewport?.addEventListener('scroll',fitViewport);`);
});
edit('src/appScript.js',s=>s.replace("dialog.dataset.skin=dialog.querySelector('.boutique-head')?", "dialog.dataset.skin=dialog.querySelector('.prep-sheet')?'preparation':dialog.querySelector('.boutique-head')?"));
edit('scripts/build-game.cjs',s=>s.replace("fs.readFileSync('src/moon-identity.css','utf8')", "fs.readFileSync('src/moon-identity.css','utf8')+'\\n'+fs.readFileSync('src/mobile-fit.css','utf8')"));
edit('scripts/package-mobile.cjs',s=>s.replace('v16 月见统一形象','v17 手机自适应'));
