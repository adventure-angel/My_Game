from pathlib import Path
import json

root = Path(__file__).resolve().parent.parent
def edit(file, changes):
    p = root / file
    s = p.read_text(encoding='utf-8')
    for old, new in changes:
        if old not in s: raise RuntimeError(f'Missing anchor in {file}: {old[:70]}')
        s = s.replace(old, new)
    p.write_text(s, encoding='utf-8')

edit('src/world-flow.js', [
 ("moments:[],events:[]", "moments:[],events:[],dailyNotes:[]"),
 ("  h.lamp=raw.lamp!==false;", "  h.lamp=raw.lamp!==false;\n  if(Array.isArray(raw.dailyNotes))h.dailyNotes=[...new Map(raw.dailyNotes.filter(n=>n&&/^\\d{4}-\\d{2}-\\d{2}$/.test(n.day)&&typeof n.title==='string'&&n.title.length<=40&&typeof n.text==='string'&&n.text.length<=200).map(n=>[n.day,{day:n.day,title:n.title,text:n.text,read:n.read===true}])).values()].sort((a,b)=>a.day.localeCompare(b.day)).slice(-14);"),
 (" const unread=availableLetters().find", " if(data.stars[11]&&!ownedItem(4))return {title:'下一份心愿 · 云朵烛台',action:'forestWish',button:'读森林来信',detail:'萤火营地 · 再过 '+(3-stageCount(4))+' 关，点亮阅读角',index:4,upcoming:true};\n const unread=availableLetters().find")
])

edit('src/room-growth.js', [
 (" if(handleRoomChapterAction(b))", " if(handleRoomLifeAction(b))return true;\n if(handleRoomChapterAction(b))"),
 (" const lamp=roomLayerOn(0)", " const note=roomDailyNote();\n const lamp=roomLayerOn(0)"),
 ("roomLayerOn(3)?'茶已经备好，今天也一起坐一会儿吧。':lamp?'你点亮的那束光，正在等你回家。':'这里还缺一盏暖暖的灯。'", "note.text"),
 ("<b>月见</b><span>'+line", "<b>月见 · 今日便签</b><span>'+releaseEsc(line)"),
 ("<button data-action=\"roomChapter\">家的模样 '+data.home.events.length+'/4</button>", "<button data-action=\"roomDailyNote\" class=\"'+(note.read?'':'daily-note-new')+'\">今日便签</button>"),
 (" const node=document.querySelector('.rg-speech span');", " const speaker=document.querySelector('.rg-speech b');if(speaker)speaker.textContent='月见';\n const node=document.querySelector('.rg-speech span');"),
 ("不会挤掉旧物件。</p><div", "不会挤掉旧物件。</p><button class=\"secondary\" data-action=\"roomChapter\">家的模样 · 前四份心愿</button><div"),
 ("+'</b>'+roomProgress(i)", "+'</b>'+(i===4&&forestWishAvailable()?'<button class=\"forest-wish-link\" data-action=\"forestWish\">森林来信 · 点亮阅读角 ›</button>':'')+roomProgress(i)"),
 ("  const day=new Date().getDate(),placed=collectibles.map((c,n)=>roomPlaced(n)?n:-1).filter(n=>n>=0);\n  roomSay(placed.length?roomLines[placed[day%placed.length]]:['窗台还空着，去找一盏属于我们的灯吧。','不必着急，家可以一点一点变成喜欢的样子。'][day%2]);break;", "  showRoomDailyNote();break;"),
 (" case 'rgCat':roomSay(roomPlaced(8)?'它在星毯上打了个滚，又悄悄贴近你。':musicBoxPlaying?'旋律响起，它的耳朵也跟着动了动。':'猫咪眯起眼睛，喉咙里传来轻轻的呼噜声。',true);if(data.sound)tone(1);break;", " case 'rgCat':roomPetCat();break;"),
 ("else{roomSay(roomLines[i],i===8);", "else{roomSay(roomItemReply(i),i===8);"),
 ("roomSay(roomLines[i],i===0);", "roomSay(i===4?'云朵烛台亮起了阅读角。月见：下一次，我们带一点植物的绿意回来吧。':roomLines[i],i===0);")
])

edit('src/room-chapter.js', [
 ("家的第一套布置，完成了。", "家的第一套布置完成了。下一站去萤火营地，把云朵烛台带回来。"),
 ("showScreen('records');roomSay(roomEventBeats[i][2],i<2);", "showScreen('records');roomSay(roomEventBeats[i][2],i<2);"),
 ("+'</span></div></button>').join('')+'</div>');", "+'</span></div></button>').join('')+'</div>'+forestWishCard());")
])

