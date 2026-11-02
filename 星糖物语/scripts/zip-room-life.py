from pathlib import Path
import zipfile
root = Path(__file__).resolve().parent.parent
source = root / 'release/h5-room-life-v38'
destination = root / 'release/star-candy-taptap-h5-v38-room-life.zip'
with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for file in sorted((source / 'game').rglob('*')):
        if file.is_file(): archive.write(file, file.relative_to(source).as_posix())
print(destination)
