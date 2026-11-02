"""Restore byte-for-byte source template and original trailer from repository parts."""
from pathlib import Path
import hashlib
import json
import sys

root = Path(__file__).resolve().parent.parent
items = [
    (root / 'template' / 'index.html.parts', root / 'index.html'),
    (root / 'media' / 'trailer' / 'original-1080p.parts', root / 'media' / 'trailer' / 'star-candy-trailer-final-1080p.mp4'),
]
selection = sys.argv[1] if len(sys.argv) > 1 else 'all'
for directory, output in items:
    if selection == 'template' and output.name != 'index.html':
        continue
    if selection == 'trailer' and output.name == 'index.html':
        continue
    manifest = json.loads((directory / 'manifest.json').read_text(encoding='utf-8'))
    data = b''.join((directory / name).read_bytes() for name in manifest['parts'])
    if len(data) != manifest['bytes'] or hashlib.sha256(data).hexdigest() != manifest['sha256']:
        raise SystemExit(f'Checksum mismatch: {output}')
    output.write_bytes(data)
    print(f'Restored {output.relative_to(root)} ({len(data)} bytes)')
