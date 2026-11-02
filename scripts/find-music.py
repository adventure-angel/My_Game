import urllib.request,re
from urllib.parse import urljoin
url='https://incompetech.com/music/royalty-free/music.html'
html=urllib.request.urlopen(url,timeout=30).read().decode()
print('\n'.join(line for line in html.splitlines() if any(k in line for k in ['.json','fetch(','.mp3','creativecommons'])))
for src in re.findall(r'<script[^>]+src=[\"\x27]([^\"\x27]+)',html):
    full=urljoin(url,src)
    print(full)
    if 'incompetech.com' in full:
        js=urllib.request.urlopen(full,timeout=30).read().decode()
        print('\n'.join(line for line in js.splitlines() if any(k in line for k in ['.json','fetch(','.mp3','Creative Commons','creativecommons'])))
