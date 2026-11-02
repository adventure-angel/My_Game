// Inserted into the existing application closure for the platform candidate only.
let tapCloudItems=[],tapCloudPreview=null,tapCloudView=0;
function tapCloudDate(entry){const stamp=Number(String(entry.name||'').split('_')[3]);return Number.isFinite(stamp)&&stamp>0?new Date(stamp).toLocaleString('zh-CN'):'云端备份';}
function tapCloudSafe(){return !state.active&&!state.trial&&!StarCandySave.blocked&&['saved','ready'].includes(StarCandySave.status);}
function showTapCloudCenter(note=''){
 tapCloudView++;tapCloudPreview=null;
 releasePanel('TapTap 云备份','<p>将普通进度备份到当前 TapTap 账号，换设备后可选择恢复。每次创建独立快照，不覆盖旧云档；不会合并两份金币或奖励。</p>'+(note?'<p id="tapCloudStatus" role="status">'+releaseEsc(note)+'</p>':'')+'<div class="release-status"><b>'+releaseSummary(data)+'</b><p>'+(StarCandyCloud.available()?'已检测到平台接口，实际读写状态以下方操作结果为准。':'当前没有 TapTap 云存档环境。请从 TapTap 测试入口打开；在这里仍可使用本地备份。')+'</p></div><p>上传内容包括关卡、金币、钻石、全部已解锁伙伴（含绯镜）、道具与小屋布置。请用v33或更新版本恢复新版备份。</p><div class="release-actions"><button class="primary" data-action="tapCloudUploadAsk" '+(!StarCandyCloud.available()||!tapCloudSafe()||StarCandyCloud.busy?'disabled':'')+'>备份当前进度</button><button class="secondary" data-action="tapCloudList" '+(!StarCandyCloud.available()||StarCandyCloud.busy?'disabled':'')+'>刷新云端列表</button></div>'+(!tapCloudSafe()?'<p>请先结束当前对局或伙伴练习，并处理本地保存提示，再上传或恢复。</p>':'')+'<div id="tapCloudList"></div><p class="release-muted">第一阶段为手动云备份联调版，不会自动同步；平台存档数量和频率受限。删除旧快照请使用平台存档管理。本机备份功能仍然保留。</p><button class="secondary" data-action="saveCenter">本地存档与备份</button>');
}
async function tapCloudList(){
 showTapCloudCenter('正在读取当前账号的云存档…');const view=tapCloudView;
 try{const result=await StarCandyCloud.list();if(view!==tapCloudView||!$('tapCloudList'))return;tapCloudItems=result.items.slice(0,20);
  if($('tapCloudStatus'))$('tapCloudStatus').textContent=result.pending?'云端列表已更新；上次上传仍需核对。':'云端列表已更新，共 '+result.items.length+' 份备份。';
  $('tapCloudList').innerHTML='<h3>云端快照</h3>'+(result.recovered?'<p>上次上传已在云端找到并完成读回核对。</p>':'')+(result.pending?'<p>上次上传仍在核对中，请稍后刷新。</p>':'')+(tapCloudItems.length?tapCloudItems.map((x,i)=>'<button class="secondary" data-action="tapCloudPreview" data-index="'+i+'">'+releaseEsc(x.summary||'星糖物语云备份')+'<small>'+releaseEsc(tapCloudDate(x))+'</small></button>').join(''):'<p>当前账号还没有本版本创建的云备份。</p>')+(result.items.length>20?'<p>显示最近20份快照。</p>':'');
 }catch(e){if(view===tapCloudView&&$('tapCloudList')){if($('tapCloudStatus'))$('tapCloudStatus').textContent='云端列表读取未完成。';$('tapCloudList').textContent=e.message;}}
}
async function tapCloudUpload(){
 if(!tapCloudSafe()){toast('请先完成对局并处理本地保存提示');return;}
 const payload=portableSave();showTapCloudCenter('正在上传并从云端读回核对，请保持页面打开…');const view=tapCloudView;
 try{await StarCandyCloud.create(payload);if(view===tapCloudView&&$('tapCloudList'))showTapCloudCenter('当前进度已上传，并成功从云端读回核对。你可以在另一台设备刷新云端列表。');}
 catch(e){if(view===tapCloudView&&$('tapCloudList'))showTapCloudCenter(e.message);}
}
async function tapCloudPreviewEntry(index){
 const entry=tapCloudItems[index];if(!entry||!tapCloudSafe())return toast('请先完成对局并处理本地保存提示');
 const expectedRaw=StarCandySave.currentRaw();if(expectedRaw===undefined)return toast('暂不能安全读取本地存档，请先导出备份。');
 showTapCloudCenter('正在下载快照，当前本地进度保持不变…');const view=tapCloudView;
 try{const value=await StarCandyCloud.read(entry);if(view!==tapCloudView||!$('tapCloudList'))return;
  if(!tapCloudSafe()||StarCandySave.currentRaw()!==expectedRaw)throw Error('本地进度已变化，请重新预览云档。');
  const payload=normalizeImported(value.payload,{legacyStripped:value.schema===1});tapCloudPreview={payload,expectedRaw};
  releasePanel('选择恢复这份云备份？','<div class="release-compare"><div><small>当前设备</small><b>'+releaseSummary(data)+'</b></div><div><small>云端备份</small><b>'+releaseSummary(payload)+'</b></div></div><p>备份时间：'+releaseEsc(value.createdAt)+'</p><p>确认后替换普通进度，不叠加奖励。当前本地记录保留为「导入前副本」，未完成的棋盘不恢复。新版恢复包含两种货币与全部伙伴；旧版快照缺失的钻石及装饰保留本机记录。</p><button class="primary" data-action="tapCloudApply">恢复并重新打开游戏</button><button class="secondary" data-action="tapCloudCenter">取消，保留本地进度</button>');
 }catch(e){if(view===tapCloudView&&$('tapCloudList'))showTapCloudCenter(e.message);}
}
function handleTapCloudAction(b){
 switch(b.dataset.action){
 case 'tapCloudCenter':showTapCloudCenter();return true;
 case 'tapCloudList':tapCloudList();return true;
 case 'tapCloudUploadAsk':if(!tapCloudSafe())return true;tapCloudView++;releasePanel('备份到当前 TapTap 账号？','<p>'+releaseSummary(data)+'</p><p>将向 TapTap 上传普通游戏进度，创建一份新的云端快照。原有云档和本地记录都保留，金币、钻石和全部伙伴会一起备份。请确认当前客户端登录的是你要保存到的账号。</p><button class="primary" data-action="tapCloudUpload">确认备份</button><button class="secondary" data-action="tapCloudCenter">取消</button>');return true;
 case 'tapCloudUpload':tapCloudUpload();return true;
 case 'tapCloudPreview':tapCloudPreviewEntry(Number(b.dataset.index));return true;
 case 'tapCloudApply':{
  const preview=tapCloudPreview;if(!preview||!tapCloudSafe())return true;
  if(!StarCandySave.replace(preview.payload,preview.expectedRaw)){tapCloudPreview=null;showTapCloudCenter('本地进度发生变化或保存失败，没有覆盖；请重新预览。');return true;}
  StarCandySave.blocked=true;state.active=false;state.epoch++;tapCloudPreview=null;location.reload();return true;
 }
 }
 return false;
}
function showTapCloudPrivacy(){releasePanel('隐私与试玩说明','<p>星糖物语 · 免费游玩与自愿广告补给</p><p>本版本没有人民币商品。'+(StarCandyRelease.ads?'只有主动点击视频补给才向 TapTap 请求激励视频。完整观看后领取奖励，提前关闭或播放失败不发奖。':'视频接口已准备，后台开通与广告位配置完成前不加载广告、不发放广告奖励。')+'</p><p>进度默认保存在当前浏览器。主动确认云备份时，才向当前 TapTap 账号上传关卡、金币、钻石、伙伴、道具、小屋布置与广告领取记录；主动读取时从平台下载。普通浏览器没有平台环境时仍可导出本地备份。</p><p>领取记录和视频完成后的待保存凭据存放在本机，用于避免重复发奖。恢复备份时保留本机已使用的广告次数；此版本不是服务端统一计次，也不自动合并设备余额。</p><p>挑战奖励领取状态随进度保存，恢复备份会保留本机已领次数。主动连接周赛时读取平台周期；点击提交成绩时，向 TapTap 上传本局分数并以 TapTap 账号公开展示排名。不开启好友关系权限。旧纪录、伙伴练习和恢复的对局不上传。</p><p>试玩记录默认关闭，不自动上传。换账号前请关闭游戏，重新从平台进入并核对云端列表。含广告领取记录的备份请使用v34或更新版本恢复。</p><p>本说明用于当前开发测试；客服邮箱：1416303829@qq.com。正式发布前仍需补齐运营主体及正式隐私政策。广告仍需完成手机真实播放、取消及发奖联调。</p><button class="secondary" data-action="tapCloudCenter">云备份</button><button class="secondary" data-action="saveCenter">本地备份</button>');}
