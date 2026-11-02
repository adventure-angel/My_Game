from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
pending={}
def edit(name,old,new):
    text=pending.get(name,(root/name).read_text(encoding='utf-8'))
    if old not in text: raise ValueError(f'Missing anchor in {name}: {old[:100]}')
    pending[name]=text.replace(old,new)

edit('src/appScript.js',' const landmarkLevels=[',' /* JOURNEY_EXPANSION_DATA */\n const landmarkLevels=[')
edit('src/appScript.js','  const defaults={version:4','  levels.push(...returnJourneyLevels);\n  const defaults={version:5')
edit('src/appScript.js','stars:Array(36).fill(0)','stars:Array(levels.length).fill(0)')
edit('src/appScript.js','[2,3,4].includes(raw.version)','[2,3,4,5].includes(raw.version)')
edit('src/appScript.js',"[['unlocked',36]","[['unlocked',levels.length]")
edit('src/appScript.js',"if(raw.version===4&&raw.stars.length===36)data.stars=raw.stars.map(x=>[0,1,2,3].includes(x)?x:0);","if(raw.version>=4&&[36,72].includes(raw.stars.length))data.stars=Array.from({length:levels.length},(_,i)=>[0,1,2,3].includes(raw.stars[i])?raw.stars[i]:0);")
edit('src/appScript.js','data.stars=raw.stars.flatMap(x=>Array(3).fill([0,1,2,3].includes(x)?x:0));','data.stars=raw.stars.flatMap(x=>Array(3).fill([0,1,2,3].includes(x)?x:0)).concat(Array(36).fill(0));')
edit('src/appScript.js','data.stars.every(Boolean)?36:Math.min(36,(Math.min(12,data.unlocked)-1)*3+1)','raw.stars.every(Boolean)?37:Math.min(36,(Math.min(12,data.unlocked)-1)*3+1)')
edit('src/appScript.js',"    if(raw.economy&&typeof raw.economy==='object')", "    let cleared=0;while(cleared<data.stars.length&&data.stars[cleared])cleared++;data.unlocked=Math.max(data.unlocked,Math.min(levels.length,cleared+1));\n    if(raw.economy&&typeof raw.economy==='object')")
edit('src/appScript.js','raw.version===4?raw.snapshot.level','raw.version>=4?raw.snapshot.level')
edit('src/appScript.js',"+' / 108'","+' / '+(levels.length*3)")
edit('src/appScript.js',"showDialog('<h2 id=\"dialogTitle\">小小偏好</h2>'+", "showDialog('<h2 id=\"dialogTitle\">小小偏好</h2><p class=\"release-build-label\">'+releaseEsc(StarCandyRelease.build)+' · '+levels.length+'关 · 自由闯关</p>'+")

edit('src/save-store.js','[2,3,4].includes(p.version)','[2,3,4,5].includes(p.version)')
edit('src/save-store.js','[12,36].includes(p.stars.length)','[12,36,72].includes(p.stars.length)')
edit('src/save-store.js','p.unlocked>36','p.unlocked>(p.stars.length===72?72:36)')
edit('src/release-ops.js',"+'/36 · '","+'/'+levels.length+' · '")
edit('src/release-ops.js',"stars:old?raw.stars.flatMap(n=>[n,n,n]):[...raw.stars]", "stars:(old?raw.stars.flatMap(n=>[n,n,n]):[...raw.stars]).concat(Array(levels.length).fill(0)).slice(0,levels.length)")
edit('src/release-ops.js','Math.min(36,i+2)','Math.min(levels.length,i+2)')
edit('src/release-ops.js','Array.from({length:12},(_,g)=>g)','Array.from({length:levels.length/3},(_,g)=>g)')
edit('src/taptap-cloud.js',"+'/36'","+'/'+safe.stars.length")

edit('src/economy-flow.js','g>=0&&g<12','g>=0&&g<levels.length/3')
edit('src/economy-flow.js','for(let g=0;g<12;g++)','for(let g=0;g<levels.length/3;g++)')
edit('src/economy-flow.js',"+'/36 关 ›</button>","+'/'+levels.length+' 关 ›</button>")
# The string above sits inside HTML; keep its original concatenation ending.
edit('src/economy-flow.js','Math.min(2,chapterView)','Math.min(chapterNames().length-1,chapterView)')
edit('src/economy-flow.js','][ch];','][ch%3];')
edit('src/economy-flow.js',"+'/108</span>'","+'/'+(levels.length*3)+'</span>'")
edit('src/economy-flow.js',"ch===2?'disabled'","ch===chapterNames().length-1?'disabled'")
edit('src/economy-flow.js',"(done===3?'· 收藏已获得':'· 心愿收集中')","(done===3?'· 已收藏':g>=12?'· 旅途后记收集中':'· 心愿收集中')")
edit('src/economy-flow.js',"collectionArt(group)","journeyRewardArt(group)")
edit('src/economy-flow.js',"collectibles[group].name","journeyReward(group).name")
edit('src/economy-flow.js',"startWorldWater(ch)","startWorldWater(ch%3)")
edit('src/economy-flow.js',"collectionArt(g)+'</span><div><b>'+collectibles[g].name", "journeyRewardArt(g)+'</span><div><b>'+journeyReward(g).name")
edit('src/economy-flow.js',"group>=12","group>=levels.length/3")
edit('src/economy-flow.js',"(n===2?'收藏 + 90 金币 · 首次集齐另得3钻石':'60 金币')", "(n===2?(group>=12?'旅途后记':'收藏')+' + 90 金币 · 首次集齐另得3钻石':'60 金币')")
edit('src/economy-flow.js','每次胜利获得 10 金币','每次胜利获得 20 金币')
edit('src/economy-flow.js','function renderStageResult(){','function renderStageResult(){\n if(state.level>=36)return renderReturnResult();')
edit('src/economy-flow.js','i<35?', 'i<levels.length-1?')
edit('src/economy-flow.js','三十六关完成 · 回家看看','七十二关完成 · 回家看看')

