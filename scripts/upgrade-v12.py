from pathlib import Path

def edit(path, pairs):
    p=Path(path); s=p.read_text(encoding='utf-8')
    for old,new in pairs:
        if old not in s: raise ValueError(f'{path}: missing {old[:100]}')
        s=s.replace(old,new)
    p.write_text(s,encoding='utf-8')

edit('src/appScript.js',[
 ('const levels=[','const landmarkLevels=['),
 (" const defaults={version:3,music:true,unlocked:1,stars:Array(12).fill(0)","""  const levels=landmarkLevels.flatMap((base,landmark)=>[0,1,2].map(stage=>({
   ...base,landmark,stage,title:base.title+' · '+['寻光','共鸣','心愿'][stage],
   goal:Math.round(base.goal*[1,1.18,1.35][stage]/50)*50,moves:base.moves+[0,2,3][stage],
   count:base.color<0?0:Math.ceil(base.count*[1,1.12,1.25][stage])
  })));
  const defaults={version:4,music:true,unlocked:1,stars:Array(36).fill(0)"""),
 ('[2,3].includes(raw.version)','[2,3,4].includes(raw.version)'),
 ("[['unlocked',12],['partner',3],['bestTime',1e9]]","[['unlocked',36],['partner',4],['bestTime',1e9]]"),
 ("if(Array.isArray(raw.stars)&&raw.stars.length===12)data.stars=raw.stars.map(x=>[0,1,2,3].includes(x)?x:0);", """if(Array.isArray(raw.stars)){
     if(raw.version===4&&raw.stars.length===36)data.stars=raw.stars.map(x=>[0,1,2,3].includes(x)?x:0);
     else if(raw.stars.length===12){
      data.stars=raw.stars.flatMap(x=>Array(3).fill([0,1,2,3].includes(x)?x:0));
      data.unlocked=data.stars.every(Boolean)?36:Math.min(36,(Math.min(12,data.unlocked)-1)*3+1);
     }
    }
    if(raw.economy&&typeof raw.economy==='object')data.economy=raw.economy;"""),
 ("if(raw.version===3&&validSnapshot(raw.snapshot))data.snapshot=raw.snapshot;else if(raw.snapshot)migrated=true;", """const snap=raw.snapshot&&{...raw.snapshot,level:raw.version===4?raw.snapshot.level:raw.snapshot.mode==='story'?raw.snapshot.level*3:0};
    if(validSnapshot(snap))data.snapshot=snap;else if(raw.snapshot)migrated=true;"""),
 ('x.level<12','x.level<levels.length'),('x.moves<=26','x.moves<=40'),
 ('p===4&&!state.trial','p===4&&!state.trial&&!data.economy.mirror'),
 ('partners.slice(0,4).map','partners.slice(0,data.economy.mirror?5:4).map'),
 ('Math.floor((data.unlocked-1)/4)','Math.floor((data.unlocked-1)/12)'),
 ('level>=12','level>=levels.length'),
 ('Math.min(12,state.level+2)','Math.min(levels.length,state.level+2)'),
 ('Math.min(11,state.level+1)','Math.min(levels.length-1,state.level+1)'),
 ('partner:Math.min(3,data.partner)','partner:Math.min(data.economy.mirror?4:3,data.partner)'),
 ("lastResult={won,stars,firstClear};showScreen('result');","lastResult={won,stars,firstClear,reward:awardStage(won,firstClear)};persist();showScreen('result');"),
 ("state.hammers=loadout.hammer?2:0","state.hammers=loadout.hammer?1:0"),
 ("engine.pool=mode==='time'?[0,1,3,4,5,6]:level<2?[0,1,2,3]:level<4?[0,1,2,3,4]:level<8?[0,1,2,3,4,5]:[0,1,2,3,4,6];if(level>=8&&levels[level].color===5)engine.pool=[0,1,2,3,5,6];", "engine.pool=mode==='time'?[0,1,3,4,5,6]:level<2?[0,1,2,3]:levels[level].landmark<4?[0,1,2,3,4]:levels[level].landmark<8?[0,1,2,3,4,5]:[0,1,2,3,4,6];if(mode==='story'&&levels[level].color>=0&&!engine.pool.includes(levels[level].color))engine.pool.push(levels[level].color);"),
 ("收集900星光就能点亮小屋。","完成这关，再完成两次挑战，就能带回夜灯。"),
 ("function premiumDialog(){","function premiumDialog(){showMirrorOffer();return;"),
 ("$('mirrorPicker').hidden=!state.trial;","$('mirrorPicker').hidden=data.partner!==4;"),
 ("v11 · 心愿与收藏","v12 · 三关一份心愿"),
 ("+' / 36'","+' / 108'")
])

