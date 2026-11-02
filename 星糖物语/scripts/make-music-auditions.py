import urllib.request,json,subprocess,base64,html,concurrent.futures
from pathlib import Path
from urllib.parse import quote

root=Path(__file__).resolve().parents[1]
folder=root/'assets'/'music-auditions'
folder.mkdir(parents=True,exist_ok=True)
catalog=json.load(urllib.request.urlopen('https://incompetech.com/music/royalty-free/pieces.json',timeout=40))
choices=[
 ('Windswept','晚风小屋','吉他 · 弦乐','舒缓、温暖，试试看是否适合伙伴小屋。',18),
 ('Dream Culture','水色梦境','钢琴 · 轻节奏','梦幻钢琴与节拍，试试看消除时会不会抢注意力。',24),
 ('Easy Lemon','柠檬午后','吉他 · 马林巴 · 轻鼓','轻松的日常感，适合比较长时间游玩的舒适度。',16),
 ('Enchanted Valley','森林来信','木管 · 弦乐 · 钢片琴','童话配器，试试看与星糖的幻想画风是否合拍。',16),
 ('Carefree','晴天散步','尤克里里 · 吉他 · 打击乐','更明亮活泼，比较一下你是否喜欢这样的节奏。',22),
 ('Inspired','云端出发','吉他 · 合成器 · 打击乐','更有向前的律动，试试看是否适合旅途与过关。',30),
]

def prepare(item):
 title,label,instruments,copy,start=item
 track=next(t for t in catalog if t['title']==title)
 url='https://incompetech.com/music/royalty-free/mp3-royaltyfree/'+quote(track['filename'])
 original=folder/track['filename']
 if not original.exists():
  req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
  with urllib.request.urlopen(req,timeout=90) as response: original.write_bytes(response.read())
 excerpt=folder/(title+'-preview.mp3')
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(start),'-i',str(original),'-t','28','-vn','-af','loudnorm=I=-18:TP=-2:LRA=9,afade=t=in:st=0:d=0.6,afade=t=out:st=26.8:d=1.2','-ar','32000','-ac','2','-codec:a','libmp3lame','-b:a','64k',str(excerpt)],check=True)
 return dict(title=title,label=label,instruments=instruments,copy=copy,start=start,source=url,page='https://incompetech.com/music/royalty-free/index.html?isrc='+track['isrc'],data=base64.b64encode(excerpt.read_bytes()).decode())

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 tracks=list(pool.map(prepare,choices))
cards=[]
for i,t in enumerate(tracks,1):
 cards.append(f'''<article><div class="top"><span class="number">0{i}</span><button class="favorite" data-index="{i}" aria-pressed="false">♡ 留作候选</button></div><h2>{t['label']}</h2><p class="tags">{t['instruments']}</p><p>{t['copy']}</p><audio controls preload="none" aria-label="试听{i}：{t['label']}" src="data:audio/mpeg;base64,{t['data']}"></audio><div class="source">原曲：{html.escape(t['title'])} · Kevin MacLeod<br>选段 {t['start']}–{t['start']+28} 秒 · <a href="{t['page']}" target="_blank" rel="noopener">作者曲目页 ↗</a></div></article>''')
