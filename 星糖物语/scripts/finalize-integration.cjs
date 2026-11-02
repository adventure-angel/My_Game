const fs=require('fs');let s=fs.readFileSync('src/appScript.js','utf8');
s=s.replace("glyph:'🌷',copy:","glyph:'❧',copy:").replace("name:'窗边小花'","name:'花语八音盒'");
s=s.replace("'<div class=\"reward-note\"><strong>'+r.glyph", "'<div class=\"reward-note\"><span class=\"reward-art reward-'+level+'\"></span><strong>'+r.glyph");
s=s.replace("<div class=\"room-moonbeam\"></div>","<div class=\"room-moonbeam\"></div>'+earned.map((yes,i)=>yes?'<span class=\"reward-art room-treasure reward-'+i+'\" role=\"img\" aria-label=\"'+roomRewards[i].name+'\"></span>':'').join('')+'");
s=s.replace("'><b>'+r.glyph+'</b>'+r.name", "'><span class=\"reward-art reward-'+i+'\"></span>'+r.name");
s=s.replace("'<div class=\"reward-note\"><strong>'+roomRewards[state.level].glyph", "'<div class=\"reward-note\"><span class=\"reward-art reward-'+state.level+'\"></span><strong>'+roomRewards[state.level].glyph");
s=s.replace("试着上下交换第一行第3颗与下面那颗桃心","试着上下交换第一行第3颗与下面的火焰");
s=s.replace("['火花工坊',25,4600,5,26]","['霜晶工坊',25,4600,5,26]").replace("['花火约定',25,5800,5,32]","['冰花约定',25,5800,5,32]");
s=s.replace("先点一颗有附着的糖，再点无附着的普通糖。","先点一颗有附着的糖，再点无附着的普通糖。");
s=s.replace("elements.events.map(e=>e.name).join(' · ');$('reactionStatus').textContent=reactionText;}\n}","elements.events.map(e=>e.name).join(' · ');$('reactionStatus').textContent=reactionText;}elements.events=[];\n}");
// Snapshots are untrusted browser data; discard malformed aura/field records.
s=s.replace("c.k<7&&[''", "c.k<7&&(!c.aura||(ElementSystem.ids.includes(c.aura.e)&&Number.isInteger(c.aura.until)))&&(!c.buff||(['dew','grow'].includes(c.buff.type)&&Number.isInteger(c.buff.until)))&&[''");
// First lessons intentionally start with a guaranteed valid move and visible attachment examples.
s=s.replace("else engine.generate();\n  board.innerHTML", "else engine.generate();\n  if(!saved&&mode==='story'&&level===1){elements.attach(10,'water');elements.attach(11,'grass');}\n  if(!saved&&mode==='story'&&level===2){elements.attach(24,'grass');elements.attach(25,'water');state.energy=40;}\n  board.innerHTML");
s=s.replace("伙伴带来25点初始能量；继续消除充到40点，再选择释放时机。", "伙伴已准备好技能；选择目标，试着安排一次元素接力。");
fs.writeFileSync('src/appScript.js',s);
let pack=fs.readFileSync('scripts/package-mobile.cjs','utf8').replace("'companions-v2'","'companions-v3'").replace("'worlds-v2']","'worlds-v2','rewards-v3']");fs.writeFileSync('scripts/package-mobile.cjs',pack);
