from pathlib import Path
from PIL import Image
import shutil
root=Path(__file__).resolve().parent.parent
assets=root/'assets'
generated=Path('C:/Users/14163/AppData/Roaming/Cindy/codex-home/generated_images/01a177f2-1870-79c1-9de4-48146480ef46')
sources={'lobby':'fb62813a-e011-4d6b-867a-79719832ba8b','room':'c1ab7b06-8f15-4fc7-8fb5-a08cc9fc6290','cloud':'8759cced-2907-4a85-bc4f-a93d191187c4','forest':'0851f12e-675b-4891-8930-e49ca2c20fd5','sea':'0b61584f-e8e9-4388-a76d-925ec2af65d2','extras':'b28ef1a7-22d1-472a-9b72-7b2c0f9de243'}
for name,uid in sources.items():
 target=assets/('world-'+name+'-v11.png')
 if not target.exists():shutil.copy2(generated/('exec-'+uid+'.png'),target)
 image=Image.open(target).convert('RGBA' if name=='extras' else 'RGB')
 image.thumbnail((1260,1260) if name=='extras' else (900,1900))
 image.save(assets/('world-'+name+'-v11.webp'),quality=85,method=6)
print('Prepared five independent scenes and nine additional collectibles.')
