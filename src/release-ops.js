// Settings-only tools for the independent H5 playtest. All data stays on this device.
let releaseImport=null,releaseExportText='',releaseExportName='',releaseRun=null,releaseTrialRun=null,releaseLastTick=performance.now(),releaseIssue='';
const releaseEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const releaseStatusText=()=>({ready:'尚未开始 · 本机保存',saved:'已保存到当前浏览器',unavailable:'保存失败 · 当前进度仅在本次页面中',damaged:'存档无法读取 · 原文件已保护',conflict:'其他窗口已更新进度 · 已停止覆盖',invalid:'本次存档格式异常 · 原记录已保留'}[StarCandySave.status]||'本机保存');
function releaseButtons(){return '<div class="release-settings"><button class="secondary" data-action="tapCloudCenter">TapTap 云备份<small>手动备份与恢复</small></button><button class="secondary" data-action="saveCenter">存档与备份 <small>'+releaseStatusText()+'</small></button><button class="secondary" data-action="supportCenter">联系客服</button><button class="secondary" data-action="playtestCenter">试玩记录与反馈</button><button class="text-button" data-action="releasePrivacy">隐私与试玩说明</button></div>';}
function showSupportCenter(){
 const email=StarCandyRelease.support.email;
 releasePanel('联系客服','<p>遇到卡关、存档或广告问题，可以发邮件告诉我们。</p><p style="overflow-wrap:anywhere;user-select:text"><strong>'+releaseEsc(email)+'</strong></p><button class="primary" data-action="supportCopy">复制客服邮箱</button><p>请附上游戏版本、手机型号、问题截图和出现问题前的操作。不要发送密码、验证码或身份证件。</p><p class="release-muted">当前版本：'+releaseEsc(StarCandyRelease.build)+'</p>');
}
function releaseSummary(p){return '已通关 '+p.stars.filter(Boolean).length+'/'+levels.length+' · '+p.stars.reduce((a,b)=>a+b,0)+' 星章 · '+(p.economy?.coins||0)+' 金币 · '+(p.economy?.diamonds||0)+' 钻石';}
function releasePanel(title,body){showDialog('<section class="release-panel"><header><small>STAR CANDY · PLAYTEST</small><h2 id="dialogTitle">'+title+'</h2></header><div class="release-scroll">'+body+'</div></section>');}
function showSaveCenter(){
 const backups=StarCandySave.backups(),problem=!['saved','ready'].includes(StarCandySave.status);
 releasePanel('把心愿好好保存','<div class="release-status '+(problem?'issue':'')+'"><b>'+releaseStatusText()+'</b><p>'+releaseSummary(data)+'</p><small>'+(StarCandySave.lastSavedAt?'上次保存 '+new Date(StarCandySave.lastSavedAt).toLocaleString('zh-CN'):'尚无保存时间')+'</small></div><p>存档保存在当前浏览器。清理浏览器或更换文件、设备后可能无法读取；请先导出备份。自动备份也在同一浏览器，不能替代下载备份。</p><div class="release-actions"><button class="primary" data-action="backupExport" '+(state.trial?'disabled':'')+'>导出当前试玩进度</button><button class="secondary" data-action="backupImport" '+(state.trial?'disabled':'')+'>导入备份</button></div>'+(state.trial?'<p>请先退出伙伴练习，再导出或导入旅途进度。</p>':'')+(problem?'<button class="secondary" data-action="saveRetry">重新尝试保存</button><button class="secondary" data-action="saveReloadAsk">读取浏览器里的最新存档</button><button class="text-button" data-action="saveRawExport">导出原始记录，保留排查副本</button>':'')+'<p class="release-muted">请只保留一个游戏窗口。支持写入锁的浏览器会限制为单窗口保存；其他浏览器仅能检测已发生的存档变化。</p><h3>恢复自动备份</h3><p>恢复前会展示内容，不合并金币和奖励。</p>'+backups.map(x=>'<button class="secondary" data-action="backupRestore" data-backup="'+x.id+'">'+({'backup1':'最近备份','backup2':'上一份备份','before-import':'导入前副本'}[x.id])+'<small>'+releaseSummary(x.payload)+'<br>'+(x.payload._local?.savedAt?new Date(x.payload._local.savedAt).toLocaleString('zh-CN'):'旧版存档')+'</small></button>').join('')+(!backups.length?'<p class="release-muted">暂时没有自动备份。正常保存会保留最近两个备份版本。</p>':'')+'<p class="release-muted">新版备份包含金币、钻石、全部已解锁伙伴、道具和小屋布置，恢复整份进度，不相加。旧版备份不含钻石及装饰，这些项目沿用当前设备记录。</p>');
}
function portableSave(){
 const p=JSON.parse(JSON.stringify({...data,partner:trialBackup?trialBackup.partner:state.challenge?.oldPartner??data.partner}));
 delete p._local;p.monthCard=normalizeMonthCard();return p;
}
function showExport(text,name,title='备份已准备好'){
 releaseExportText=text;releaseExportName=name;
 releasePanel(title,'<p>可以保存文件，或复制下面的文字。下载是否完成以手机浏览器的提示为准。</p><div class="release-actions"><button class="primary" data-action="releaseDownload">保存文件</button><button class="secondary" data-action="releaseCopy">复制全部</button></div><textarea id="releaseExport" readonly aria-label="可复制的导出内容" spellcheck="false"></textarea><p class="release-muted">自行保管备份。反馈报告与存档备份是不同文件；向别人反馈问题时优先发送不含完整存档的试玩报告。</p>');
 $('releaseExport').value=text;
}
function exportBackup(){
 if(state.trial){toast('先退出伙伴练习再备份');return;}
 snapshot();const file={format:'star-candy-playtest-backup',schema:2,build:StarCandyRelease.build,createdAt:new Date().toISOString(),scope:'free-economy-progress',payload:portableSave()};
 StarCandyPlaytest.record('backup_export');showExport(JSON.stringify(file,null,2),'star-candy-backup-'+localDay()+'.json');
}
function showImport(){
 if(state.trial){toast('先退出伙伴练习再导入');return;}
 releaseImport=null;releasePanel('导入试玩备份','<p>选择本游戏导出的 JSON 文件，或粘贴备份内容。下一步先预览，不会立即覆盖当前进度。</p><label class="release-file">选择备份文件<input id="backupFile" type="file" accept="application/json,.json"></label><textarea id="backupText" aria-label="粘贴备份内容" placeholder="粘贴备份 JSON" maxlength="262144" spellcheck="false"></textarea><button class="primary" data-action="backupPreview">查看备份内容</button><p id="backupError" role="status"></p>');
 $('backupFile').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>262144){$('backupError').textContent='文件超过256 KB，不能作为本游戏存档导入。';return;}try{const text=await file.text();if($('backupText'))$('backupText').value=text;}catch(_){if($('backupError'))$('backupError').textContent='文件读取失败，请尝试粘贴备份文字。';}});
}
function normalizeImported(raw,{legacyStripped=false}={}){
 if(!StarCandySaveStore.parse(JSON.stringify(raw)))throw Error('这不是受支持的星糖物语存档，当前记录没有改动。');
 const current=data,old=raw.stars.length===12;
 const p={...defaults,stars:(old?raw.stars.flatMap(n=>[n,n,n]):[...raw.stars]).concat(Array(levels.length).fill(0)).slice(0,levels.length),prologueSeen:true,partner:0,snapshot:null};
 p.unlocked=1;for(let i=0;i<p.stars.length;i++){if(!p.stars[i])break;p.unlocked=Math.min(levels.length,i+2);}
 for(const k of ['music','sound','motion','vibration','prologueSeen'])if(typeof raw[k]==='boolean')p[k]=raw[k];
 p.bestTime=Number.isSafeInteger(raw.bestTime)&&raw.bestTime>=0?Math.min(1e9,raw.bestTime):0;
 try{
  // Normalizers read ownership from data.stars; restore the live reference even on failure.
  data=p;p.economy=normalizeEconomy(raw.economy);
  // Restoring older progress must not reset already used local ad quotas.
  p.economy.challenge=mergeChallenge(p.economy.challenge,current.economy.challenge);
  p.economy.adSupply=mergeAdLedger(p.economy.adSupply,current.economy.adSupply);
  p.economy.mirrorAdViews=Math.min(2,Math.max(p.economy.mirrorAdViews||0,current.economy.mirrorAdViews||0,p.economy.adSupply.receipts.filter(r=>r.offer==='mirror').length));
  if(p.economy.mirrorAdViews===2&&!p.economy.ownedPartners.includes(4))p.economy.ownedPartners.push(4);
  // Pre-v33 backups stripped premium fields; don't erase current free assets with those placeholders.
  if(legacyStripped&&raw.economy?.version!==3){
   const completed=Array.from({length:levels.length/3},(_,g)=>g).filter(g=>p.stars.slice(g*3,g*3+3).every(Boolean));
   const claims=new Set(current.economy.milestoneClaims||[]);
   p.economy.diamonds=current.economy.diamonds+completed.filter(g=>!claims.has(g)).length*5;
   p.economy.milestoneClaims=[...new Set([...claims,...completed])];
   p.economy.milestoneRate=5;
   p.economy.decor=[...current.economy.decor];p.economy.activeDecor=[...current.economy.activeDecor];
   if(current.economy.ownedPartners.includes(4)&&!p.economy.ownedPartners.includes(4))p.economy.ownedPartners.push(4);
  }
  p.monthCard=normalizeMonthCard();p.stamina=normalizeStamina(raw.stamina);
  p.partner=[0,1,2,3,4].includes(raw.partner)&&p.economy.ownedPartners.includes(raw.partner)?raw.partner:0;
  p.home=normalizeHome(raw.home);
  const pending=[normalizeWeeklyPending(raw.weeklyPending),normalizeWeeklyPending(current.weeklyPending)].filter(Boolean);
  p.weeklyPending=pending.sort((a,b)=>Number(b.period.split('-')[1])-Number(a.period.split('-')[1])||b.score-a.score)[0]||null;
 }finally{data=current;}
 return p;
}
function previewImport(text,from='file'){
 try{
  if(text.length>262144)throw Error('文件超过256 KB。');let obj=JSON.parse(text),raw=obj;
  if(obj?.format){if(obj.format!=='star-candy-playtest-backup'||![1,2].includes(obj.schema))throw Error('备份版本不受支持，请使用对应版本打开。');raw=obj.payload;}
  const p=normalizeImported(raw,{legacyStripped:obj?.format==='star-candy-playtest-backup'&&obj.schema===1}),expected=StarCandySave.currentRaw();if(expected===undefined)throw Error('当前浏览器无法读取存储，暂不能安全替换存档。请先导出当前进度。');
  releaseImport={payload:p,expectedRaw:expected};
  releasePanel('确认恢复这份进度','<div class="release-compare"><div><small>现在</small><b>'+releaseSummary(data)+'</b></div><div><small>恢复后</small><b>'+releaseSummary(p)+'</b></div></div><p>将替换关卡、金币、钻石、伙伴、道具和小屋布置，不会叠加两份奖励。未完成的棋盘不导入；恢复后从关卡准备继续，开始新局按正常规则消耗体力。</p><p>旧版备份未携带的钻石及装饰保留本机记录。当前磁盘记录会保留为「导入前副本」。</p><button class="primary" data-action="backupApply">确认替换并重新打开游戏</button><button class="secondary" data-action="saveCenter">取消，保留现在的进度</button>');
 }catch(e){toast(e instanceof SyntaxError?'备份内容不是有效 JSON，原存档没有改动。':e.message);if($('backupError'))$('backupError').textContent=e instanceof SyntaxError?'JSON 格式错误，原存档没有改动。':e.message;}
}
function showPlaytestCenter(){
 const report=StarCandyPlaytest.report(),count=name=>report.events.filter(e=>e.name===name&&!e.props.trial).length;
 releasePanel('试玩记录与反馈','<div class="release-status"><b>只在本机记录 · 不自动上传</b><p>帮助回看在哪一关卡住、是否使用技能、有没有点亮夜灯。你可以自由选择，关闭不影响游戏。</p><button class="secondary" data-action="playtestToggle">'+(StarCandyPlaytest.enabled?'关闭并清除记录':'开启本机试玩记录')+'</button></div><p>开启后记录关卡开始/结果、页面去向、技能与摆放、错误类别；不记录姓名、账号、完整棋盘、地址或错误原文。最多保留7天、300条。</p><div class="release-stats"><span>开始新局<b>'+count('level_start')+'</b></span><span>完成结算<b>'+count('level_end')+'</b></span><span>记录条数<b>'+report.events.length+'</b></span></div><p class="release-muted">只是这台设备的片段，不能当成所有玩家的通关率或留存率。切后台/离开与失败分开记录。'+(!StarCandyPlaytest.storageOK?'浏览器未能保存记录，当前报告可能仅在本次页面有效。':'')+'</p><button class="primary" data-action="playtestExport">查看并导出反馈报告</button><button class="secondary" data-action="playtestClear">清空本机记录</button><details><summary>最近的记录</summary><ol class="release-events">'+report.events.slice(-20).reverse().map(e=>'<li>'+new Date(e.at).toLocaleTimeString('zh-CN')+' · '+releaseEsc(e.name)+(e.props.level?' · 第'+e.props.level+'关':'')+'</li>').join('')+'</ol></details><p>客服邮箱：1416303829@qq.com。遇到问题时，可将报告和截图发至客服邮箱，并说明最后做了哪一步。</p>');
}
function showReleasePrivacy(){showTapCloudPrivacy();}

