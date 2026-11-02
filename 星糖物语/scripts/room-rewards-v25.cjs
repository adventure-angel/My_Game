const fs=require('fs');
const p='src/economy-flow.js';let s=fs.readFileSync(p,'utf8');
s=s.replace("'<b>'+collectibles[g].name+'</b>'", "'<b>'+collectibles[g].name+'</b>'");
const old="+'<div class=\"result-actions\">'+(gift?";
const replacement="+'<button class=\"secondary\" data-action=\"rgPreview\" data-item=\"'+g+'\">'+(gift?'看看摆进小屋的样子':'预览下一份心愿 · '+stageCount(g)+'/3')+'</button>'+(roomBundles[g]?'<p>'+roomBundles[g]+' · 随收藏一起获得</p>':'')+'<div class=\"result-actions\">'+(gift?";
if(!s.includes(old))throw Error('Missing result action anchor');
s=s.replace(old,replacement);
fs.writeFileSync(p,s);
