from PIL import Image
from pathlib import Path
import shutil
root=Path('assets')
generated=Path(r'C:\Users\14163\AppData\Roaming\Cindy\codex-home\generated_images\01a177f2-1870-79c1-9de4-48146480ef46')
for src,name in [('exec-dd033b73-ca47-46d1-8696-a28cdf837041.png','world-lobby-v16'),('exec-819c774b-1fcf-4af7-b89c-46b605d9ed58.png','rewards-v16')]:
    shutil.copy2(generated/src,root/(name+'.png'))
    im=Image.open(generated/src)
    im.save(root/(name+'.webp'),quality=92,method=6)
    print(name,im.size)
# Preserve the exact approved cover pixels, changing only the encoding.
im=Image.open(root/'cover-v2.jpg')
im.save(root/'moon-master-v16.webp',quality=95,method=6)
print('moon-master-v16',im.size)
