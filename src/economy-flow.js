// Wallet and store are local prototype systems; no remote payment or billing.
function normalizeEconomy(raw){
 const n=(v,f=0)=>Number.isSafeInteger(v)&&v>=0&&v<=10000000?v:f;
 const e={version:3,coins:360,diamonds:0,inventory:{hammer:3,shuffle:2},ownedPartners:[0],mirrorAdViews:0,decor:[],activeDecor:[],checkin:{last:'',count:0},legacyDiamondCoins:0,chapterSupply:false,milestoneClaims:[],milestoneRate:5,challenge:normalizeChallenge(raw?.challenge),adSupply:normalizeAdLedger(raw?.adSupply)};
 if(!raw||![1,2,3].includes(raw.version))return e;
 e.chapterSupply=raw.chapterSupply===true||!!data.stars[5];
 e.coins=n(raw.coins);e.diamonds=n(raw.diamonds);e.legacyDiamondCoins=n(raw.legacyDiamondCoins);
 e.ownedPartners=[0,...[1,2,3,4].filter(i=>Array.isArray(raw.ownedPartners)&&raw.ownedPartners.includes(i))];
 e.mirrorAdViews=Math.min(2,Math.max(n(raw.mirrorAdViews),e.adSupply.receipts.filter(r=>r.offer==='mirror').length));
 if(raw.paidMirror===true&&!e.ownedPartners.includes(4))e.ownedPartners.push(4);
 if(raw.version===1&&!e.ownedPartners.includes(1))e.ownedPartners.push(1);
 e.inventory={hammer:n(raw.inventory?.hammer),shuffle:n(raw.inventory?.shuffle)};
 e.decor=['wishStar','moon','stars'].filter(id=>Array.isArray(raw.decor)&&raw.decor.includes(id));e.activeDecor=e.decor.filter(id=>Array.isArray(raw.activeDecor)&&raw.activeDecor.includes(id));
 if(typeof raw.checkin?.last==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(raw.checkin.last)&&Number.isFinite(Date.parse(raw.checkin.last+'T12:00:00')))e.checkin.last=raw.checkin.last;
 e.checkin.count=n(raw.checkin?.count);
 e.milestoneClaims=[...new Set((Array.isArray(raw.milestoneClaims)?raw.milestoneClaims:[]).filter(g=>Number.isInteger(g)&&g>=0&&g<levels.length/3))];
 if(raw.milestoneRate!==5)e.diamonds=Math.min(10000000,e.diamonds+2*e.milestoneClaims.length);
 for(let g=0;g<levels.length/3;g++)if(data.stars.slice(g*3,g*3+3).every(Boolean)&&!e.milestoneClaims.includes(g)){e.milestoneClaims.push(g);e.diamonds=Math.min(10000000,e.diamonds+5);}
 return e;
}

