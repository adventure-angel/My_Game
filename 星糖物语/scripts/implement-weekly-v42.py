from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
def edit(name, changes):
    p=root/name;s=p.read_text(encoding='utf-8')
    for old,new in changes:
        if old not in s: raise ValueError(name+' missing: '+old[:100])
        s=s.replace(old,new)
    p.write_text(s,encoding='utf-8')
# Economy, import and chapter edits were completed before the first interruption.
edit('src/appScript.js',[
 ("partner:trialBackup?trialBackup.partner:data.partner","partner:trialBackup?trialBackup.partner:state.challenge?.oldPartner??data.partner"),
 ("function setPartner(p){", "function setPartner(p){\n  if(state.active&&state.challenge&&p!==0){toast('周赛统一使用月见');return;}"),
 ("$('partner').disabled=lessonActive();", "$('partner').disabled=lessonActive()||!!state.challenge;"),
 ("data.snapshot={mode:state.mode,", "data.snapshot={rulesVersion:1,levelTargets:state.levelTargets?{goal:state.levelTargets.goal,count:state.levelTargets.count,color:state.levelTargets.color}:null,mode:state.mode,"),
 ("if(next!=='game'&&state.active){state.paused=true;", "if(next!=='game'&&state.active){challengeInterrupt('离开了赛场，');state.paused=true;"),
 ("lastResult=null;\n  state.epoch++", "lastResult=null;\n  if(state.challenge&&!trialPending)data.partner=state.challenge.oldPartner;\n  state.epoch++"),
 ("  setupChapter(saved);", "  setupChapter(saved);state.levelTargets=roundLevel(saved);\n  if(mode==='story'&&!saved&&levels[level].pool)engine.pool=[...levels[level].pool];\n  setupChallenge(saved,loadout);"),
 ("choices[Math.floor(engine.rng()*choices.length)]", "choices[Math.floor(Math.random()*choices.length)]"),
 ("  skillMode=null;elements.begin();state.turnEnding=true;", "  if(state.challenge)state.challenge.swaps++;\n  skillMode=null;elements.begin();state.turnEnding=true;"),
 ("lastResult={won,stars,firstClear,reward:awardStage(won,firstClear)};", "lastResult={won,stars,firstClear,...(isTime?finishChallenge():{reward:awardStage(won,firstClear)})};if(isTime&&state.challenge)data.partner=state.challenge.oldPartner;"),
 ("if(pause&&state.active){state.paused=true;", "if(pause&&state.active){challengeInterrupt('本局已暂停，');state.paused=true;"),
 ("if(state.mode==='time'&&!state.practice){state.remaining=Math.max(0,state.remaining-elapsed);", "if(state.mode==='time'&&!state.practice){if(state.challenge)state.challenge.activeMs+=Math.min(state.remaining,elapsed);state.remaining=Math.max(0,state.remaining-elapsed);"),
 ("engine.pool=old.pool;", "engine.pool=old.pool;engine.rng=old.rng||Math.random;")
])
edit('src/game-flow.js',[
 ("if(renderPrologue(next,screen))return true;", "if(renderChallenge(next,screen))return true;\n if(renderPrologue(next,screen))return true;"),
 ("const p=preparation;if(!p)return;", "const p=preparation;if(!p)return;if(p.mode==='time'){showChallengePreparation();return;}"),
 ("if(handleAdAction(b))return true;", "if(handleChallengeAction(b))return true;\n if(handleAdAction(b))return true;"),
 ("v41 · 72关", "v42 · 72关")
])
edit('src/taptap-cloud-ui.js',[("<p>试玩记录默认关闭，不自动上传。", "<p>挑战奖励领取状态随进度保存，恢复备份会保留本机已领次数。主动连接周赛时读取平台周期；点击提交成绩时，向 TapTap 上传本局分数并以 TapTap 账号公开展示排名。不开启好友关系权限。旧纪录、伙伴练习和恢复的对局不上传。</p><p>试玩记录默认关闭，不自动上传。")])
edit('scripts/build-game.cjs',[("fs.readFileSync('src/first-chapter.js','utf8')+'\\n'+", "fs.readFileSync('src/first-chapter.js','utf8')+'\\n'+fs.readFileSync('src/difficulty-bridge.js','utf8')+'\\n'+fs.readFileSync('src/weekly-challenge.js','utf8')+'\\n'+"),
 ("fs.readFileSync('src/ad-economy.css','utf8')", "fs.readFileSync('src/ad-economy.css','utf8')+'\\n'+fs.readFileSync('src/weekly-challenge.css','utf8')")])
p=root/'config/release.json';cfg=json.loads(p.read_text(encoding='utf-8'));cfg['build']='v42-weekly-challenge';cfg['weeklyLeaderboard']={'id':'','rulesVersion':'weekly-v1','period':'weekly','scorePolicy':'best','order':'descending','status':'awaiting-platform-configuration'};p.write_text(json.dumps(cfg,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for source,target in [('scripts/package-to-be-continued.cjs','scripts/package-weekly-challenge.cjs'),('scripts/zip-to-be-continued.py','scripts/zip-weekly-challenge.py')]:
    s=(root/source).read_text(encoding='utf-8').replace('to-be-continued','weekly-challenge').replace('v41','v42');(root/target).write_text(s,encoding='utf-8')
print('v42 source changes written; no tests run.')
