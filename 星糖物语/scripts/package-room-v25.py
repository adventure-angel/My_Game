from pathlib import Path
from PIL import Image
import shutil
source=Path('C:/Users/14163/AppData/Roaming/Cindy/codex-home/generated_images/01a177f2-1870-79c1-9de4-48146480ef46')
assets=Path('assets')
for original,target in [('exec-d61db6f3-9a47-4f71-a05c-95dfc568c72d.png','room-base-v25'),('exec-39a19249-9459-4b3c-85a1-3cc5434d1315.png','room-soft-v25')]:
    shutil.copy2(source/original,assets/(target+'.png'))
    im=Image.open(source/original)
    im.save(assets/(target+'.webp'),quality=90,method=6)
    print(target,im.size,im.mode,(assets/(target+'.webp')).stat().st_size)
