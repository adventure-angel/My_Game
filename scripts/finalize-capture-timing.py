from pathlib import Path
import subprocess as sp
root=Path(__file__).resolve().parent.parent/'release/taptap-videos-v30'
for name in ['gameplay-raw','lobby','journey','partners','first-light']:
    listing=root/'source'/name/'frames.txt'
    lines=listing.read_text().splitlines()
    lines=[l for l in lines if not l.startswith('option ')]
    lines=[l+'\noption framerate 1000' if l.startswith('file ') else l for l in lines]
    listing.write_text('\n'.join(lines)+'\n')
    sp.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(listing),'-i',str(root/'source'/(name+'.webm')),'-vf','scale=720:1440:flags=lanczos,setsar=1,fps=30','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-af','apad','-t',str(sum(float(l.split()[1]) for l in lines if l.startswith('duration '))),'-shortest','-movflags','+faststart',str(root/(name+'.mp4'))],check=True)
    print(name,sp.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(root/(name+'.mp4'))]).decode().strip(),flush=True)