edit('src/economy-flow.js', [
 ("e.decor=['moon','stars']", "e.decor=['wishStar','moon','stars']"),
 ("walletView(true)+staminaView()", "walletView(true)"),
 ("lobby-topbar moonlight-ribbon", "lobby-topbar moonlight-ribbon free-play-ribbon"),
 ("homeTask?homeTask.detail:wish.index", "homeTask?homeTask.detail:wish.upcoming?wish.detail:wish.index"),
 ("(state.level%3===2?90:60):10", "(state.level%3===2?90:60):20"),
 ("+(rew.stamina?'<p class=\"chapter-supply\">花溪补给 · 恢复 '+rew.stamina+' 体力</p>':'')", "+(rew.chapterCoins?'<p class=\"chapter-supply\">已含花溪补给 · +'+rew.chapterCoins+'金币</p>':'')"),
 ("+'<div class=\"result-actions\">'+(gift?", "+(i===11?forestWishCard():'')+'<div class=\"result-actions\">'+(gift?"),
 (" {id:'moon',tab:'diamonds'", " {id:'wishStar',tab:'diamonds',type:'decor',name:'星愿窗铃',price:9,icon:'stars',copy:'一枚轻轻作响的金色星铃。永久装饰，摆上后轻触可听到回应。'},\n {id:'moon',tab:'diamonds'"),
 (" if(!spendStamina())return false;\n", ""),
 ("<div class=\"room-decor\" aria-hidden=\"true\">", "<div class=\"room-decor\">"),
 ("function roomDecor(){return '<div class=\"room-decor\">'+", "function roomDecor(){return '<div class=\"room-decor\">'+(data.economy.activeDecor.includes('wishStar')?'<button class=\"wish-chime\" data-action=\"roomChime\" aria-label=\"轻碰星愿窗铃\">'+lobbyIcon('stars')+'</button>':'')+"),
 ("广告补给正在审核。", "也可自愿观看视频领取额外补给。")
])
edit('src/game-flow.js', [
 ("'+staminaView(true)+'<button class=\"primary prep-start\" data-action=\"confirmStart\">开始挑战 · 消耗 '+staminaRules.cost+' 体力 ▶", "<button class=\"primary prep-start\" data-action=\"confirmStart\">开始挑战 · 自由闯关 ▶")
])
edit('src/first-chapter.js', [
 (" data.economy.chapterSupply=true;const s=syncStamina(),before=s.value;if(before<staminaRules.max)s.value=Math.min(staminaRules.max,before+15);reward.stamina=s.value-before;\n if(reward.stamina>0&&s.value>=staminaRules.max)s.recovery=0;", " data.economy.chapterSupply=true;reward.chapterCoins=60;reward.coins+=60;data.economy.coins+=60;")
])

# Keep the old field for importing existing cloud/local saves; it no longer gates play.
(root/'src/stamina.js').write_text('''// Legacy save compatibility. Starting or retrying a game is now free of stamina.
const staminaRules={max:50,cost:0,interval:300000};
function normalizeStamina(raw){
 const now=Date.now();return {version:3,value:Number.isInteger(raw?.value)?Math.max(0,Math.min(100,raw.value)):50,updatedAt:Number.isFinite(raw?.updatedAt)?Math.min(now,raw.updatedAt):now,recovery:0};
}
data.stamina=normalizeStamina(data.stamina);
function syncStamina(){return data.stamina;}
function spendStamina(){return true;}
function staminaView(){return '';}
function updateStaminaView(){}
function handleStaminaAction(b){
 if(b.dataset.action==='staminaInfo'){showDialog('<h2 id="dialogTitle">自在出发</h2><p>闯关与重试都不再消耗体力，按自己的节奏玩就好。</p><button class="primary" data-action="close">知道了</button>');return true;}
 if(b.dataset.action==='staminaBack'){closeDialog();return true;}return false;
}
''',encoding='utf-8')

edit('src/ad-economy.js', [
 ("amount:200", "amount:300"),
 (",\n {id:'stamina',name:'旅途体力',icon:'stamina',amount:10,unit:'体力',copy:'补充两局冒险的体力，最多补到50点。'}", ""),
 (" if(offer==='stamina'&&data.stamina.value>=50)return '体力已满，留到需要时再领取';\n", ""),
 ("(p.icon==='stamina'?staminaBottle():lobbyIcon(p.icon))", "lobbyIcon(p.icon)"),
 ("重玩胜利10金币", "重玩胜利20金币"),
 ("function adStaminaEntry(){return '<div class=\"ad-stamina-note\"><b>视频补给 · +10体力</b><p>每5分钟自然恢复1点体力。也可以自愿观看视频补充，最多补到50点。</p><button class=\"secondary\" data-action=\"shop\" data-tab=\"rewards\">查看视频补给</button></div>';}", "function adStaminaEntry(){return '';}") ,
 (" const offer=adSupplyOffers.find(o=>o.id===p.offer);if(!offer)return;", " const offer=p.offer==='stamina'?{amount:100,unit:'金币',id:'coins'}:adSupplyOffers.find(o=>o.id===p.offer);if(!offer)return;"),
 (" if(p.offer==='stamina'){amount=Math.max(0,Math.min(10,50-data.stamina.value));data.stamina.value+=amount;if(data.stamina.value>=50)data.stamina.recovery=0;}\n else data.economy[p.offer]+=amount;", " data.economy[offer.id]+=amount;"),
 ("toast(amount?'已领取 '+amount+' '+offer.unit:'体力已满，本次视频已完成');", "toast((p.offer==='stamina'?'旧体力补给已转换：':'已领取 ')+amount+' '+offer.unit);")
])

edit('scripts/build-game.cjs', [
 ("fs.readFileSync('src/room-chapter.js','utf8')", "fs.readFileSync('src/room-chapter.js','utf8')+'\\n'+fs.readFileSync('src/room-life.js','utf8')"),
 ("fs.readFileSync('src/room-growth.css','utf8')", "fs.readFileSync('src/room-growth.css','utf8')+'\\n'+fs.readFileSync('src/room-life.css','utf8')")
])
edit('src/playtest-data.js', [("build:'v30'", "build:StarCandyRelease.build")])
edit('src/release-ops.js', [("build:'v34-rewarded-ads'", "build:StarCandyRelease.build")])
config=json.loads((root/'config/release.json').read_text(encoding='utf-8'))
config['build']='v38-room-life'
config['stamina']={'enabled':False,'cap':50,'cost':0,'recoverySeconds':0}
config['rewardedAdSupply'].update(coins=300,stamina=0)
config['currency'].update(replayWinCoins=20,chapterSixCoins=60,starterDecorDiamonds=9)
(root/'config/release.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Updated room life, free play and economy source files.')