function handleReleaseAction(b){
 if(handleTapCloudAction(b))return true;
 const a=b.dataset.action;
 switch(a){
 case 'supportCenter':showSupportCenter();return true;
 case 'supportCopy':{const email=StarCandyRelease.support.email;if(navigator.clipboard?.writeText)navigator.clipboard.writeText(email).then(()=>toast('客服邮箱已复制')).catch(()=>toast('请长按邮箱地址复制'));else toast('请长按邮箱地址复制');return true;}
 case 'saveCenter':showSaveCenter();return true;
 case 'backupExport':exportBackup();return true;
 case 'backupImport':showImport();return true;
 case 'backupPreview':previewImport($('backupText')?.value||'');return true;
 case 'backupRestore':{if(state.trial){toast('请先退出伙伴练习');return true;}const item=StarCandySave.backups().find(x=>x.id===b.dataset.backup);if(item)previewImport(item.raw,'backup');return true;}
 case 'backupApply':{
  if(!releaseImport||state.trial)return true;const p=releaseImport;
  if(!StarCandySave.replace(p.payload,p.expectedRaw)){releaseImport=null;showSaveCenter();toast('未覆盖存档，请查看保存状态并重新预览备份。');return true;}
  StarCandyPlaytest.record('backup_import');StarCandySave.blocked=true;state.active=false;state.epoch++;releaseImport=null;location.reload();return true;
 }
 case 'saveRetry':if(StarCandySave.retry()&&persist())toast('已重新保存');else toast('暂未保存，请先导出备份或读取最新存档。');showSaveCenter();return true;
 case 'saveReloadAsk':releasePanel('读取最新存档？','<p>重新打开会放弃本页面中尚未保存的变化。建议先导出当前进度，再读取其他窗口已保存的记录。</p><button class="secondary" data-action="backupExport">先导出当前进度</button><button class="primary" data-action="saveReload">重新打开并读取</button>');return true;
 case 'saveReload':state.active=false;state.epoch++;StarCandySave.blocked=true;location.reload();return true;
 case 'saveRawExport':{const raw=StarCandySave.currentRaw();if(raw===undefined||raw===null)toast('没有可读取的原始记录');else showExport(raw,'star-candy-original-record.txt','原始记录副本');return true;}
 case 'releaseDownload':{const url=URL.createObjectURL(new Blob([releaseExportText],{type:'application/json;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download=releaseExportName;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);toast('已请求下载；若手机未保存，请用复制全部。');return true;}
 case 'releaseCopy':{const area=$('releaseExport');if(area){area.focus();area.select();}if(navigator.clipboard?.writeText)navigator.clipboard.writeText(releaseExportText).then(()=>toast('已复制')).catch(()=>toast('请长按文字，选择全选并复制。'));else toast('请长按文字，选择全选并复制。');return true;}
 case 'playtestCenter':showPlaytestCenter();return true;
 case 'playtestToggle':StarCandyPlaytest.toggle();showPlaytestCenter();return true;
 case 'playtestClear':StarCandyPlaytest.clear();showPlaytestCenter();toast('本机试玩记录已清空');return true;
 case 'playtestExport':showExport(JSON.stringify({...StarCandyPlaytest.report(),diagnostics:{saveStatus:StarCandySave.status,viewport:{width:Math.round(innerWidth),height:Math.round(window.visualViewport?.height||innerHeight)},completedLevels:data.stars.filter(Boolean).length,roomItems:data.home.seen.length,lightOn:data.home.lamp===true}},null,2),'star-candy-feedback-'+localDay()+'.json','试玩反馈报告');return true;
 case 'releasePrivacy':showReleasePrivacy();return true;
 }
 return false;
}
function releaseRoundStart(saved){
 if(state.trial)releaseTrialRun=releaseRun;
 else if(releaseRun&&!releaseRun.ended)StarCandyPlaytest.record('level_leave',{...releaseRun.props,reason:'new_round',durationSec:releaseRun.seconds});
 const run=globalThis.crypto?.randomUUID?.()||('run-'+Date.now());releaseRun={props:{run,level:state.level+1,partner:data.partner,mode:state.mode,trial:state.trial===true,resumed:!!saved},seconds:0,ended:false};
 StarCandyPlaytest.record(saved?'level_resume':'level_start',releaseRun.props);
}
function releaseAfterTrial(){releaseRun=releaseTrialRun;releaseTrialRun=null;releaseLastTick=performance.now();}
function releaseRoundEnd(won,stars,firstClear){if(!releaseRun||releaseRun.ended)return;releaseRun.ended=true;StarCandyPlaytest.record('level_end',{...releaseRun.props,won,stars,firstClear,score:state.score,moves:state.moves,durationSec:releaseRun.seconds});}
function releaseRoute(next){
 if(next===route)return;
 if(route==='game'&&state.active&&next!=='result'&&releaseRun)StarCandyPlaytest.record('level_leave',{...releaseRun.props,reason:'navigation',durationSec:releaseRun.seconds});
 StarCandyPlaytest.record('route_view',{route:next});
}
function installReleaseOps(){
 const notice=document.createElement('button');notice.id='saveNotice';notice.dataset.action='saveCenter';notice.hidden=true;document.body.append(notice);
 const update=()=>{storageOK=['ready','saved'].includes(StarCandySave.status);notice.hidden=storageOK;notice.textContent=releaseStatusText()+' · 查看';if(!storageOK&&releaseIssue!==StarCandySave.status){releaseIssue=StarCandySave.status;StarCandyPlaytest.record('save_issue',{code:StarCandySave.status});}};
 window.addEventListener('starcandy-storage-status',update);update();
 StarCandySave.onReady=()=>{if(!StarCandySave.blocked)persist();update();};
 if(StarCandySave.lockMode==='compare-only')notice.title='此浏览器不支持多窗口写入锁，请只保留一个游戏页面。';
 setInterval(()=>{const now=performance.now();if(releaseRun&&!releaseRun.ended&&state.active&&!state.paused&&!document.hidden)releaseRun.seconds+=Math.min(2,(now-releaseLastTick)/1000);releaseLastTick=now;},1000);
 document.addEventListener('visibilitychange',()=>StarCandyPlaytest.record(document.hidden?'session_hidden':'session_return',{route,level:state.active?state.level+1:undefined,trial:state.trial===true}));
}
