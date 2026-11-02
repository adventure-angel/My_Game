from pathlib import Path
import zipfile
root = Path(__file__).resolve().parent.parent
source = root / 'release/h5-support-v36'
destination = root / 'release/star-candy-taptap-h5-v36-support.zip'
with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for file in sorted((source / 'game').rglob('*')):
        if file.is_file(): archive.write(file, file.relative_to(source).as_posix())
print(destination)
