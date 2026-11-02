from pathlib import Path

root=Path(__file__).resolve().parent.parent
updates={}
p=root/'src/economy-flow.js'
s=p.read_text(encoding='utf-8')
old='data-action="level" data-level="\'+target+\'"'
new='data-action="\'+(completed?\'journeyEnding\':\'level\')+\'" data-level="\'+target+\'"'
if s.count(old)!=1: raise ValueError('Expected one map button')
s=s.replace(old,new)
old="(locked?'尚未开启':'开始第 '+(target+1)+' 关')"
new="(completed?'未完待续 · 下一程再相见':locked?'尚未开启':'开始第 '+(target+1)+' 关')"
if s.count(old)!=1: raise ValueError('Expected one map label')
updates[p]=s.replace(old,new)
p=root/'src/journey-postcards.js'
s=p.read_text(encoding='utf-8')
old="(next<0?'七十二关 · 旅途已完成':owned?"
if s.count(old)!=1: raise ValueError('Expected one room label')
updates[p]=s.replace(old,"(journeyComplete()?'未完待续 · 下一程再相见':owned?")
for name in ['src/appScript.js','src/game-flow.js']:
    p=root/name
    updates[p]=p.read_text(encoding='utf-8').replace('v40 · 72关 · 自由闯关','v41 · 72关 · 自由闯关')
p=root/'config/release.json'
updates[p]=p.read_text(encoding='utf-8').replace('v40-board-choices','v41-to-be-continued')
s=(root/'scripts/package-board-choices.cjs').read_text(encoding='utf-8').replace('v40-board-choices','v41-to-be-continued').replace('h5-board-choices-v40','h5-to-be-continued-v41').replace("'v40'","'v41'").replace('package-board-choices-generated','package-to-be-continued-generated')
updates[root/'scripts/package-to-be-continued.cjs']=s
s=(root/'scripts/zip-board-choices.py').read_text(encoding='utf-8').replace('h5-board-choices-v40','h5-to-be-continued-v41').replace('v40-board-choices','v41-to-be-continued')
updates[root/'scripts/zip-to-be-continued.py']=s
for p,s in updates.items():p.write_text(s,encoding='utf-8')
print('Updated ending copy and v41 packaging paths.')
