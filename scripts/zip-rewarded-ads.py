"""Package H5 using consistent forward slashes in both ZIP headers."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
source = root / 'release/h5-rewarded-ads-v34'
destination = root / 'release/star-candy-taptap-h5-v34a-rewarded-ads.zip'
with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for file in sorted((source / 'game').rglob('*')):
        if file.is_file():
            archive.write(file, file.relative_to(source).as_posix())
print(destination)
