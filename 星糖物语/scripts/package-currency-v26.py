from pathlib import Path
from PIL import Image
import shutil, sys
for source,name in zip(sys.argv[1:3],['currency-coin-v26','currency-diamond-b-v26']):
    dest=Path('assets')/name
    shutil.copy2(source,dest.with_suffix('.png'))
    im=Image.open(source)
    im.save(dest.with_suffix('.webp'),quality=90,method=6)
    print(name,im.size,im.mode,dest.with_suffix('.webp').stat().st_size)