edit('src/game-flow.js',[
 ('if(handleWorldAction(b))return true;', 'if(handleEconomyAction(b))return true;\n if(handleWorldAction(b))return true;'),
 ('Math.floor((data.unlocked-1)/4)','Math.floor((data.unlocked-1)/12)'),
 ("place-'+p.level", "place-'+Math.floor(p.level/3)"),
 ('worldPlaces[p.level]','worldPlaces[Math.floor(p.level/3)]'),
 ('partners.slice(0,4).map','partners.slice(0,data.economy.mirror?5:4).map'),
 ("<h3 class=\"prep-label\">本局道具 <small>免费配置 · 自选携带</small></h3><div class=\"prep-tools\"><button data-action=\"prepTool\" data-tool=\"hammer\" aria-pressed=\"'+p.hammer+'\">'+(p.hammer?'✓':'＋')+' 星锤 ×2</button><button data-action=\"prepTool\" data-tool=\"shuffle\" aria-pressed=\"'+p.shuffle+'\">'+(p.shuffle?'✓':'＋')+' 重排 ×1</button></div>", "'+prepInventory(p)+'"),
 ("case 'prepPartner':if(preparation){preparation.partner=Number(b.dataset.partner);showPreparation();}return true;", "case 'prepPartner':if(preparation){const n=Number(b.dataset.partner);if(Number.isInteger(n)&&n>=0&&n<(data.economy.mirror?5:4)){preparation.partner=n;showPreparation();}}return true;"),
 ("preparation[b.dataset.tool]=!preparation[b.dataset.tool];showPreparation();", "const key=b.dataset.tool;if(!preparation[key]&&data.economy.inventory[key]<1){toast('背包不足，可先去心愿商店购买');return true;}preparation[key]=!preparation[key];showPreparation();"),
 ("const p={...preparation};preparation=null;setPartner(p.partner);start(p.mode,p.level,null,p);", "const p={...preparation};if(!consumeLoadout(p))return true;preparation=null;setPartner(p.partner);start(p.mode,p.level,null,p);"),
 ("<p class=\"prep-tip\">", "'+(time?'':stagePreparation(p.level))+'<p class=\"prep-tip\">")
])

edit('src/art-flow.js',[
 ("(i===4?'premium':'choosePartner')","(i===4&&!data.economy.mirror?'premium':'choosePartner')"),
 ("(i===4?'了解与免费试用':i===data.partner?", "(i===4&&!data.economy.mirror?'180 钻石解锁 · 可免费试用':i===data.partner?"),
 ('特别伙伴 · 付费解锁暂未开放', "特别伙伴 · '+(data.economy.mirror?'已解锁':'钻石可通过签到和通关获得')+'")
])

edit('src/world-flow.js',[
 ('const ownedItem=i=>!!data.stars[i];','const ownedItem=i=>!!data.stars[i*3+2];'),
 ('data.stars[l.level-1]','data.stars[l.level*3-1]'),
 ("collectibles[next].name", "collectibles[Math.floor(next/3)].name"),
 ("detail:worldPlaces[next]", "detail:worldPlaces[Math.floor(next/3)]+' · '+(next%3+1)+'/3 关'"),
 ("screen.innerHTML='<section class=\"art-page world-home\">", "screen.innerHTML=renderEconomyLobby();return true;\n  screen.innerHTML='<section class=\"art-page world-home\">"),
 ("if(next==='map'){", "if(next==='map'){return renderStageMap(screen);}\n if(false&&next==='map'){"),
 ("const r=lastResult,i=state.level,c=collectibles[i];", "screen.innerHTML=renderStageResult();return true;\n  const r=lastResult,i=state.level,c=collectibles[i];"),
 ("'第 '+(i+1)+' 关解锁'", "'完成第 '+((i+1)*3)+' 关解锁'"),
 ("'首次完成第 '+(i+1)+' 关后获得'", "'完成第 '+(i*3+1)+'—'+((i+1)*3)+' 关后获得'"),
 ("'第 '+(n+1)+' 关'", "'第 '+((n+1)*3)+' 关'"),
 ('收集前三关的三份心愿后','完成前三站的九关，收集三份心愿后'),
 ("<div class=\"world-lamp-glow\"></div>", "<div class=\"world-lamp-glow\"></div>'+roomDecor()+'"),
 ("<button data-action=\"wcVisit\"><span>♡</span>伙伴来访</button>", "<button data-action=\"wcVisit\"><span>♡</span>伙伴来访</button><button data-action=\"shop\" data-tab=\"diamonds\"><span>✦</span>装饰商店</button>")
])

edit('scripts/build-game.cjs',[
 ("fs.readFileSync('src/world-flow.js','utf8')", "fs.readFileSync('src/economy-flow.js','utf8')+'\\n'+fs.readFileSync('src/world-flow.js','utf8')"),
 ("fs.readFileSync('src/world-flow.css','utf8')", "fs.readFileSync('src/world-flow.css','utf8')+'\\n'+fs.readFileSync('src/economy-flow.css','utf8')")
])
edit('scripts/package-mobile.cjs',[("v11 心愿与收藏","v12 三关一份心愿")])