edit('src/game-flow.js',"return ['云端来信','森林奇遇','星海约定'];","return ['云端来信','森林奇遇','星海约定','云端重逢','森林夜话','星海归航'];")
edit('src/game-flow.js',"copy.textContent='轻触开始，和伙伴一起收集心愿'", "copy.textContent='v39 · 72关 · 自由闯关'")
edit('src/game-flow.js','Math.min(2,(chapterView??Math.floor((data.unlocked-1)/12))','Math.min(chapterNames().length-1,(chapterView??Math.floor((data.unlocked-1)/12))')

edit('src/first-chapter.js',"state.trial||state.level>=12", "state.trial||(state.level>=12&&!levels[state.level].managedGoals)")
edit('src/first-chapter.js',"state.mode!=='story'||state.level>=12", "state.mode!=='story'||(state.level>=12&&!levels[state.level].managedGoals)")
edit('src/first-chapter.js',"if(level>=12)return", "if(level>=12&&!levels[level].managedGoals)return")
edit('src/first-chapter.js','不消耗体力与背包道具','不消耗背包道具')
edit('src/first-chapter.js','不消耗体力，不发放通关奖励','不发放通关奖励')
edit('src/first-chapter.js','不消耗体力或道具','不消耗道具')

edit('src/world-flow.js',"'约定灯塔'];","'约定灯塔',...returnJourneyPlaces];")
edit('src/world-flow.js','events:[],dailyNotes:[]','events:[],dailyNotes:[],postcardsRead:[]')
edit('src/world-flow.js','  for(const c of collectibles)h.styles', "  h.postcardsRead=Array.isArray(raw.postcardsRead)?[...new Set(raw.postcardsRead.filter(id=>journeyPostcards.some((c,i)=>c.id===id&&postcardOwned(i))))]:[];\n  for(const c of collectibles)h.styles")
edit('src/world-flow.js'," const next=data.stars.findIndex(s=>!s);", " if(data.stars[35])return returnJourneyWish();\n const next=data.stars.findIndex(s=>!s);")
edit('src/world-flow.js'," if(next<0)return", " if(next>=36)return returnJourneyWish();\n if(next<0)return")
edit('src/world-flow.js',"我们可以重访喜欢的地方，也可以换一种方式布置小屋。", "暮光工坊又亮起了灯，第37关开始，我们一起重访云端、森林和星海，把十二页新的旅途后记带回来。")
edit('src/world-flow.js',"startWorldWater(chapterView??0)","startWorldWater((chapterView??0)%3)")

edit('src/room-growth.js',"all=collectibles.every((c,n)=>ownedItem(n));", "all=collectibles.every((c,n)=>ownedItem(n));\n if(all&&fresh<0)return returnJourneyDock();")
edit('src/room-growth.js'," if(handleRoomLifeAction(b))", " if(handleJourneyPostcardAction(b))return true;\n if(handleRoomLifeAction(b))")
edit('src/room-growth.js',"+'<button class=\"secondary\" data-action=\"artAlbum\">查看关卡心愿册</button>'", "+postcardAlbum()+'<button class=\"secondary\" data-action=\"artAlbum\">查看关卡心愿册</button>'")

edit('scripts/build-game.cjs',"if(id==='appScript')source=source.replace('/* GAME_FLOW_IMPLEMENTATION */'", "if(id==='appScript')source=source.replace('/* JOURNEY_EXPANSION_DATA */',fs.readFileSync('src/journey-expansion.js','utf8')).replace('/* GAME_FLOW_IMPLEMENTATION */'")
edit('scripts/build-game.cjs',"fs.readFileSync('src/room-life.js','utf8')", "fs.readFileSync('src/room-life.js','utf8')+'\\n'+fs.readFileSync('src/journey-postcards.js','utf8')")
edit('scripts/build-game.cjs',"fs.readFileSync('src/room-life.css','utf8')", "fs.readFileSync('src/room-life.css','utf8')+'\\n'+fs.readFileSync('src/journey-postcards.css','utf8')")

cfg=json.loads((root/'config/release.json').read_text(encoding='utf-8'))
cfg['build']='v39-free-play-72';cfg['totalLevels']=72
pending['config/release.json']=json.dumps(cfg,ensure_ascii=False,indent=2)+'\n'
for name,text in pending.items(): (root/name).write_text(text,encoding='utf-8')
print('Updated '+str(len(pending))+' files for v39')
