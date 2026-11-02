from pathlib import Path
from PIL import Image
from io import BytesIO
import base64, shutil, html

root=Path(__file__).resolve().parent.parent
source=Path('C:/Users/14163/AppData/Roaming/Cindy/codex-home/generated_images/01a177f2-1870-79c1-9de4-48146480ef46')
out=root/'assets/design-v11'
out.mkdir(parents=True,exist_ok=True)
items=[
 ('01-lobby','新大厅 · 心愿与互动','5e319622-1638-4125-9f0c-3566f4551ddf'),
 ('02-room','小屋 · 收藏布置与互动','880d8c00-1df0-4bfe-8a59-0f3a61ef76d9'),
 ('03-placement','布置模式 · 选物与预览','21f241e8-6941-4fc5-9600-0fc22ddbd776'),
 ('04-cloud-map','第一章 · 云端四站','ba61a09e-ecf6-4513-a8d9-d485ff61eb2f'),
 ('05-forest-map','第二章 · 森林奇遇','d885a616-b680-4c41-8e89-bbd3ab8773d7'),
 ('06-star-map','第三章 · 星海约定','1256eb53-2da6-44e9-b28f-9cdce7bf3d94'),
 ('07-four-rewards','前四关 · 奖励与小屋变化','1290888c-7e63-4a4c-b8cb-8b1a3ee429de'),
 ('08-water-motion','流水动效 · 分层示意','7d1ff4af-212d-47aa-b319-23d75dd58650')]
sections=[]
for key,title,uid in items:
 original=source/('exec-'+uid+'.png')
 shutil.copy2(original,out/(key+'.png'))
 image=Image.open(original).convert('RGB')
 image.thumbnail((850,1900))
 buf=BytesIO();image.save(buf,format='JPEG',quality=88,optimize=True)
 data=base64.b64encode(buf.getvalue()).decode()
 sections.append('<section id="'+key+'"><h2>'+html.escape(title)+'</h2><img alt="'+html.escape(title)+'设计稿" loading="lazy" src="data:image/jpeg;base64,'+data+'"><a class="back" href="#top">回到目录 ↑</a></section>')
nav=''.join('<a href="#'+key+'">'+html.escape(title)+'</a>' for key,title,_ in items)
page='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>星糖物语 · 新一轮设计稿</title><style>*{box-sizing:border-box}body{margin:0;background:#1e1729;color:#f3e5ed;font:15px/1.6 system-ui}main{max-width:720px;margin:auto}header{padding:28px 20px}h1{font-size:25px;margin:0 0 8px}p{color:#d3bfd6;font-size:13px}nav{display:grid;gap:8px;grid-template-columns:1fr 1fr}a{color:#f4d69f;text-decoration:none}nav a{padding:10px;background:#382b43;border:1px solid #6d5267;border-radius:10px;font-size:12px}section{margin:0 0 26px;scroll-margin-top:8px}h2{font-size:17px;padding:12px 16px;margin:0;background:#35273f}img{display:block;width:100%;height:auto}.back{display:block;text-align:center;padding:12px}footer{padding:20px;color:#c4aecb;font-size:12px}</style><main><header id="top"><h1>星糖物语 · 新一轮设计稿</h1><p>共8张，点击目录跳转。都是静态视觉方案，尚未替换游戏。流水页为分层示意，不是动态试玩。</p><nav>'''+nav+'</nav></header>'+''.join(sections)+'<footer>正式实现时统一导航组件和真实进度文字。所有原始高清稿已保存在项目 assets/design-v11。</footer></main></html>'
(root/'star-candy-design-v11.html').write_text(page,encoding='utf-8')
print('Saved 8 full-resolution designs; mobile gallery:',len(page.encode('utf-8')),'bytes')
