// Client-side supplies, not a server-verified entitlement ledger.
const adSupplyOffers=[
 {id:'coins',name:'旅途金币',icon:'coin',amount:120,unit:'金币',copy:'补充道具，邀请新的同行伙伴。'},
 {id:'diamonds',name:'星愿钻石',icon:'diamond',amount:3,unit:'钻石',copy:'积攒钻石，兑换喜欢的小屋装饰。'}
];
const mirrorAdOffer={id:'mirror',name:'绯镜',amount:0,unit:'次'};
const adPendingKey='starCandy.rewarded.pending.v1';
let adInFlight=false,adPending=null;
function normalizeAdLedger(raw){
 const receipts=(Array.isArray(raw?.receipts)?raw.receipts:[]).filter(r=>r&&typeof r.id==='string'&&r.id.length<=100&&['coins','diamonds','stamina','mirror'].includes(r.offer)&&Number.isSafeInteger(r.at)&&r.at>0&&typeof r.day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(r.day));
 return {receipts:[...new Map(receipts.map(r=>[r.id,{id:r.id,offer:r.offer,at:r.at,day:r.day}])).values()].sort((a,b)=>a.at-b.at).slice(-96)};
}
function mergeAdLedger(a,b){return normalizeAdLedger({receipts:[...(a?.receipts||[]),...(b?.receipts||[])]});}
function mirrorAdProgress(){return Math.min(2,Math.max(data.economy.mirrorAdViews||0,data.economy.adSupply.receipts.filter(r=>r.offer==='mirror').length));}
function readPendingAd(){
 if(!adPending){try{const p=JSON.parse(localStorage.getItem(adPendingKey)||'null');if(p&&normalizeAdLedger({receipts:[p]}).receipts.length)adPending=p;}catch(_){} }
 if(adPending&&data.economy.adSupply.receipts.some(r=>r.id===adPending.id)){adPending=null;try{localStorage.removeItem(adPendingKey);}catch(_){} }
 return adPending;
}
function adLimitReason(offer){
 const receipts=data.economy.adSupply.receipts,today=localDay(),last=receipts[receipts.length-1];
 if(last&&(today<last.day||Date.now()<last.at))return '设备时间发生变化，请校准时间后再来';
 const todayReceipts=receipts.filter(r=>r.day===today);
 if(todayReceipts.length>=6)return '今日6次补给已领完，明天再来';
 if(todayReceipts.filter(r=>r.offer===offer).length>=3)return '这份补给今日已领3次';
 return '';
}
function adSupplyMarkup(){
 const unavailable=StarCandyAds.availability(),pending=readPendingAd();
 return '<div class="ad-supply-intro"><small>DAILY LITTLE GIFTS</small><h3>给旅途一点小小补给</h3><p>自愿看完一段视频后领取。提前关闭或播放失败不发奖励，正常闯关无需看广告。</p><span class="ad-review-status">'+(unavailable||'完整观看后领取 · 每日合计6次')+'</span></div>'+(pending?'<div class="ad-stamina-note"><b>有一份已看完的视频'+(pending.offer==='mirror'?'解锁进度':'奖励')+'等待保存</b><button class="primary" data-action="adRetryGrant">重新保存，无需再看视频</button></div>':'')+'<div class="ad-supply-grid">'+adSupplyOffers.map(p=>{
  const used=data.economy.adSupply.receipts.filter(r=>r.day===localDay()&&r.offer===p.id).length;
  return '<article class="ad-supply-card"><div class="ad-supply-icon">'+lobbyIcon(p.icon)+'</div><div><h3>'+p.name+'</h3><strong>+'+p.amount+' '+p.unit+'</strong><p>'+p.copy+'</p><small>今日已领 '+used+'/3 次</small></div><button class="primary" data-action="adSupply" data-offer="'+p.id+'" '+(unavailable||pending?'disabled':'')+'>'+(unavailable?'暂不可用':'看视频 · 领取补给')+'</button></article>';
 }).join('')+'</div><p class="economy-note">每项每日最多3次，合计最多6次。领完即可选择下一份补给，无额外等待。次数按当前存档和设备日期计算。<button class="text-button" data-action="shop" data-tab="rewards">刷新领取状态</button></p><div class="free-income"><h3>不用看广告，也能慢慢收集</h3><p>首次通关60 / 60 / 90金币；重玩胜利30金币。每完成一组三关收藏，首次额外获得5钻石。累计签到第7次再得5钻石。</p><button class="secondary" data-action="daily">领取每日签到</button></div>';
}
function adStaminaEntry(){return '';}
function adProgress(message){
 showDialog('<h2 id="dialogTitle">视频补给</h2><p role="status">'+message+'</p><p>完整观看后才领取奖励。取消、无可用视频或播放失败均不消耗次数。</p><button class="secondary" data-action="adCancel">取消本次视频</button>');
 const close=dialog.querySelector('.dialog-corner-close');if(close)close.dataset.action='adCancel';
}
function grantPendingAd(){
 const p=readPendingAd();if(!p)return;
 if(state.active||state.trial||StarCandySave.blocked){toast('请先结束对局并处理存档提示，再保存奖励');return;}
 const offer=p.offer==='stamina'?{amount:100,unit:'金币',id:'coins'}:p.offer==='mirror'?mirrorAdOffer:adSupplyOffers.find(o=>o.id===p.offer);if(!offer)return;
 const beforeEconomy=data.economy,beforeStamina=data.stamina,beforeHome=data.home;
 data.economy=JSON.parse(JSON.stringify(beforeEconomy));data.stamina={...beforeStamina};
 let amount=offer.amount,unlockedMirror=false;
 if(p.offer==='mirror'){
  data.economy.mirrorAdViews=Math.min(2,mirrorAdProgress()+1);
  if(data.economy.mirrorAdViews===2&&!data.economy.ownedPartners.includes(4)){
   data.economy.ownedPartners.push(4);unlockedMirror=true;
   data.home=JSON.parse(JSON.stringify(beforeHome));recordRoomNoteSignal('partner',4);
  }
 }else data.economy[offer.id]+=amount;
 data.economy.adSupply=mergeAdLedger(data.economy.adSupply,{receipts:[p]});
 // Wallet and receipt commit together; duplicate callbacks cannot grant twice.
 if(!persist()){
  data.economy=beforeEconomy;data.stamina=beforeStamina;data.home=beforeHome;
  showDialog('<h2 id="dialogTitle">视频已看完，奖励等待保存</h2><p>本次奖励尚未写入存档。请保持页面打开，处理存储问题后重试，无需再看视频。</p><button class="primary" data-action="adRetryGrant">重新保存奖励</button><button class="secondary" data-action="saveCenter">查看存档状态</button>');return;
 }
 adPending=null;try{localStorage.removeItem(adPendingKey);}catch(_){}
 if(p.offer==='mirror'){
  if(unlockedMirror)StarCandyPlaytest.record('partner_unlock',{partner:4,ads:2});
  showPartnerOffer(4);toast(partnerOwned(4)?'绯镜已解锁，可以邀请同行':'已完成 1/2 次，进度已保存');
 }else{showShop('rewards');toast((p.offer==='stamina'?'旧体力补给已转换：':'已领取 ')+amount+' '+offer.unit);}
}
async function requestAdSupply(id){
 if(adInFlight)return;
 const offer=id==='mirror'?mirrorAdOffer:adSupplyOffers.find(o=>o.id===id);if(!offer)return;
 if(id==='mirror'&&partnerOwned(4))return showPartnerOffer(4);
 if(readPendingAd()){grantPendingAd();return;}
 if(state.active||state.trial)return toast('请先结束当前对局，再领取视频补给');
 syncStamina();const reason=StarCandyAds.availability()||adLimitReason(id);if(reason)return toast(reason);
 if(StarCandySave.blocked||!persist())return toast('请先处理存档保存问题，再观看视频');
 adInFlight=true;globalThis.StarCandyMusic?.duck?.(0);
 const receipt={id:globalThis.crypto?.randomUUID?.()||('ad-'+Date.now()+'-'+Math.random().toString(36).slice(2)),offer:id,at:Date.now(),day:localDay()};
 try{
  const result=await StarCandyAds.watch(stage=>adProgress(stage==='loading'?'正在准备视频…':'视频播放中，等待完整观看结果…'));
  adInFlight=false;
  if(!result.completed){id==='mirror'?showPartnerOffer(4):showShop('rewards');toast('视频未完整观看，没有扣次数或发放奖励');return;}
  receipt.at=Date.now();receipt.day=localDay();adPending=receipt;
  // Journal is created only after the real completion event, never on click or timeout.
  try{localStorage.setItem(adPendingKey,JSON.stringify(receipt));}catch(_){}
  grantPendingAd();
 }catch(e){adInFlight=false;id==='mirror'?showPartnerOffer(4):showShop('rewards');toast(e.message);}
 finally{adInFlight=false;globalThis.StarCandyMusic?.duck?.(1);}
}
function handleAdAction(b){
 const action=b.dataset.action;
 if(action==='adCancel'){StarCandyAds.cancel();return true;}
 if(action==='adSupply'){requestAdSupply(b.dataset.offer);return true;}
 if(action==='adMirror'){requestAdSupply('mirror');return true;}
 if(action==='adRetryGrant'){StarCandySave.retry();grantPendingAd();return true;}
 return false;
}
// Imports and routing must not replace the wallet during an outstanding native ad.
document.addEventListener('click',e=>{if(adInFlight&&!e.target.closest?.('[data-action="adCancel"]')){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('keydown',e=>{if(adInFlight&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();StarCandyAds.cancel();}},true);
