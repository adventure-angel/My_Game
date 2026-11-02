// Free progression offers. No cash checkout.
const partnerOffers=[
 {id:'moonPartner',partner:0,name:'月见',kind:'free',price:0},
 {id:'mioPartner',partner:1,name:'澪',kind:'coins',price:600},
 {id:'flamePartner',partner:2,name:'小焰',kind:'coins',price:1800},
 {id:'sproutPartner',partner:3,name:'青芽',kind:'coins',price:1800},
 {id:'mirrorPartner',partner:4,name:'绯镜',kind:'ads',price:2}
];
function partnerOwned(i){return i===0||Number.isInteger(i)&&i>0&&i<5&&data.economy.ownedPartners.includes(i);}
function partnerPrice(i){const p=partnerOffers[i];return p.kind==='free'?'默认同行':p.kind==='ads'?'完整观看 2 次广告':p.price+' 金币';}
function showPartnerOffer(i){
 const p=partnerOffers[i];if(!p)return;
 const pending=p.kind==='ads'&&readPendingAd()?.offer==='mirror',unavailable=p.kind==='ads'&&StarCandyAds.availability();
 showDialog('<div class="premium-portrait">'+portrait(i)+'</div><h2 id="dialogTitle">'+p.name+' · '+skillNames[i]+'</h2><p>'+skillCopies[i]+'</p><p>'+partnerPrice(i)+' · 永久解锁</p>'+(p.kind==='ads'&&!partnerOwned(i)?'<p>已完成 '+mirrorAdProgress()+'/2 次；提前关闭或播放失败不计入。</p>':'')+(partnerOwned(i)?'<button class="primary" data-action="choosePartner" data-partner="'+i+'">邀请同行</button>':p.kind==='ads'?pending?'<button class="primary" data-action="adRetryGrant">保存已完成的广告进度</button>':'<button class="primary" data-action="adMirror" '+(unavailable?'disabled':'')+'>'+(unavailable?'视频暂不可用':'看广告 · '+(mirrorAdProgress()+1)+'/2')+'</button>':'<button class="primary" data-action="buyAsk" data-good="'+p.id+'">'+partnerPrice(i)+' 解锁</button>')+'<button class="secondary" data-action="practicePartner" data-partner="'+i+'">免费练习 · 先试试技能</button><button class="text-button" data-action="close">返回</button>');
}
function showCashOffer(){showShop('rewards');}
