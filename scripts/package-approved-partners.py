"""Extract approved panels without repainting or changing their composition."""
from pathlib import Path
from PIL import Image

root=Path(__file__).resolve().parents[1]
assets=root/'assets'
approved=Image.open(assets/'companions-v5-preview.png').convert('RGB')
w,h=approved.size
# Omit the narrow white sheet dividers; retain the complete four portraits.
boxes=[(0,0,w//2-3,h//2-3),(w//2+3,0,w,h//2-3),
       (0,h//2+3,w//2-3,h),(w//2+3,h//2+3,w,h)]
for i,box in enumerate(boxes):
    approved.crop(box).save(assets/f'partner-approved-{i}.jpg',quality=90,subsampling=2,optimize=True)
old=Image.open(assets/'companions-v3.jpg').convert('RGB')
old.crop((round(old.width*4/5)+2,0,old.width,old.height)).save(assets/'partner-approved-4.jpg',quality=90,subsampling=2,optimize=True)
print('Prepared four approved portraits and preserved the fifth partner.')
