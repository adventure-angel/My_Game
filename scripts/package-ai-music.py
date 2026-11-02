import base64
import json
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[1]
folder = root / 'assets/music-ai'
tracks = [
    ('menu-a', '主界面 A · 晴窗小屋', '82 BPM · 吉他、马林巴琴、轻打击乐', '轻松明亮的编配方向', 'Cozy Ember Quest', '243a113d45e940cb9fab5dae09b5602d'),
    ('menu-b', '主界面 B · 午后轻语', '80 BPM · 尼龙吉他、电钢琴、马林巴琴', '更柔和、留白更多的编配方向', 'Cozy Tavern Menu', '37fee41bde6f4591888b0a3e593abd71'),
    ('game-a', '关卡 A · 星光旅途', '112 BPM · 吉他琶音、柔和合成器、轻鼓', '有前进感的轻快编配方向', 'Starlight Puzzle Quest', 'c9ba738ea4d64243985f57426d8a949a'),
    ('game-b', '关卡 B · 晶糖跃动', '116 BPM · 节奏吉他、拨弦合成器、电钢琴', '更活泼、律动更鲜明的编配方向', 'Crystal Puzzle Loop', '4c06e021568d41978543bd304933c87b'),
]
cards = []
records = []
for key, title, instruments, description, original, session in tracks:
    output = folder / (key + '.mp3')
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(folder / (key + '.wav')), '-af', 'loudnorm=I=-18:TP=-2:LRA=9,afade=t=in:st=0:d=0.25,afade=t=out:st=29:d=1', '-ar', '44100', '-ac', '2', '-b:a', '128k', str(output)], check=True)
    data = base64.b64encode(output.read_bytes()).decode()
    cards.append(f'<article><p class="tag">{instruments}</p><h2>{title}</h2><p>{description}</p><audio controls preload="none" aria-label="{title}" src="data:audio/mpeg;base64,{data}"></audio><p class="small">30 秒 · AI 生成试听</p></article>')
    records.append(dict(id=key, title=title, direction=instruments, service_title=original, session_url='https://stableaudio.com/st-1/'+session, original=key+'.wav', preview=key+'.mp3'))

page = '''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>星糖物语 · AI 音乐试听</title><style>
*{box-sizing:border-box}body{margin:0;background:#171425;color:#f7ecd9;font:16px/1.65 system-ui,-apple-system,"Microsoft YaHei",sans-serif}main{max-width:850px;margin:auto;padding:28px 16px 48px}header{padding:12px 4px 22px}.eyebrow{color:#d3b37d;letter-spacing:.18em;font-size:11px}h1{font-size:30px;line-height:1.3}h2{font-size:21px;margin:6px 0}p{color:#d4c8df}.toolbar{display:flex;flex-wrap:wrap;gap:16px;align-items:center;padding:14px;border:1px solid #67516e;border-radius:14px;background:#282135;position:sticky;top:8px;z-index:2}button{padding:9px 14px;background:#41304d;border:1px solid #967ba4;border-radius:10px;color:#fff;font:inherit}label{font-size:14px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:20px}article{padding:20px;border-radius:20px;border:1px solid #594466;background:linear-gradient(135deg,#332840,#211b30)}audio{width:100%;margin-top:12px}.tag{color:#e1bf84;font-size:12px}.small,footer{font-size:13px;color:#b9acc4}footer{margin-top:24px}input{accent-color:#c9a570}a{color:#e1bf84}@media(max-width:600px){.grid{grid-template-columns:1fr}h1{font-size:27px}}
</style><main><header><div class="eyebrow">STAR CANDY · AI MUSIC AUDITIONS</div><h1>为星糖写的四段音乐</h1><p>主界面两版，关卡两版。根据你选的 3 号和 6 号的配器与氛围方向生成，没有上传或复刻原曲旋律。下面的描述是创作方向，以实际听感为准。</p><p>先听再选，游戏里的配乐尚未替换。点播放即可；切换曲目时自动暂停上一首。</p></header><div class="toolbar"><button id="stop">全部暂停</button><label><input id="loop" type="checkbox"> 循环试听</label></div><section class="grid">''' + ''.join(cards) + '''</section><footer><p>回复例如「主界面 A，关卡 B」即可，也可以告诉我哪一段太吵、太慢或旋律不喜欢。</p><p>Stable Audio · SA3 生成，免费账户积分。本页已内嵌音频，无需登录或联网取音乐。试听版做了音量统一和短淡入淡出，正式循环衔接将在选定后处理。</p></footer></main><script>
const players=[...document.querySelectorAll('audio')];players.forEach(p=>{p.volume=.7;p.addEventListener('play',()=>players.forEach(q=>{if(q!==p)q.pause()}));p.addEventListener('error',()=>{if(p.nextElementSibling)p.nextElementSibling.textContent='音频未能加载，请重新打开试听页。'})});document.getElementById('stop').onclick=()=>players.forEach(p=>p.pause());document.getElementById('loop').onchange=e=>players.forEach(p=>p.loop=e.target.checked);document.addEventListener('visibilitychange',()=>{if(document.hidden)players.forEach(p=>p.pause())});
</script></html>'''
(root/'music-ai-auditions-v1.html').write_text(page, encoding='utf-8')
(folder/'manifest.json').write_text(json.dumps(dict(service='Stable Audio', model='SA3', credits_used=16, credits_remaining=34, game_music_replaced=False, processing='Loudness normalization to -18 LUFS target; short fades; MP3 previews. Original WAV retained.', tracks=records), ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'page':'music-ai-auditions-v1.html','bytes':(root/'music-ai-auditions-v1.html').stat().st_size,'tracks':len(records)}))
