const fs=require('fs');
const asset='data:image/webp;base64,'+fs.readFileSync('assets/prologue-comic-v29.webp').toString('base64');
const style=fs.readFileSync('src/prologue.css','utf8');
const reader=fs.readFileSync('src/prologue-reader.js','utf8');
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="dark"><title>星糖物语 · 四格序章：一束光的来信</title><style>
:root{--prologue-atlas:url("${asset}")}*{box-sizing:border-box}html,body{margin:0;height:100%;overflow:hidden;background:#121021}body{display:grid;place-items:center}.reader-shell{width:100%;max-width:480px;height:var(--reader-vh,100dvh);overflow:hidden;box-shadow:0 0 45px #0008}.reader-shell:has(.comic-overview){max-width:900px}.preview-ending{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:20px}.preview-ending h1{font:26px/1.6 Georgia,'Songti SC',serif;color:#ffdfab;margin:0 0 14px}.preview-ending p{font:14px/1.9 system-ui;color:#d8c4de;max-width:330px}.preview-ending>span{font:48px Georgia;color:#f4d59b;margin-bottom:14px}.preview-ending button{width:100%;max-width:330px;flex:none;margin:8px 0}.preview-ending .preview-secondary{min-height:46px;border:1px solid #c4a78288;border-radius:14px;background:#50395377;color:#ebd4e8;font:14px system-ui}
${style}
@media(min-width:600px){.comic-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;padding:18px}.comic-grid h2{font-size:20px}.comic-grid p{font-size:14px}}
</style></head><body><main class="reader-shell" id="comic"></main><script>
${reader}
let viewer=null;const host=document.getElementById('comic');
function showEnding(){viewer?.destroy();viewer=null;host.innerHTML='<section class="prologue-page"><header class="comic-header"><div><small>STAR CANDY · PROLOGUE</small><b>一束光的来信</b></div></header><section class="preview-ending"><span aria-hidden="true">✦</span><h1>下一站，星灯工坊</h1><p>与月见一起完成前三次小冒险，<br>带回夜灯，亲手点亮窗边的第一束光。</p><button class="comic-next" data-preview="read">再读一遍</button><button class="preview-secondary" data-preview="overview">查看四格总览</button></section></section>';}
function openReader(overview=false){viewer?.destroy();viewer=new StarCandyPrologue(host,{skipLabel:'合上',finishLabel:'把第一份约定记在心里',onSkip:showEnding,onFinish:showEnding});if(overview){viewer.overview=true;viewer.render();}}
document.addEventListener('click',e=>{const button=e.target.closest('[data-preview]');if(button)openReader(button.dataset.preview==='overview');});
function fit(){document.documentElement.style.setProperty('--reader-vh',(window.visualViewport?.height||window.innerHeight)+'px');}fit();window.addEventListener('resize',fit);window.visualViewport?.addEventListener('resize',fit);openReader();
</script></body></html>`;
fs.writeFileSync('star-candy-prologue-v29.html',html);
console.log('Comic reader: '+Buffer.byteLength(html)+' bytes');
