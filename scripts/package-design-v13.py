from pathlib import Path
from PIL import Image
import base64,sys,shutil,html

root=Path('assets/design-v13');root.mkdir(parents=True,exist_ok=True)
gen=Path('C:/Users/14163/AppData/Roaming/Cindy/codex-home/generated_images/01a177f2-1870-79c1-9de4-48146480ef46')
items=[
 ('props','道具材质','雕刻金币、折射水晶、星锤与机械星盘；信箱和签到册统一紫金材质。',gen/'exec-ed9233d8-c472-4bbc-8de0-43e7d2e14a44.png'),
 ('mail','月光信箱','浅色信笺配深色正文，加入蜡封、纸张纹理与紫藤细节。',gen/'exec-f8851137-2847-4b63-82b8-8eecb326454e.png'),
 ('daily','七日签到','翻开的心愿册，只发金币与道具；不再发放钻石。',gen/'exec-c179160a-5d61-4207-941a-c12a71954d55.png'),
 ('shop','心愿商店','道具与伙伴使用陈列式布局，区分金币、钻石、充值与人民币直购。',Path(sys.argv[1]))
]
panels=[];tabs=[]
for i,(key,title,copy,source) in enumerate(items):
 shutil.copy2(source,root/(key+'.png'))
 image=Image.open(source).convert('RGB');image.thumbnail((1500,1900),Image.Resampling.LANCZOS);image.save(root/(key+'.webp'),'WEBP',quality=93,method=6)
 uri='data:image/webp;base64,'+base64.b64encode((root/(key+'.webp')).read_bytes()).decode()
 tabs.append(f'<button type="button" data-view="{key}" aria-pressed="{str(i==0).lower()}">{title}</button>')
 panels.append(f'<section id="{key}" class="design" {"hidden" if i else ""}><h2>{title}</h2><p>{copy}</p><img src="{uri}" alt="{html.escape(title)}美术设计稿" width="{image.width}" height="{image.height}"><p class="caption">视觉提案 · 非可操作游戏页面。落地时文字、余额和按钮使用实时界面元素。</p></section>')
page='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>星糖物语 · v13 美术提案</title><style>
*{box-sizing:border-box}body{margin:0;background:#171221;color:#f3e5ca;font-family:system-ui,"Microsoft YaHei",sans-serif}main{max-width:780px;margin:auto;padding:18px 12px 32px}header small{color:#c4a8cc;font-size:10px;letter-spacing:2px}h1{font-size:24px;margin:8px 0}header p{font-size:13px;line-height:1.7;color:#d0bdd9}nav{position:sticky;top:0;z-index:2;display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:10px 0;background:#171221f5}nav button{padding:10px 2px;border:1px solid #b697bd55;border-radius:12px;background:#31243f;color:#d9c6df;font-size:12px;min-height:43px}nav button[aria-pressed=true]{background:#6d4d70;color:#fff0c7;border-color:#dfbd89}.design[hidden]{display:none}h2{font-size:19px;margin:14px 0 6px}.design p{font-size:12px;line-height:1.7;color:#cdbbd6}.design img{display:block;width:100%;height:auto;border-radius:12px}.caption{font-size:11px!important}details{margin-top:20px;border:1px solid #b695bb55;border-radius:14px;padding:13px}summary{cursor:pointer;font-size:14px;color:#f5d6a4}li{font-size:12px;line-height:1.8;margin:8px 0}ul{padding-left:18px}.note{font-size:11px;color:#bdabc9;line-height:1.7}button{cursor:pointer}
</style></head><body><main><header><small>STAR CANDY · ART PROPOSAL 13</small><h1>让每一份心愿，都有珍藏的质感</h1><p>四张全新美术提案，先看材质与页面方向。经济规则已更新，游戏美术等确认后再替换。</p></header><nav>'''+''.join(tabs)+'''</nav>'''+''.join(panels)+'''<details><summary>已更新的双货币规则</summary><ul><li>金币：闯关与签到获得，可购买道具及澪。</li><li>钻石：仅充值获取，¥1 = 10 钻石；签到和日常关卡不赠送。</li><li>小焰、青芽：钻石解锁。绯镜：¥6 人民币直购，金币与钻石均不能兑换。</li><li>钻石可以换金币，金币不能换钻石。</li><li>月见默认同行；澪暂定 1200 金币，小焰和青芽暂定各 40 钻石；兑换暂定 10 钻石换 1000 金币。</li></ul><p class="note">当前为本地试玩，支付未接入，不能真实充值或购买人民币商品。星章只是关卡成绩，不是第三种消费货币。</p></details></main><script>const buttons=document.querySelectorAll('[data-view]');buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('.design').forEach(s=>s.hidden=s.id!==b.dataset.view);window.scrollTo({top:0,behavior:'auto'});}));</script></body></html>'''
Path('star-candy-design-v13.html').write_text(page,encoding='utf-8')
print('Design gallery:',len(page.encode('utf-8')),'bytes')
