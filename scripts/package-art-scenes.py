"""Deterministic resizing/cropping only; source illustrations are AI-generated."""
from pathlib import Path
from PIL import Image
import shutil

root = Path(__file__).resolve().parent.parent
assets = root / 'assets'
sources = Path('C:/Users/14163/AppData/Roaming/Cindy/codex-home/generated_images/01a177f2-1870-79c1-9de4-48146480ef46')
scenes = {
 'lobby': 'exec-edb09ab3-fe32-4ab8-a8ff-8886b150080b.png',
 'journey': 'exec-5448bd83-b3d7-4d34-bdfe-473f0a5c59a5.png',
 'room': 'exec-d4fc97c4-e505-4887-a6c3-127780613d6c.png'
}
for name, source in scenes.items():
 shutil.copy2(sources / source, assets / ('scene-' + name + '-v10.png'))
 image = Image.open(sources / source).convert('RGB')
 image.thumbnail((960, 1920))
 image.save(assets / ('scene-' + name + '-v10.webp'), quality=88, method=6)

for i,name in enumerate(['mio','flame','sprout','mirror'],1):
 image = Image.open(assets / ('partner-' + name + '-cover-quality-v1.png')).convert('RGB')
 image.thumbnail((900, 1500))
 image.save(assets / ('partner-scene-' + str(i) + '-v10.webp'), quality=88, method=6)

# Compact face crops for thumbnails, preparation and battle; source portraits stay intact.
paths = [assets/'scene-lobby-v10.png'] + [assets/('partner-'+x+'-cover-quality-v1.png') for x in ['mio','flame','sprout','mirror']]
for i,path in enumerate(paths):
 image=Image.open(path).convert('RGB')
 w,h=image.size
 if i==0:
  box=(w*.32,h*.18,w*.86,h*.18+w*.54)
 else:
  box=(w*.20,h*.05,w*.80,h*.05+w*.60)
 image=image.crop(tuple(map(round,box)))
 image.thumbnail((320,320))
 image.save(assets/('partner-face-'+str(i)+'-v10.webp'),quality=88,method=6)

# Crop only the illustrated navigation motifs, never their baked labels.
image=Image.open(assets/'room-design-v1.png').convert('RGB')
w,h=image.size
for i,(left,right) in enumerate([(0.04,.23),(.29,.46),(.53,.73),(.78,.97)]):
 tile=image.crop((round(w*left),round(h*.877),round(w*right),round(h*.944)))
 tile.thumbnail((150,110))
 tile.save(assets/('nav-'+str(i)+'-v10.webp'),quality=85,method=6)
reward_source=sources/'exec-d3d3ccf5-296b-4ad4-b8bd-5c14ba3334d4.png'
shutil.copy2(reward_source,assets/'rewards-v10.png')
image=Image.open(reward_source).convert('RGBA')
image.thumbnail((1500,500))
image.save(assets/'rewards-v10.webp',quality=90,method=6)
print('Prepared scene, portrait, reward and navigation assets.')