page='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#191626"><title>星糖物语 · 六首配乐试听</title><style>
*{box-sizing:border-box}body{margin:0;background:#191626;color:#f5e9d7;font-family:system-ui,-apple-system,"Microsoft YaHei",sans-serif;line-height:1.6}main{max-width:840px;margin:auto;padding:28px 16px max(38px,env(safe-area-inset-bottom))}header{padding:10px 4px 22px}.eyebrow{font-size:11px;letter-spacing:.2em;color:#d9bb80}h1{font-size:29px;line-height:1.25;margin:10px 0 16px}header p{font-size:14px;color:#cbc1d9;max-width:580px}.toolbar{position:sticky;top:0;z-index:2;background:#211c30f5;border:1px solid #67516e;border-radius:14px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:12px;margin-bottom:18px}.toolbar label{font-size:12px;display:flex;align-items:center;gap:6px}.toolbar input[type=range]{width:95px;accent-color:#dbbc81}button{font:inherit;color:inherit;background:#342a43;border:1px solid #7d647f;border-radius:11px;padding:8px 10px;cursor:pointer;touch-action:manipulation}.toolbar button{font-size:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}article{border:1px solid #56445f;background:linear-gradient(145deg,#30263e,#211d2f);border-radius:19px;padding:18px;min-width:0}.top{display:flex;justify-content:space-between;align-items:center}.number{font-size:12px;color:#ddc087;letter-spacing:.18em}.favorite{font-size:11px;padding:6px 10px}.favorite[aria-pressed=true]{background:#665134;color:#fff0cb;border-color:#d7b676}h2{font-size:22px;margin:14px 0 4px}.tags{font-size:12px!important;color:#dbc398!important;margin-top:0}article p{font-size:13px;color:#c6bdd2;min-height:42px}audio{width:100%;height:44px;display:block;margin:16px 0 12px}.source{font-size:10px;color:#aa9dbb;line-height:1.8}a{color:#e3c792;text-underline-offset:3px}footer{padding:22px 4px;font-size:12px;color:#bfb3cc}.summary{font-size:15px;color:#f3dba4;min-height:30px}button:focus-visible,a:focus-visible{outline:2px solid #e5c78f;outline-offset:3px}.notice{border-left:2px solid #c5a66d;padding-left:12px;margin-top:20px}@media(max-width:600px){.grid{grid-template-columns:1fr}h1{font-size:27px}article p{min-height:0}.toolbar{gap:8px}}
</style></head><body><main><header><div class="eyebrow">STAR CANDY · MUSIC AUDITIONS</div><h1>先听，再决定。</h1><p>六首现有作品，六个配乐方向。每首试听约 28 秒，已调整到接近的音量。这里仅供挑选，游戏里的音乐没有替换。</p><p>点击播放即可试听，切换曲目会自动暂停上一首。建议先听旋律，再想象连续玩十分钟是否舒服。</p></header><section class="toolbar" aria-label="试听控制"><button id="stop">全部暂停</button><label>音量 <input id="volume" type="range" min="0" max="1" step="0.05" value="0.65" aria-label="试听音量"></label><label><input id="loop" type="checkbox">循环当前选段</label></section><section class="grid">'''+''.join(cards)+'''</section><footer><div id="summary" class="summary" aria-live="polite">可以先把喜欢的留下，再回来告诉我编号。</div><p>“留作候选”只记录在这个试听页，不会发送消息，也不会替换游戏配乐。你可以选一首，也可以分别指定主页和游戏中的音乐。</p><div class="notice">试听曲目均由 Kevin MacLeod 创作，来源 incompetech.com。<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>。本页作了选段、音量调整和首尾淡入淡出；中文标题仅为本项目的试听标签，非原曲名称。<a href="https://incompetech.com/music/royalty-free/licenses/" target="_blank" rel="noopener">作者授权说明</a>。</div></footer></main><script>
const players=[...document.querySelectorAll('audio')],volume=document.getElementById('volume'),loop=document.getElementById('loop');let picked=[];try{picked=JSON.parse(localStorage.getItem('starCandyMusicPicks')||'[]');if(!Array.isArray(picked))picked=[];}catch(_){}
players.forEach(p=>{p.volume=Number(volume.value);p.addEventListener('play',()=>players.forEach(other=>{if(other!==p)other.pause();}));p.addEventListener('error',()=>{const n=document.createElement('p');n.textContent='当前预览未能播放音频，请关闭后重新打开本试听页，或将此提示发给我。';p.after(n);});});
volume.oninput=()=>players.forEach(p=>p.volume=Number(volume.value));loop.onchange=()=>players.forEach(p=>p.loop=loop.checked);document.getElementById('stop').onclick=()=>players.forEach(p=>p.pause());document.addEventListener('visibilitychange',()=>{if(document.hidden)players.forEach(p=>p.pause());});
function render(){document.querySelectorAll('.favorite').forEach(b=>{const yes=picked.includes(Number(b.dataset.index));b.setAttribute('aria-pressed',String(yes));b.textContent=yes?'♥ 已留作候选':'♡ 留作候选';});document.getElementById('summary').textContent=picked.length?'你留下了：'+picked.slice().sort((a,b)=>a-b).map(n=>'0'+n).join('、')+'。回到聊天告诉我就好。':'可以先把喜欢的留下，再回来告诉我编号。';}
document.querySelectorAll('.favorite').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.index);picked=picked.includes(i)?picked.filter(n=>n!==i):[...picked,i];try{localStorage.setItem('starCandyMusicPicks',JSON.stringify(picked));}catch(_){}render();});render();
</script></body></html>'''
(root/'music-auditions-v1.html').write_text(page,encoding='utf-8')
manifest=[{k:v for k,v in t.items() if k!='data'} for t in tracks]
(folder/'credits.json').write_text(json.dumps({'author':'Kevin MacLeod','license':'CC BY 4.0','license_url':'https://creativecommons.org/licenses/by/4.0/','changes':'28-second excerpt, loudness adjustment and fades; no game replacement','tracks':manifest},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'file':'music-auditions-v1.html','bytes':(root/'music-auditions-v1.html').stat().st_size,'tracks':[t['title'] for t in tracks]}))
