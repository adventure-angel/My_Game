from pathlib import Path
from PIL import Image
import sys, shutil, base64
dest=Path('assets/currency-lobby-designs');dest.mkdir(parents=True,exist_ok=True)
names=['A · 经典晶钻','B · 月滴晶石','C · 星菱晶石']
panels=[]
for i,path in enumerate(sys.argv[1:4]):
    tag='abc'[i];shutil.copy2(path,dest/f'{tag}.png')
    im=Image.open(path);im.save(dest/f'{tag}.webp',quality=92,method=6)
    image=base64.b64encode((dest/f'{tag}.webp').read_bytes()).decode()
    panels.append(f'<section id="v{i}" {"hidden" if i else ""}><img src="data:image/webp;base64,{image}" alt="{names[i]}大厅设计稿"></section>')
html='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>星糖物语 · 钻石大厅效果对比</title><style>*{box-sizing:border-box}body{margin:0;background:#1b1327;color:#f5e7ce;font:14px/1.5 system-ui}header{position:sticky;top:0;z-index:2;padding:9px 10px;background:#251a34f5;border-bottom:1px solid #b99a6d77}h1{font-size:15px;margin:0 0 7px}nav{display:flex;gap:6px}button{flex:1;min-height:38px;border:1px solid #b39370;border-radius:10px;background:#39263f;color:#ead3bd;font-size:12px}button[aria-selected=true]{background:#efd6a4;color:#39253b}main{max-width:580px;margin:auto}img{width:100%;height:auto;display:block}[hidden]{display:none!important}p{font-size:11px;margin:6px 0 0;color:#cbb9d3}</style><header><h1>钻石在大厅里的实际大小对比</h1><nav role="tablist">'''+''.join(f'<button role="tab" aria-selected="{str(i==0).lower()}" onclick="show({i})">{name}</button>' for i,name in enumerate(names))+'''</nav><p>仅设计稿，未替换游戏。切换 A / B / C 对比顶部资源栏。</p></header><main>'''+''.join(panels)+'''</main><script>function show(n){document.querySelectorAll('main section').forEach((s,i)=>s.hidden=i!==n);document.querySelectorAll('nav button').forEach((b,i)=>b.setAttribute('aria-selected',String(i===n)));window.scrollTo(0,0)}</script></html>'''
Path('star-candy-diamond-lobby-designs.html').write_text(html,encoding='utf-8')
print('Saved star-candy-diamond-lobby-designs.html',len(html))
