from pathlib import Path
r=Path(__file__).resolve().parent.parent
p=r/'src/appScript.js';s=p.read_text(encoding='utf-8')
s=s.replace("data.snapshot={rulesVersion:1,", "data.snapshot={rulesVersion:1,pool:[...engine.pool],")
s=s.replace("setupChallenge(saved,loadout);", "setupChallenge(saved,loadout);\n  if(saved?.rulesVersion===1&&Array.isArray(saved.pool)&&saved.pool.length>=4&&saved.pool.length<=7&&saved.pool.every(k=>Number.isInteger(k)&&k>=0&&k<=6))engine.pool=[...new Set(saved.pool)];")
s=s.replace("'挑战最佳 · '+data.bestTime.toLocaleString()+' 星光'", "'本周最佳 · '+challengeProgress().best.toLocaleString()+' 星光'")
p.write_text(s,encoding='utf-8')
p=r/'src/release-ops.js';s=p.read_text(encoding='utf-8').replace("partner:trialBackup?trialBackup.partner:data.partner", "partner:trialBackup?trialBackup.partner:state.challenge?.oldPartner??data.partner");p.write_text(s,encoding='utf-8')
print('Round pool and selected story companion preserved.')
