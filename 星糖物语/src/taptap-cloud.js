// TapTap native bridge only. Manual append-only snapshots; no commercial ledger.
const StarCandyCloud=(()=>{
 const PREFIX='star_candy_v1_',FORMAT='star-candy-cloud-progress',KEY='starCandy.cloud.transfer.v1';
 let busy=false,uncertain=false;
 function error(message,code){return Object.assign(new Error(message),{code});}
 function bridge(){
  const tap=globalThis.tap;
  if(!tap||typeof tap.getCloudSaveManager!=='function'||typeof tap.getFileSystemManager!=='function'||!tap.env?.USER_DATA_PATH)throw error('请在 TapTap 客户端的游戏测试入口使用云备份；普通浏览器仍可本地保存。','environment');
  const cloud=tap.getCloudSaveManager(),fs=tap.getFileSystemManager();
  for(const m of ['getArchiveList','createArchive','getArchiveData'])if(typeof cloud?.[m]!=='function')throw error('当前 TapTap 环境缺少云存档能力，请更新客户端后重试。','environment');
  return {cloud,fs,base:tap.env.USER_DATA_PATH};
 }
 function message(e){
  const code=Number(e?.errno??e?.errCode);
  return ({400001:'操作太频繁，请至少等待一分钟再备份。',400003:'云存档数量已达平台上限，请先在平台管理旧存档。',400005:'云存储空间不足，请先在平台管理旧存档。',400007:'平台正在处理另一个存档请求，请稍后刷新列表。',400100:'云存档尚未初始化，请检查 TapTap 登录与客户端版本。',400002:'这份云存档已经变化或不存在，请刷新列表。'})[code]||'平台请求未完成，请检查网络和 TapTap 登录后刷新列表。本地存档没有被覆盖。';
 }
 function invoke(target,method,args={}){
  return new Promise((resolve,reject)=>{
   let settled=false;
   const done=(fn,value)=>{if(settled)return;settled=true;clearTimeout(timer);fn(value);};
   const timer=setTimeout(()=>done(reject,error('平台响应超时；请先刷新列表核对结果，不要立即重复上传。','timeout')),30000);
   try{const p=target[method]({...args,success:r=>done(resolve,r),fail:e=>done(reject,error(message(e),'platform'))});if(p&&typeof p.then==='function')p.then(r=>done(resolve,r),e=>done(reject,error(message(e),'platform')));}
   catch(e){done(reject,error(message(e),'platform'));}
  });
 }
 async function exclusive(fn){if(busy)throw error('已有云存档操作进行中，请等待结果。','busy');busy=true;try{return await fn();}finally{busy=false;}}
 function readRecord(){try{const r=JSON.parse(localStorage.getItem(KEY)||'null');return r&&Number.isFinite(r.at)?r:null;}catch(_){return null;}}
 function writeRecord(r){try{localStorage.setItem(KEY,JSON.stringify(r));}catch(_){}}
 async function listWith(b){
  const res=await invoke(b.cloud,'getArchiveList');
  if(!Array.isArray(res?.saves))throw error('平台返回的存档列表格式无法识别，暂不执行上传或恢复。','schema');
  return res.saves.filter(s=>typeof s.name==='string'&&s.name.startsWith(PREFIX)&&typeof s.uuid==='string'&&typeof s.fileId==='string').sort((a,b)=>b.name.localeCompare(a.name));
 }
 async function downloadWith(b,entry){
  const result=await invoke(b.cloud,'getArchiveData',{archiveUUID:entry.uuid,archiveFileId:entry.fileId});
  if(typeof result?.filePath!=='string')throw error('云端下载没有返回文件路径。','schema');
  const file=await invoke(b.fs,'readFile',{filePath:result.filePath,encoding:'utf8'});
  if(typeof file?.data!=='string'||new TextEncoder().encode(file.data).length>262144)throw error('云存档内容超出支持范围，本地进度没有改动。','schema');
  let value;try{value=JSON.parse(file.data);}catch(_){throw error('云存档内容无法解析，本地进度没有改动。','schema');}
  if(value?.format!==FORMAT||!((value.schema===1&&value.scope==='ordinary-progress-only')||(value.schema===2&&value.scope==='free-economy-progress'))||typeof value.operation!=='string'||!StarCandySaveStore.parse(JSON.stringify(value.payload)))throw error('这份云存档版本不受支持，本地进度没有改动。','schema');
  return value;
 }
 async function list(){return exclusive(async()=>{
  const b=bridge(),items=await listWith(b),record=readRecord();let recovered=false;
  if(record?.pending){const item=items.find(s=>s.name===record.name);
   if(item){const value=await downloadWith(b,item);if(value.operation!==record.operation)throw error('上次上传记录不一致，请保留本地备份。','verify');writeRecord({...record,pending:false});recovered=true;uncertain=false;}
   else if(Date.now()-record.at>120000){writeRecord({...record,pending:false});uncertain=false;}
  }else uncertain=false;
  return {items,recovered,pending:!!readRecord()?.pending};
 });}
 async function read(entry){return exclusive(async()=>{
  const b=bridge(),items=await listWith(b),current=items.find(s=>s.uuid===entry.uuid&&s.fileId===entry.fileId);
  if(!current)throw error('这份云存档已变化，请刷新列表再选。','changed');
  return downloadWith(b,current);
 });}
 async function create(payload){return exclusive(async()=>{
  const b=bridge(),record=readRecord();
  if(uncertain||record?.pending)throw error('上次上传结果还没有核实，请先刷新云端列表。','pending');
  if(record&&Date.now()-record.at<61000)throw error('两次云备份至少间隔一分钟，请稍后再试。','cooldown');
  if(!StarCandySaveStore.parse(JSON.stringify(payload)))throw error('本地进度格式异常，请先导出备份。','schema');
  const safe=JSON.parse(JSON.stringify(payload));delete safe._local;safe.snapshot=null;
  safe.monthCard={version:1,startsAt:0,expiresAt:0,claimedDays:[]};
  const operation=globalThis.crypto?.randomUUID?.()||Date.now()+'_'+Math.random().toString(36).slice(2),at=Date.now(),name=PREFIX+at+'_'+operation.replace(/[^a-zA-Z0-9]/g,'').slice(-8);
  const value={format:FORMAT,schema:2,scope:'free-economy-progress',build:'v34-rewarded-ads',operation,createdAt:new Date(at).toISOString(),payload:safe};
  const content=JSON.stringify(value);if(new TextEncoder().encode(content).length>262144)throw error('存档超过256 KB，暂不能上传。','schema');
  // Read before creating, but never update/delete another device's snapshot.
  await listWith(b);
  const filePath=b.base+'/star_candy_cloud_upload.json';await invoke(b.fs,'writeFile',{filePath,data:content,encoding:'utf8'});
  writeRecord({at,name,operation,pending:true});uncertain=true;
  const receipt=await invoke(b.cloud,'createArchive',{archiveFilePath:filePath,archiveMetaData:{name,summary:'星糖物语 · 已通关 '+safe.stars.filter(Boolean).length+'/'+safe.stars.length,extra:JSON.stringify({format:FORMAT,schema:2,operation})}});
  if(typeof receipt?.uuid!=='string'||typeof receipt?.fileId!=='string')throw error('平台返回的上传结果尚不能确认，请刷新云端列表。','schema');
  const echoed=await downloadWith(b,receipt);
  if(echoed.operation!==operation||JSON.stringify(echoed.payload)!==JSON.stringify(safe))throw error('云端读回校对未通过，请保留本地备份并刷新列表。','verify');
  writeRecord({at,name,operation,pending:false});uncertain=false;
  return {uuid:receipt.uuid,fileId:receipt.fileId,createdAt:value.createdAt};
 });}
 return {get busy(){return busy;},available(){try{bridge();return true;}catch(_){return false;}},list,read,create};
})();
