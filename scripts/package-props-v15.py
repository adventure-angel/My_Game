from PIL import Image
from pathlib import Path
source=Path(r'C:\Users\14163\AppData\Roaming\Cindy\codex-home\generated_images\01a177f2-1870-79c1-9de4-48146480ef46\exec-014fb571-3b47-4672-a8bf-eee8f5cce1ef.png')
# Package the unmodified transparent production atlas; no resampling or painting.
im=Image.open(source)
im.save('assets/economy-props-v15.webp',quality=92,method=6)
print(im.size,im.mode,Path('assets/economy-props-v15.webp').stat().st_size)
