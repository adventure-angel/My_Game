"""Size/export generated artwork; package untouched game screenshots and a standalone preview."""
from pathlib import Path
from PIL import Image
import base64, io, json, hashlib, zipfile

root=Path(__file__).resolve().parents[1]
out=root/'release/taptap-materials-v30'
generated=Path('C:/Users/14163/AppData/Roaming/Cindy/codex-home/generated_images/01a177f2-1870-79c1-9de4-48146480ef46')
Image.open(generated/'exec-b9414d25-9dd4-40e2-8ab2-5b9637baf202.png').convert('RGB').resize((1024,1024),Image.Resampling.LANCZOS).save(out/'icon-1024.png',optimize=True)
Image.open(generated/'exec-c4f021ad-d622-4144-94d2-f241009d674e.png').convert('RGB').resize((1920,1080),Image.Resampling.LANCZOS).save(out/'banner-1920x1080.jpg',quality=95,subsampling=0,optimize=True)
entries=[('icon-1024.png','游戏图标','1024×1024 · PNG · 月见与星糖'),('banner-1920x1080.jpg','宣传图','1920×1080 · JPG · 16:9'),('02-match3.png','消除战斗','1080×2160 · 当前游戏棋盘'),('04-companion.png','同行伙伴','1080×2160 · 月见与伙伴选择'),('03-journey.png','星愿旅途','1080×2160 · 森林奇遇地图'),('01-lobby.png','游戏大厅','1080×2160 · 标题、资源栏与月见'),('05-room-before.png','小屋 · 初入住','1080×2160 · 零收藏'),('06-room-after.png','小屋 · 前四份心愿','1080×2160 · 完成前12关的演示进度')]
cards=[];files=[]
for name,title,caption in entries:
    p=out/name
    im=Image.open(p)
    files.append({'file':name,'title':title,'width':im.width,'height':im.height,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
    preview=im.copy();preview.thumbnail((960,1280),Image.Resampling.LANCZOS)
    buf=io.BytesIO();preview.convert('RGB').save(buf,format='JPEG',quality=87,optimize=True)
    data=base64.b64encode(buf.getvalue()).decode()
    cards.append(f'<article class="{"icon" if name.startswith("icon") else ""}"><h2>{title}</h2><p>{caption}</p><img loading="lazy" src="data:image/jpeg;base64,{data}" alt="{title}"></article>')
html='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>星糖物语 · TapTap 上架图片</title><style>*{box-sizing:border-box}body{margin:0;background:#171226;color:#f8efd8;font:16px/1.6 system-ui,sans-serif}main{max-width:1000px;margin:auto;padding:24px 16px}h1{font-size:27px;margin:0 0 8px}header p{color:#c8bdd5}article{padding:16px;margin:24px 0;background:#251e37;border:1px solid #655473;border-radius:18px}h2{margin:0;font-size:20px}p{margin:4px 0 14px}img{display:block;width:100%;max-width:540px;height:auto;margin:auto;border-radius:4px}.icon img{max-width:256px}article:nth-of-type(2) img{max-width:none}small{color:#c8bdd5}</style><main><header><h1>星糖物语 · 上架图片</h1><p>1 张图标 · 1 张宣传图 · 6 张真实游戏截图</p><small>图标与宣传图基于原封面由内置生图制作。截图来自未修改的 v30 游戏，使用独立演示存档展示不同进度，未覆盖玩家存档。此页为压缩预览，上传请使用素材包内原文件。</small></header>'''+''.join(cards)+'</main></html>'
(root/'star-candy-store-materials.html').write_text(html,encoding='utf-8')
(out/'manifest.json').write_text(json.dumps({'version':'v30','date':'2026-10-31','appId':'1011919','uploaded':False,'files':files,'generation':{'method':'built-in image_gen, after Art quota rejection','reference':'assets/cover-v2.png','iconPrompt':'保持封面月见身份、紫眼、银紫长发、月牙紫花发饰。正方形全出血头像，前景发光金色星糖，简洁紫蓝星空，无文字、圆角和水印。','bannerPrompt':'沿用原封面月见及世界观，重构16:9横幅，月见在右侧递出星糖，左侧浮岛小屋与夜空，金色标题“星糖物语”，副标题“消除星糖，与伙伴一起点亮小屋”，无虚构游戏界面。'},'screenshots':'Unmodified v30 rendered UI with isolated staging saves, not live user progress. No composited UI or invented feature images. See capture-provenance.json.'},ensure_ascii=False,indent=2),encoding='utf-8')
(out/'上传说明.txt').write_text('星糖物语 TapTap 图片素材\n\n游戏图标：icon-1024.png\n宣传图：banner-1920x1080.jpg\n游戏截图：01 至 06 六张 PNG，同为 1080×2160（1:2）。\n建议排序：02消除 → 04伙伴 → 03旅途 → 01大厅 → 05初始小屋 → 06成长小屋。\n\n截图由当前 v30 游戏直接渲染，展示进度使用独立演示存档。未修改游戏 UI，未覆盖玩家数据。\n未制作视频，未上传后台，未提交审核。图标、宣传图为基于既有封面制作的AI宣传美术。\n',encoding='utf-8')
archive=root/'release/star-candy-taptap-materials-v30.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(out.iterdir()):
        if p.is_file():z.write(p,p.name)
print(json.dumps({'files':files,'previewBytes':len(html.encode()),'zipBytes':archive.stat().st_size},ensure_ascii=False))
