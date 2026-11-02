// Offline analysis of reports voluntarily exported by players. No network access.
const fs=require('fs'),path=require('path');
const input=process.argv[2];
if(!input){console.error('用法：node scripts/summarize-playtest.cjs <反馈报告目录> [输出目录]');process.exit(1);}
const source=path.resolve(input),out=path.resolve(process.argv[3]||'release/playtest-analysis');
if(!fs.statSync(source).isDirectory())throw Error('请选择报告目录');
const events=new Map();let reports=0,rejected=0,duplicates=0,conflictingIds=0;
for(const entry of fs.readdirSync(source,{withFileTypes:true})){
 if(!entry.isFile()||!entry.name.endsWith('.json'))continue;
 try{
  const file=path.join(source,entry.name);if(fs.statSync(file).size>2*1048576){rejected++;continue;}
  const report=JSON.parse(fs.readFileSync(file,'utf8'));
  if(report.format!=='star-candy-playtest-report'||report.version!==1||!Array.isArray(report.events)||report.events.length>300){rejected++;continue;}
  reports++;
  for(const e of report.events){
   if(!e||typeof e.id!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(e.id)||!Number.isFinite(e.at)||e.at<0||e.at>Date.now()+300000||typeof e.name!=='string')continue;
   if(events.has(e.id)){duplicates++;if(JSON.stringify(events.get(e.id))!==JSON.stringify(e))conflictingIds++;continue;}
   events.set(e.id,e);
  }
 }catch(_){rejected++;}
}
const counts={},starts=new Map(),ends=new Map(),resumed=new Set();
for(const e of events.values()){
 const p=e.props||{};if(p.trial===true)continue;
 if(['session_start','recording_enabled','level_start','level_resume','level_end','level_leave','skill_use','room_place','room_light','room_event','partner_unlock','error','save_issue','prologue_end'].includes(e.name))counts[e.name]=(counts[e.name]||0)+1;
 if(typeof p.run!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(p.run))continue;
 if(e.name==='level_start'&&p.mode==='story'&&Number.isInteger(p.level)&&p.level>=1&&p.level<=36)starts.set(p.run,e);
 if(e.name==='level_resume')resumed.add(p.run);
 if(e.name==='level_end'&&typeof p.won==='boolean')ends.set(p.run,e);
}
const rows=Array.from({length:36},(_,i)=>({level:i+1,newRuns:0,finished:0,won:0,lost:0,withoutRecordedEnd:0,meanFinishedSeconds:null}));
const durations=Array.from({length:36},()=>[]);
for(const [run,e] of starts){if(resumed.has(run))continue;const row=rows[e.props.level-1];row.newRuns++;const end=ends.get(run);
 if(!end||end.at<e.at||end.props.level!==e.props.level){row.withoutRecordedEnd++;continue;}
 row.finished++;if(end.props.won)row.won++;else row.lost++;
 const seconds=end.props.durationSec;if(Number.isFinite(seconds)&&seconds>=0&&seconds<=86400)durations[row.level-1].push(seconds);
}
for(const row of rows){const d=durations[row.level-1];if(d.length)row.meanFinishedSeconds=Math.round(d.reduce((a,b)=>a+b,0)/d.length);}
const summary={format:'star-candy-playtest-summary',version:1,createdAt:new Date().toISOString(),reports,rejected,uniqueEvents:events.size,duplicates,conflictingIds,counts,levels:rows,limits:[
 '报告数量不是独立玩家数；没有账号或跨设备身份，不能据此计算DAU与留存。',
 '默认不记录，开启前事件缺失。每报告最多7天/300条，头尾截断可能导致缺少开局或结算。',
 '排除练习局；关卡表仅按已记录的新开故事局连接结算，恢复局单独计数。',
 '未记录结算不等于失败；导航离开/隐藏不作为失败。没有真实付费或广告收益数据。',
 '同一事件ID出现不同内容时保留首条，并报告冲突数量；反馈文件不是可信服务器账本。'
]};
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));
const keys=Object.keys(rows[0]);fs.writeFileSync(path.join(out,'levels.csv'),'\uFEFF'+keys.join(',')+'\r\n'+rows.map(r=>keys.map(k=>r[k]??'').join(',')).join('\r\n'));
console.log('已汇总 '+reports+' 份报告，去重后 '+events.size+' 条事件。输出：'+out);
