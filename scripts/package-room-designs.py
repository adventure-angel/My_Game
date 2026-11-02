from pathlib import Path
from PIL import Image
import sys, shutil, base64
out=Path('assets/design-room-stages');out.mkdir(parents=True,exist_ok=True)
titles=['初入住 · 第0关','初灯亮起 · 第3关','家的模样 · 第12关']
copies=['留出夜灯、八音盒与合照的位置，给玩家清晰的第一个目标。','第一件收藏改变光线，月见与猫对点灯作出回应。','夜灯、八音盒、合照和成套装饰，让闯关成果变成生活。']
panels=[]
for i,arg in enumerate(sys.argv[1:4]):
    source=Path(arg);shutil.copy2(source,out/f'stage-{i+1}.png')
    im=Image.open(source);im.save(out/f'stage-{i+1}.webp',quality=92,method=6)
    data=base64.b64encode((out/f'stage-{i+1}.webp').read_bytes()).decode()
    panels.append(f'<section id="stage{i}" {"hidden" if i else ""}><h2>{titles[i]}</h2><p>{copies[i]}</p><img src="data:image/webp;base64,{data}" alt="{titles[i]}设计稿"></section>')
html='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>星糖物语 · 小屋三阶段设计稿</title><style>*{box-sizing:border-box}body{margin:0;background:#191323;color:#f6e7cd;font:14px/1.6 system-ui}header{position:sticky;top:0;z-index:2;background:#241c32f2;padding:10px 12px;border-bottom:1px solid #bba17b55}h1{font:20px Georgia,serif;margin:0 0 9px}nav{display:flex;gap:7px}button{flex:1;min-height:42px;border:1px solid #ac8f70;background:#3b2c48;border-radius:10px;color:#f7e4bf;font-size:12px}button[aria-selected=true]{background:#eed5a3;color:#38243b}main{max-width:650px;margin:auto;padding:10px}h2{font-size:18px;margin:5px 0}p{font-size:12px;color:#cdbdd6;margin:0 0 12px}img{display:block;width:100%;height:auto;border-radius:12px}[hidden]{display:none!important}</style><header><h1>同一个小屋，三段成长</h1><nav role="tablist">'''+''.join(f'<button role="tab" aria-selected="{str(i==0).lower()}" onclick="show({i})">{t.split(" · ")[0]}</button>' for i,t in enumerate(titles))+'''</nav></header><main>'''+''.join(panels)+'''</main><script>function show(n){document.querySelectorAll('main>section').forEach((s,i)=>s.hidden=i!==n);document.querySelectorAll('nav button').forEach((b,i)=>b.setAttribute('aria-selected',i===n));window.scrollTo(0,0)}</script></html>'''
Path('star-candy-room-three-stages.html').write_text(html,encoding='utf-8')
print('Three-stage gallery saved:',len(html.encode('utf-8')),'bytes')