data.economy=normalizeEconomy(data.economy);if(!partnerOwned(data.partner))data.partner=0;
let shopTab='coins',shopBackToPrep=false,uiIconSerial=0;
function lobbyIcon(type){
 if(['coin','diamond','hammer','shuffle','mail','calendar'].includes(type))return '<span class="lobby-icon prop-art prop-'+type+'" aria-hidden="true"><i></i></span>';
 const id='lobby-gold-'+(++uiIconSerial),shapes={
 mail:'<rect x="10" y="19" width="44" height="29" rx="5"/><path d="m12 22 20 15 20-15M12 45l13-12m27 12L39 33" fill="none"/><circle cx="32" cy="35" r="6" fill="#bc789e"/><path d="m32 30 1.5 3.5L37 35l-3.5 1.5L32 40l-1.5-3.5L27 35l3.5-1.5Z" stroke="none"/>',
 chat:'<path d="M13 15h37a7 7 0 0 1 7 7v20a7 7 0 0 1-7 7H28L17 57V49h-4a7 7 0 0 1-7-7V22a7 7 0 0 1 7-7Z"/><path d="M35 21a13 13 0 1 0 10 19 12 12 0 0 1-10-19Z" fill="#806393"/><path d="m44 22 1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8Z" fill="#fff3cf" stroke="none"/>',
 settings:'<path d="m26 7 12 0 2 8 6 4 8-2 6 10-6 6v7l5 6-7 10-8-3-6 3-2 7H24l-2-8-6-4-8 2-6-10 6-6v-7l-5-6 7-10 8 3 6-3Z" transform="translate(4 -2) scale(.87)"/><circle cx="32" cy="31" r="12" fill="#6d4e82"/><circle cx="32" cy="31" r="6" fill="#ddc5eb"/>',
 shop:'<path d="M12 26h40l4 28H8Z"/><path d="M22 26V18a10 10 0 0 1 20 0v8" fill="none" stroke-width="4"/><path d="m32 30 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1Z" fill="#9e6898"/>',
 calendar:'<rect x="10" y="14" width="44" height="42" rx="7"/><path d="M10 27h44M22 7v14M42 7v14" fill="none" stroke-width="4"/><path d="m23 40 6 6 13-14" fill="none" stroke="#94618b" stroke-width="5"/>',
 coin:'<circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="18" fill="none"/><path d="m32 17 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2Z" fill="#af743c"/>',
 diamond:'<path d="m17 13 30 0 12 17-27 29L5 30Z" fill="#b6ddff"/><path d="m17 13 8 17 7 29 7-29 8-17M5 30h54M25 30l7-17 7 17" fill="none" stroke="#fff2ff"/>',
 hammer:'<path d="m36 29 7 7-21 25-8-8Z"/><rect x="17" y="10" width="39" height="23" rx="5" transform="rotate(30 36 22)" fill="#bd9bde"/>',
 shuffle:'<path d="M8 20h10c12 0 17 24 29 24h9M8 44h10c12 0 17-24 29-24h9" fill="none" stroke-width="5"/><path d="m48 12 9 8-9 8m0 8 9 8-9 8" fill="none" stroke-width="5"/>',
 moon:'<path d="M37 7a25 25 0 1 0 20 37A24 24 0 0 1 37 7Z"/><path d="m46 12 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#e9d4ff"/>',
 stars:'<path d="m32 7 6 16 17 1-13 11 5 17-15-9-15 9 5-17L9 24l17-1Z"/><path d="M10 5v11m-5-6h11M52 43v14m-7-7h14" fill="none"/>'
 };
 return '<svg class="lobby-icon icon-'+type+'" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="'+id+'" x2=".8" y2="1"><stop stop-color="#fff5d6"/><stop offset=".5" stop-color="#eed39b"/><stop offset="1" stop-color="#b88a5b"/></linearGradient></defs><g fill="url(#'+id+')" stroke="#fff0c8" stroke-width="1.5" stroke-linejoin="round">'+(shapes[type]||shapes.stars)+'</g></svg>';
}
function walletView(compact=false){const display=n=>compact&&n>=10000?(n/10000).toFixed(1).replace(/\.0$/,'')+'万':n;return '<div class="wallet-row"><button data-action="shop" data-tab="coins" aria-label="金币 '+data.economy.coins+'，打开金币商店">'+lobbyIcon('coin')+'<b>'+display(data.economy.coins)+'</b><span>金币</span></button><button data-action="shop" data-tab="diamonds" aria-label="钻石 '+data.economy.diamonds+'，打开钻石商店">'+lobbyIcon('diamond')+'<b>'+display(data.economy.diamonds)+'</b><span>钻石</span></button></div>';}
function localDay(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function canCheckin(){return localDay()>data.economy.checkin.last;}
function renderEconomyLobby(){
 const completed=journeyComplete(),wish=currentWish(),unread=availableLetters().filter(l=>!data.home.read.includes(l.id)).length,pending=state.active?state:data.snapshot,first=!completed&&!firstLightComplete(),ready=first&&ownedItem(0),homeTask=completed||first?null:roomTaskWish();
 const rail=first?'<button class="lobby-medallion" data-action="firstLightPreview">'+collectionArt(0)+'<span>夜灯预览</span></button><button class="lobby-medallion" data-action="lobbyMore">'+lobbyIcon('stars')+'<span>更多</span></button>':'<button class="lobby-medallion" data-action="daily">'+lobbyIcon('calendar')+'<span>每日签到</span>'+(canCheckin()?'<em>可领</em>':'')+'</button><button class="lobby-medallion" data-action="shop">'+lobbyIcon('shop')+'<span>心愿商店</span></button><button class="lobby-medallion" data-action="wcMailbox">'+lobbyIcon('mail')+'<span>月光信箱</span>'+(unread?'<em>'+unread+'</em>':'')+'</button><button class="lobby-medallion" data-action="challenge">'+lobbyIcon('stars')+'<span>限时挑战</span></button>';
 const action=pending?'resume':completed?'journeyEnding':ready?'firstLightRoom':homeTask?homeTask.action:'journey';
 const label=pending?'继续未完成对局':completed?'未完待续 · 下一程再相见':ready?(roomPlaced(0)?'回小屋 · 亲手点亮':'带回夜灯 · 选择位置'):homeTask?homeTask.button:'开始第 '+data.unlocked+' 关';
 return '<section class="art-page world-home economy-home '+(first?'first-light-home':'')+'"><div class="world-scene"></div><div class="lobby-layout"><header class="art-lobby-head"><h1 class="screen-title" tabindex="-1">星糖物语<small>和你一起，把心愿带回家</small></h1></header><div class="lobby-topbar moonlight-ribbon free-play-ribbon">'+walletView(true)+'<button class="lobby-medallion lobby-settings" data-action="preferences" aria-label="设置">'+lobbyIcon('settings')+'<span>设置</span></button></div><div class="lobby-left-rail">'+rail+'</div></div><button class="lobby-talk" data-action="wcTalk">'+lobbyIcon('chat')+'<span>和月见聊聊</span></button><div class="world-speech">'+(ready?'第一盏灯，等你亲手点亮。':first?'一起完成三次小冒险，为家点一盏灯。':homeTask?homeTask.detail:wish.upcoming?wish.detail:wish.index!==undefined?'新收藏带回来啦，一起找个位置吧。':'三次小小的冒险，带回一份心愿。')+'</div><div class="art-dock world-home-dock"><button class="world-task" data-action="wcWish">'+(first?collectionArt(0):wish.index!==undefined?collectionArt(wish.index):lobbyIcon('stars'))+'<div><small>'+(first?'第一份心愿 · '+stageCount(0)+'/3 关':'当前心愿 · '+collectibles.filter((_,i)=>ownedItem(i)).length+'/12 收藏')+'</small><strong>'+wish.title+'</strong><p>'+wish.detail+'</p></div></button><button class="primary art-gold" data-action="'+action+'" '+(homeTask?'data-item="'+homeTask.index+'"':'')+'>'+label+'</button><div class="world-secondary"><button data-action="map">旅途地图 · '+data.stars.filter(Boolean).length+'/'+levels.length+' 关 ›</button><button data-action="records">回小屋布置 ›</button></div></div></section>';
}
function stageCount(group){return data.stars.slice(group*3,group*3+3).filter(Boolean).length;}
function renderStageMap(screen){
 if(chapterView===null)chapterView=Math.floor((data.unlocked-1)/12);
 const ch=Math.max(0,Math.min(chapterNames().length-1,chapterView)),target=Math.min(ch*12+11,data.unlocked-1),group=Math.max(ch*4,Math.floor(target/3)),locked=ch*12>=data.unlocked;
 const completed=journeyComplete()&&ch===chapterNames().length-1;
 const coords=[[[23,68],[73,52],[29,34],[75,24]],[[73,66],[28,51],[72,38],[30,25]],[[22,68],[72,58],[26,41],[76,28]]][ch%3];
 screen.innerHTML='<section class="art-page world-map world-map-'+ch+'"><div class="world-map-canvas"><div class="world-scene"></div><canvas id="worldWater" aria-hidden="true"></canvas></div>'+artHeader('星愿旅途','<span class="art-pill">✦ '+data.stars.reduce((a,b)=>a+b,0)+'/'+(levels.length*3)+'</span>')+'<div class="art-chapters"><button data-action="chapter" data-step="-1" '+(ch===0?'disabled':'')+'>‹</button><div><h2>'+chapterNames()[ch]+'</h2><small>第 '+(ch+1)+' 章 · '+data.stars.slice(ch*12,ch*12+12).filter(Boolean).length+'/12 关</small></div><button data-action="chapter" data-step="1" '+(ch===chapterNames().length-1?'disabled':'')+'>›</button></div><div class="world-map-stops">'+coords.map(([x,y],j)=>{const g=ch*4+j,closed=g*3>=data.unlocked,done=stageCount(g);return '<div class="world-stop '+(Math.floor((data.unlocked-1)/3)===g?'current':'')+'" style="left:'+x+'%;top:'+y+'%"><button data-action="stageGroup" data-group="'+g+'" aria-label="'+worldPlaces[g]+'，第'+(g*3+1)+'到'+(g*3+3)+'关"><b>'+(g+1)+'</b><span>'+worldPlaces[g]+'</span></button><small>'+(closed?'第 '+(g*3+1)+'—'+(g*3+3)+' 关 · 待解锁':done+'/3 关 '+(done===3?'· 已收藏':g>=12?'· 旅途后记收集中':'· 心愿收集中'))+'</small></div>';}).join('')+'</div><div class="art-dock world-map-dock"><div class="world-map-reward">'+journeyRewardArt(group)+'<div><small>完成三关获得 · '+stageCount(group)+'/3</small><strong>'+journeyReward(group).name+'</strong></div></div><button class="primary art-gold" data-action="'+(completed?'journeyEnding':'level')+'" data-level="'+target+'" '+(locked?'disabled':'')+'>'+(completed?'未完待续 · 下一程再相见':locked?'尚未开启':'开始第 '+(target+1)+' 关')+'</button></div></section>';
 requestAnimationFrame(()=>startWorldWater(ch%3));return true;
}
function stagePreparation(level){const g=Math.floor(level/3);return '<div class="stage-progress"><span>'+journeyRewardArt(g)+'</span><div><b>'+journeyReward(g).name+'</b><small>本组第 '+(level%3+1)+'/3 关 · 完成第 '+(g*3+3)+' 关获得</small><div class="stage-dots">'+[0,1,2].map(n=>'<i class="'+(data.stars[g*3+n]?'done':n===level%3?'current':'')+'">'+(data.stars[g*3+n]?'✓':n+1)+'</i>').join('')+'</div></div></div>';}
function showStageGroup(group){
 if(!Number.isInteger(group)||group<0||group>=levels.length/3)return;
 showDialog('<h2 id="dialogTitle">'+worldPlaces[group]+'</h2>'+stagePreparation(Math.min(group*3+2,Math.max(group*3,data.unlocked-1)))+'<div class="stage-choices">'+[0,1,2].map(n=>{const i=group*3+n,l=levels[i],locked=i>=data.unlocked;return '<button data-action="level" data-level="'+i+'" '+(locked?'disabled':'')+'><b>第 '+(i+1)+' 关 · '+l.title.split(' · ').pop()+'</b><small>'+ (data.stars[i]?'★'.repeat(data.stars[i]):locked?'完成前一关解锁':chapterGoalSummary(i)+' · '+l.moves+' 步')+'</small><span>'+ (n===2?(group>=12?'旅途后记':'收藏')+' + 90 金币 · 首次集齐另得3钻石':'60 金币')+'</span></button>';}).join('')+'</div><p class="economy-note">首次通关奖励。已完成关卡可重玩，每次胜利获得 20 金币。</p><button class="secondary" data-action="close">返回地图</button>');
}
function awardStage(won,firstClear){
 const reward={coins:0,diamonds:0};if(!won||state.mode!=='story'||state.trial)return reward;
  reward.coins=firstClear?(state.level%3===2?90:60):30;reward.diamonds=0;
  const group=Math.floor(state.level/3);if(stageCount(group)===3&&!data.economy.milestoneClaims.includes(group)){reward.diamonds=5;data.economy.milestoneClaims.push(group);data.economy.diamonds+=5;}
 data.economy.coins+=reward.coins;chapterSupply(reward,won,firstClear);return reward;
}
function renderStageResult(){
 if(state.level>=36)return renderReturnResult();
 const r=lastResult,i=state.level,g=Math.floor(i/3),c=collectibles[g],gift=r.won&&i%3===2,rew=r.reward||{coins:0,diamonds:0};
 return '<section class="mobile-result"><div class="result-small-art">'+portrait(data.partner)+'</div><div class="result-stars">'+(r.won?'★'.repeat(r.stars)+'☆'.repeat(3-r.stars):'✧')+'</div><h1 class="screen-title" tabindex="-1">'+(r.won?gift?'这份心愿，可以带回家了':'又离心愿近了一步':'再试一次，就更近一点')+'</h1><p>'+levels[i].title+' · 第 '+(i+1)+' 关</p><div class="result-tally"><span>本局星光<strong>'+state.score.toLocaleString()+'</strong></span><span>剩余步数<strong>'+state.moves+'</strong></span></div>'+chapterResultGoals()+(r.won?'<div class="earned-currency">'+lobbyIcon('coin')+'<b>+'+rew.coins+'</b>'+(rew.diamonds?lobbyIcon('diamond')+'<b>+'+rew.diamonds+'</b>':'')+'<small>'+(rew.diamonds?'通关奖励 · 收藏集齐 +3钻石':r.firstClear?'首次通关奖励':'重玩奖励')+'</small></div>'+(rew.chapterCoins?'<p class="chapter-supply">已含花溪补给 · +'+rew.chapterCoins+'金币</p>':'')+chapterInvitation()+(gift?'<div class="world-reward-reveal">'+collectionArt(g)+'<h2>'+c.name+'</h2><p>'+(r.firstClear?'三关完成 · 新收藏已收入收藏柜':'已拥有的收藏 · 星级记录已更新')+'</p></div>':stagePreparation(i)+'<p>还差 '+(3-stageCount(g))+' 关，就能获得'+c.name+'。</p>')+'<button class="secondary" data-action="rgPreview" data-item="'+g+'">'+(gift?'看看摆进小屋的样子':'预览下一份心愿 · '+stageCount(g)+'/3')+'</button>'+(roomBundles[g]?'<p>'+roomBundles[g]+' · 随收藏一起获得</p>':'')+(i===11?forestWishCard():'')+'<div class="result-actions">'+(gift?'<button class="primary art-gold" data-action="'+(c.slots.length?'wcPlaceItem':'wcMailbox')+'" data-item="'+g+'">'+(g===0&&!firstLightComplete()?'把第一盏灯带回家':c.slots.length?'带回小屋 · 去布置':'打开月光来信')+'</button>':'')+(i<levels.length-1?'<button class="'+(gift?'secondary':'primary art-gold')+'" data-action="next">继续第 '+(i+2)+' 关</button>':'<button class="secondary" data-action="records">七十二关完成 · 回家看看</button>')+'</div>':chapterFailure()+'<button class="primary" data-action="retry">调整伙伴与道具，再试一次</button>')+'<button class="text-button" data-action="map">回旅途地图</button><button class="text-button" data-action="home">回大厅</button></section>';
}
const shopGoods=[
 {id:'hammer',tab:'coins',type:'tool',name:'星锤',price:120,icon:'hammer',copy:'指定清除一颗星糖，不消耗步数。每局最多携带 1 个。'},
 {id:'shuffle',tab:'coins',type:'tool',name:'星盘重排',price:90,icon:'shuffle',copy:'重排棋盘，不消耗步数。每局最多携带 1 个。'},
 ...partnerOffers.filter(p=>['coins','diamonds'].includes(p.kind)).map(p=>({id:p.id,tab:p.kind,type:'partner',partner:p.partner,name:p.name+' · 永久同行',price:p.price,copy:skillCopies[p.partner]})),
 {id:'gold1000',tab:'diamonds',type:'exchange',name:'金币补给',price:10,coins:1000,icon:'coin',copy:'10 钻石兑换 1000 金币。单向兑换，金币不能兑换钻石。'},
 {id:'wishStar',tab:'diamonds',type:'decor',name:'星愿窗铃',price:9,icon:'stars',copy:'一枚轻轻作响的金色星铃。永久装饰，摆上后轻触可听到回应。'},
 {id:'moon',tab:'diamonds',type:'decor',name:'月光窗饰',price:40,icon:'moon',copy:'永久小屋装饰，可随时布置或收起。'},
 {id:'stars',tab:'diamonds',type:'decor',name:'流星挂帘',price:60,icon:'stars',copy:'永久小屋装饰，可随时布置或收起。'}
];
function goodOwned(g){return g.type==='partner'?partnerOwned(g.partner):g.type==='decor'?data.economy.decor.includes(g.id):false;}
function productArt(g){return g.type==='partner'?portrait(g.partner):lobbyIcon(g.icon);}
function showShop(tab=shopTab){
 shopTab=tab==='topup'?'rewards':['coins','diamonds','rewards'].includes(tab)?tab:'coins';

 const goods='<p class="economy-note">'+(shopTab==='coins'?'金币可购买道具，并永久解锁澪、小焰和青芽；绯镜完整观看两次广告即可永久同行。':'钻石来自收藏里程碑、签到与自愿广告补给，可兑换永久装饰或单向兑换金币。')+'</p><div class="shop-goods">'+shopGoods.filter(g=>g.tab===shopTab).map(g=>{const owned=goodOwned(g);return '<article class="product-'+g.type+'"><div class="shop-item-art">'+productArt(g)+'</div><div><h3>'+g.name+'</h3><p>'+g.copy+'</p>'+(g.type==='tool'?'<small>背包已有 '+data.economy.inventory[g.id]+' 个</small>':'')+'</div><button class="primary" data-action="'+(owned&&g.type==='decor'?'toggleDecor':'buyAsk')+'" data-good="'+g.id+'" '+(owned&&g.type==='partner'?'disabled':'')+'>'+(owned?g.type==='partner'?'已解锁':data.economy.activeDecor.includes(g.id)?'已布置 · 收起':'布置到小屋':g.price+' '+(g.tab==='coins'?'金币':'钻石'))+'</button></article>';}).join('')+(shopTab==='coins'?'<article class="product-partner"><div class="shop-item-art">'+portrait(4)+'</div><div><h3>绯镜 · 永久同行</h3><p>'+skillCopies[4]+'</p><small>广告进度 '+mirrorAdProgress()+'/2</small></div><button class="primary" data-action="partnerOffer" data-partner="4">'+(partnerOwned(4)?'已解锁 · 查看':'查看解锁')+'</button></article>':'')+'</div>';
 showDialog('<section class="boutique-sheet"><header class="boutique-fixed"><div class="shop-head boutique-head"><div class="boutique-emblem">'+lobbyIcon('hammer')+lobbyIcon('diamond')+lobbyIcon('shuffle')+'</div><small>WISH BOUTIQUE</small><h2 id="dialogTitle">心愿商店</h2><p>游玩收集心愿 · 自愿视频补给</p></div>'+walletView()+'<div class="shop-tabs">'+[['coins','金币商店'],['diamonds','钻石商店'],['rewards','视频补给']].map(([id,label])=>'<button data-action="shop" data-tab="'+id+'" aria-pressed="'+(id===shopTab)+'">'+label+'</button>').join('')+'</div></header><div class="boutique-scroll"><p class="release-channel-note">免费游玩 · '+(StarCandyRelease.ads?'自愿视频补给':'视频补给待开通')+'</p>'+(shopTab==='rewards'?adSupplyMarkup():goods)+'</div><footer class="boutique-footer"><button class="secondary" data-action="shopClose">'+(shopBackToPrep?'返回关卡准备':'收起商店')+'</button></footer></section>');
}
function showMirrorOffer(){showPartnerOffer(4);}
function prepInventory(p){return '<h3 class="prep-label">本局道具 <small>携带免费，实际使用时扣背包</small></h3><div class="prep-tools"><button data-action="prepTool" data-tool="hammer" aria-pressed="'+p.hammer+'">'+(p.hammer?'✓':'＋')+' 星锤 ×1 <small>库存 '+data.economy.inventory.hammer+'</small></button><button data-action="prepTool" data-tool="shuffle" aria-pressed="'+p.shuffle+'">'+(p.shuffle?'✓':'＋')+' 重排 ×1 <small>库存 '+data.economy.inventory.shuffle+'</small></button></div><button class="text-button prep-shop-link" data-action="prepShop">去商店补充道具 ›</button>';}
function consumeLoadout(p){
 if(!Number.isInteger(p.level)||p.level<0||p.level>=levels.length||(p.mode==='story'&&p.level>=data.unlocked))return false;
 if(!partnerOwned(p.partner)){preparation.partner=0;showPreparation();toast('请先解锁这位伙伴');return false;}
 for(const k of ['hammer','shuffle'])if(p[k]&&data.economy.inventory[k]<1){toast('道具库存不足，请重新选择');showPreparation();return false;}
  return true;
}
const dailyRewards=[{coins:80},{coins:100},{coins:120},{coins:120,hammer:1},{coins:150,shuffle:1},{coins:180},{coins:250,diamonds:5,hammer:1,shuffle:1}];
function dailyCopy(r){return [r.coins?r.coins+' 金币':'',r.diamonds?r.diamonds+' 钻石':'',r.hammer?'星锤 ×1':'',r.shuffle?'重排 ×1':''].filter(Boolean).join(' · ');}
function showDaily(){
 const d=data.economy.checkin,can=canCheckin(),next=d.count%7,week=Math.floor(Math.max(0,d.count-(can?0:1))/7),claimed=d.count-week*7,today=can?next:(d.count+6)%7,r=dailyRewards[today];
 showDialog('<section class="daily-sheet"><header class="daily-heading"><small>SEVEN LITTLE WISHES</small><h2 id="dialogTitle">每日一份小心愿</h2></header><div class="daily-today"><div class="daily-today-art">'+lobbyIcon('calendar')+'</div><div><small>第 '+(today+1)+' 天 · '+(can?'今日可领取':'今日已领取')+'</small><strong>'+dailyCopy(r)+'</strong><span>漏签不清零，累计七次开启下一册</span></div></div><div class="daily-scroll"><div class="daily-book"><div class="daily-grid">'+dailyRewards.map((r,i)=>'<div class="daily-day '+(i<claimed?'claimed':can&&i===next?'today':'')+'"><small>第 '+(i+1)+' 天</small><div class="daily-treasures">'+lobbyIcon('coin')+(r.diamonds?lobbyIcon('diamond'):'')+(r.hammer?lobbyIcon('hammer'):'')+(r.shuffle?lobbyIcon('shuffle'):'')+'</div><b>'+dailyCopy(r)+'</b><span>'+(i<claimed?'✓ 已收入心愿册':can&&i===next?'今日可领取':'待开启')+'</span></div>').join('')+'</div></div></div><footer class="daily-footer"><button class="primary" data-action="dailyClaim" '+(!can?'disabled':'')+'>'+(can?'收下第 '+(next+1)+' 天的心愿':'今日已收下 · 明天再见')+'</button><p>每日领取一次 · 第7次额外5钻石</p><button hidden data-action="economyClose">合上心愿册</button></footer></section>');
}
function roomDecor(){return '<div class="room-decor">'+(data.economy.activeDecor.includes('wishStar')?'<button class="wish-chime" data-action="roomChime" aria-label="轻碰星愿窗铃">'+lobbyIcon('stars')+'</button>':'')+(data.economy.activeDecor.includes('moon')?'<div class="moon-window">'+lobbyIcon('moon')+'<i></i><i></i><i></i></div>':'')+(data.economy.activeDecor.includes('stars')?'<div class="star-curtain">'+Array.from({length:7},(_,i)=>'<span style="--drop:'+(20+i%3*13)+'px">'+lobbyIcon('stars')+'</span>').join('')+'</div>':'')+'</div>';}
function handleEconomyAction(b){
 const a=b.dataset.action,g=shopGoods.find(x=>x.id===b.dataset.good);
 switch(a){
 case 'stageGroup':showStageGroup(Number(b.dataset.group));return true;
 case 'prepShop':shopBackToPrep=true;showShop('coins');return true;
 case 'shop':showShop(b.dataset.tab||shopTab);return true;
 case 'partnerOffer':showPartnerOffer(Number(b.dataset.partner));return true;
 case 'cashOffer':showCashOffer(b.dataset.product);return true;
 case 'buyAsk':if(!g)return true;if(goodOwned(g)){toast('已经拥有这件珍藏');return true;}
 showDialog('<div class="shop-confirm">'+productArt(g)+'<h2 id="dialogTitle">'+g.name+'</h2><p>'+g.copy+'</p><strong>'+g.price+' '+(g.tab==='coins'?'金币':'钻石')+'</strong><p>现有 '+data.economy[g.tab]+' · '+(data.economy[g.tab]>=g.price?'兑换后 '+(data.economy[g.tab]-g.price):'余额不足')+'</p></div>'+(data.economy[g.tab]>=g.price?'<button class="primary" data-action="buyConfirm" data-good="'+g.id+'">确认兑换</button>':g.tab==='diamonds'?'<p>完成三关收藏首次得5钻石，累计签到第7次额外得5钻石；也可自愿观看视频领取额外补给。</p><button class="primary" data-action="shop" data-tab="rewards">查看获取方式</button>':'<p>可通过通关、签到获取金币。</p><button class="primary" data-action="daily">查看签到</button>')+'<button class="secondary" data-action="shop" data-tab="'+g.tab+'">返回商店</button>');return true;
 case 'buyConfirm':if(!g||goodOwned(g))return true;if(data.economy[g.tab]<g.price){toast('余额不足');showShop(g.tab);return true;}
 data.economy[g.tab]-=g.price;
 if(g.type==='tool')data.economy.inventory[g.id]++;
 else if(g.type==='partner'){data.economy.ownedPartners.push(g.partner);recordRoomNoteSignal('partner',g.partner);StarCandyPlaytest.record('partner_unlock',{partner:g.partner,coins:g.price});}
 else if(g.type==='exchange')data.economy.coins+=g.coins;
 else if(g.type==='decor'){data.economy.decor.push(g.id);data.economy.activeDecor.push(g.id);}
 persist();showShop(g.tab);toast(g.type==='tool'?'道具已放入背包':g.type==='partner'?'伙伴已解锁，可以邀请同行':g.type==='exchange'?'金币已到账':'装饰已布置到小屋');return true;
 case 'toggleDecor':if(g&&data.economy.decor.includes(g.id)){const items=data.economy.activeDecor;data.economy.activeDecor=items.includes(g.id)?items.filter(id=>id!==g.id):[...items,g.id];persist();showShop('diamonds');}return true;
 case 'daily':showDaily();return true;
 case 'dailyClaim':if(!canCheckin()){showDaily();return true;}{const e=data.economy,r=dailyRewards[e.checkin.count%7];e.coins+=r.coins||0;e.diamonds+=r.diamonds||0;e.inventory.hammer+=r.hammer||0;e.inventory.shuffle+=r.shuffle||0;e.checkin.last=localDay();e.checkin.count++;persist();showDaily();toast('已领取：'+dailyCopy(r));}return true;
 case 'shopClose':case 'economyClose':if(shopBackToPrep&&preparation){shopBackToPrep=false;showPreparation();}else{shopBackToPrep=false;closeDialog();showScreen(route);}return true;
 }
 return false;
}
