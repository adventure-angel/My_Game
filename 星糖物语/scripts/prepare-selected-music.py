"""Prepare selected original WAVs as short loopable game assets, not audition fades."""
from pathlib import Path
import subprocess

folder=Path(__file__).resolve().parents[1]/'assets/music-ai'
for name,seconds in [('menu-b',24),('game-a',12*4*60/112)]:
    # Crossfade an extra 0.6s of the tail with the beginning; keep whole-bar length.
    overlap=.6
    graph=(f'[0:a]atrim=0:{seconds+overlap},asetpts=PTS-STARTPTS,loudnorm=I=-20:TP=-2:LRA=9,asplit=3[h][m][t];'
           f'[h]atrim=0:{overlap},asetpts=PTS-STARTPTS[head];'
           f'[m]atrim={overlap}:{seconds},asetpts=PTS-STARTPTS[mid];'
           f'[t]atrim={seconds}:{seconds+overlap},asetpts=PTS-STARTPTS[tail];'
           f'[tail][head]acrossfade=d={overlap}:c1=tri:c2=tri[seam];'
           '[seam][mid]concat=n=2:v=0:a=1[out]')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(folder/(name+'.wav')),'-filter_complex',graph,'-map','[out]','-ar','44100','-ac','2','-b:a','96k',str(folder/(name+'-loop.mp3'))],check=True)
    print(name, (folder/(name+'-loop.mp3')).stat().st_size)
