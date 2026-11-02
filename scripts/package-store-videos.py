from pathlib import Path
import subprocess as sp, json, shutil, base64, zipfile

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'release/taptap-videos-v30'
SRC=OUT/'source'
shutil.copyfile('C:/Windows/Fonts/msyh.ttc', SRC/'ui-font.ttc')
shutil.copyfile('C:/Windows/Fonts/simkai.ttf', SRC/'title-font.ttf')
shutil.copyfile(ROOT/'release/taptap-materials-v30/banner-1920x1080.jpg', SRC/'banner.jpg')

def run(args):
    sp.run(['ffmpeg','-y','-v','error']+args,cwd=SRC,check=True)
def probe(p):
    return json.loads(sp.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(p)]))
def textfile(name,text):
    (SRC/name).write_text(text,encoding='utf-8'); return name
def txt(file,size,x,y,color='0xffedc1',font='ui-font.ttc'):
    return f"drawtext=fontfile={font}:textfile={file}:fontsize={size}:fontcolor={color}:x={x}:y={y}"

segments=[]
def card(name,duration):
    af=f'afade=t=in:d=0.3,afade=t=out:st={duration-.4}:d=0.4'
    run(['-loop','1','-framerate','30','-i','banner.jpg','-i',str(ROOT/'assets/music-ai/menu-b-loop.mp3'),'-t',str(duration),'-vf',f'scale=1920:1080,setsar=1,fade=t=in:d=0.25,fade=t=out:st={duration-.25}:d=0.25','-af',af,'-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-ar','48000','-ac','2','-b:a','160k',name+'.mp4'])
    segments.append(name+'.mp4')
    print('Rendered',name,flush=True)
def scene(name,source,duration,title,lines,kicker):
    titlef=textfile(name+'-title.txt',title)
    brand=textfile('brand.txt','星糖物语')
    kick=textfile(name+'-kicker.txt',kicker)
    foot=textfile('foot.txt','当前版本游戏画面 · 休闲消除与小屋收藏')
    filters=['scale=1920:1080','gblur=sigma=16','eq=brightness=-0.22:saturation=0.7','drawbox=x=0:y=0:w=1920:h=1080:color=0x170e30@0.58:t=fill',txt(brand,40,140,105),txt(kick,25,144,330,'0xd9b77e'),txt(titlef,76,132,395,font='title-font.ttf'),txt(foot,23,144,960,'0xb6a9c8'),'drawbox=x=144:y=545:w=70:h=3:color=0xe6c591:t=fill']
    for i,line in enumerate(lines): filters.append(txt(textfile(name+f'-line{i}.txt',line),31,144,595+i*58,'0xe6dcee'))
    vf='[0:v]'+','.join(filters)+'[bg];[1:v]scale=480:960:flags=lanczos,setsar=1[game];[bg][game]overlay=1295:60:shortest=1,fade=t=in:d=0.2,fade=t=out:st='+str(duration-.2)+':d=0.2[v]'
    run(['-loop','1','-framerate','30','-i','banner.jpg','-i',str(OUT/(source+'.mp4')),'-filter_complex',vf,'-map','[v]','-map','1:a','-t',str(duration),'-af',f'afade=t=in:d=0.2,afade=t=out:st={duration-.3}:d=0.3','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-ar','48000','-ac','2','-b:a','160k',name+'.mp4'])
    segments.append(name+'.mp4');print('Rendered',name,flush=True)

