from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json
root=Path(__file__).resolve().parent.parent
base=root/'release/h5-to-be-continued-v41'
target=root/'release/star-candy-taptap-h5-v41-to-be-continued.zip'
manifest=json.loads((base/'manifest.json').read_text(encoding='utf-8'))
names=['index.html','version.json']+[item['file'] for item in manifest['files']]+[item['file'] for item in manifest['assets']]
with ZipFile(target,'w',ZIP_DEFLATED,compresslevel=9) as archive:
    for name in sorted(set(names)):
        f=(base/'game'/name).resolve()
        if not f.is_relative_to((base/'game').resolve()): raise ValueError('Package entry outside game directory')
        archive.write(f,'game/'+name)
print(str(target)+' · '+str(target.stat().st_size)+' bytes')
