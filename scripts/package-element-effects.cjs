const fs=require('fs');
const moduleCode=fs.readFileSync('scripts/element-effects.js','utf8');
const inline='<script id="elementEffects">\n'+moduleCode+'\n</script>\n';
const demo='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#191526"><title>星糖物语 · 元素动态演示</title><style>body{margin:0;padding:24px 18px max(20px,env(safe-area-inset-bottom));background:radial-gradient(ellipse at top,#48304e,#171426 70%);min-height:100svh;box-sizing:border-box}button,input{touch-action:manipulation}button{cursor:pointer;-webkit-tap-highlight-color:transparent}</style></head><body><main id="effectsDemo"></main>'+inline+'<script>StarCandyEffects.mount(document.getElementById("effectsDemo"));</script></body></html>';
const safeDemo=demo.replace('<main id="effectsDemo"></main>', '<main id="effectsDemo" style="color:#f6e9d5;font-family:system-ui"><h2>元素动态演示</h2><p>正在准备演示内容。如果长时间没有出现按钮，请关闭页面后重新打开新版入口。</p><noscript>当前预览未启用脚本，无法播放交互演示。</noscript></main>').replace('StarCandyEffects.mount(document.getElementById("effectsDemo"));','try { StarCandyEffects.mount(document.getElementById("effectsDemo")); } catch (error) { document.getElementById("effectsDemo").innerHTML="<h2>演示暂时无法启动</h2><p>请将此提示截图发回，以便继续修复。</p>"; console.error(error); }');
fs.writeFileSync('element-effects-demo.html',safeDemo);
fs.writeFileSync('element-effects-demo-v2.html',safeDemo);
fs.writeFileSync('element-effects-demo-v3.html',safeDemo);
let game=fs.readFileSync('index.html','utf8');
if(game.includes('<script id="elementEffects">'))game=game.replace(/<script id="elementEffects">[\s\S]*?<\/script>\s*/,inline);else game=game.replace('<script id="appScript">',inline+'<script id="appScript">');
if(!game.includes("case 'elementPreview':")){
 game=game.replace("case 'help':helpDialog();break;", "case 'help':helpDialog();break;\n   case 'elementPreview':showDialog('<h2 id=\"dialogTitle\">元素动态演示</h2><div id=\"effectsDemo\"></div><button class=\"secondary\" data-action=\"help\">返回玩法说明</button>');StarCandyEffects.mount($('effectsDemo'));break;");
 game=game.replace("function helpDialog(){\n", "function helpDialog(){\n");
 const mark="<div class=\"rule\"><b>3</b>";
 game=game.replace(mark,'<button class="secondary" data-action="elementPreview" style="margin-bottom:14px">查看元素染色与爆发演示 →</button>'+mark);
}
game=game.replace('</head>','<style>.dialog:has(.el-lab){width:440px;padding:20px}.dialog .el-lab h2{font-size:19px}.dialog .el-lab .el-copy{margin-bottom:12px}.dialog .el-board{margin:12px 0;padding:18px}</style></head>');
fs.writeFileSync('index.html',game);
console.log('Element effects demo and in-game help entry written.');