card('intro',2.5)
scene('play','gameplay-raw',12,'交换星糖，触发惊喜',['指尖交换，连成消除。','破解薄冰，感受元素反应。'],'01 / 星光从指尖开始')
scene('friends','partners',5,'和月见，一起出发',['选择同行伙伴，了解伙伴技能。','让每次旅途多一份陪伴。'],'02 / 遇见旅途伙伴')
scene('travel','journey',5.5,'沿着星光，走向远方',['走过浮岛与花间小径。','每三关，带回一份小屋收藏。'],'03 / 把心愿带回家')
scene('light','first-light',9.7,'第一盏灯，由你点亮',['预览、摆放，再亲手点亮。','让清冷的小屋渐渐有了温度。'],'04 / 收集留下生活的痕迹')
card('outro',3)
(SRC/'trailer-list.txt').write_text(''.join(f"file '{x}'\n" for x in segments),encoding='utf-8')
run(['-f','concat','-safe','0','-i','trailer-list.txt','-c','copy','-movflags','+faststart',str(OUT/'trailer-1920x1080.mp4')])
shutil.copyfile(OUT/'gameplay-raw.mp4',OUT/'gameplay-720x1440.mp4')
entries=[]
for filename,label,poster_time in [('trailer-1920x1080.mp4','横版宣传片',0.7),('gameplay-720x1440.mp4','连续游戏实录',8)]:
    info=probe(OUT/filename);v=next(s for s in info['streams'] if s['codec_type']=='video')
    duration=float(info['format']['duration'])
    poster=filename.replace('.mp4','.jpg')
    run(['-ss',str(poster_time),'-i',str(OUT/filename),'-frames:v','1','-q:v','3',str(OUT/poster)])
    entries.append(dict(file=filename,label=label,duration=duration,width=v['width'],height=v['height'],bytes=(OUT/filename).stat().st_size,poster=poster))
(OUT/'video-manifest.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2),encoding='utf-8')
readme='''星糖物语 · v30 视频素材\n\n宣传片：1920×1080 横版，现有美术＋当前游戏画面剪辑，带玩法说明和渐入渐出。\n游戏实录：720×1440 竖版，连续真实操作、游戏原声，无额外字幕、旁白、设备边框或画中画。\n录制环境：桌面 Chrome 运行当前 H5 的手机尺寸页面，并非手机硬件实录。\n隔离存档预先解锁进度，以展示第12关和已获得夜灯；录制中通过真实界面操作，没有修改棋盘或发放奖励。\n素材用于预览与上传准备，本轮未上传后台、未提交审核。美术与音乐商用授权凭证仍需随发行资料核实。\n'''
(OUT/'视频说明.txt').write_text(readme,encoding='utf-8')
html='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>星糖物语 · 视频素材</title><style>*{box-sizing:border-box}body{margin:0;background:#171024;color:#f7ecd7;font:16px/1.7 system-ui;padding:22px}main{max-width:1000px;margin:auto}h1{font-size:26px}h2{font-size:20px}p{color:#c6bcd3}section{margin:28px 0}video{display:block;width:100%;max-height:75vh;background:#08060d;border-radius:16px}small{color:#b8abc7}</style><main><h1>星糖物语 · 视频素材</h1><p>宣传片与当前 H5 游戏连续实录，可直接播放。</p>'''
for e in entries:
    encoded=base64.b64encode((OUT/e['file']).read_bytes()).decode()
    poster=base64.b64encode((OUT/e['poster']).read_bytes()).decode()
    html+=f'<section><h2>{e["label"]}</h2><p>{e["duration"]:.1f} 秒 · {e["width"]} × {e["height"]}</p><video controls playsinline preload="none" poster="data:image/jpeg;base64,{poster}" src="data:video/mp4;base64,{encoded}"></video></section>'
html+='<small>实录使用 Chrome 手机尺寸页面，保留游戏原声；未上传或提交审核。</small></main></html>'
(ROOT/'star-candy-store-videos.html').write_text(html,encoding='utf-8')
with zipfile.ZipFile(ROOT/'release/star-candy-taptap-videos-v30.zip','w',zipfile.ZIP_DEFLATED) as z:
    for name in [e['file'] for e in entries]+['视频说明.txt','video-manifest.json','recording-provenance.json']: z.write(OUT/name,name)
print(json.dumps(entries,ensure_ascii=False,indent=2),flush=True)

