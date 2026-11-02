from pathlib import Path

def load(p):return Path(p).read_text(encoding='utf-8')
def save(p,s):Path(p).write_text(s,encoding='utf-8')
def sub(s,a,b):
 if a not in s:raise ValueError(a[:120])
 return s.replace(a,b)

p='src/economy-flow.js';s=load(p)
a=s.index('function normalizeEconomy(');b=s.index('let shopTab=',a)
s=s[:a]+'''function normalizeEconomy(raw){
 const n=(v,f=0)=>Number.isSafeInteger(v)&&v>=0&&v<=10000000?v:f;
 const e={version:2,coins:360,diamonds:0,inventory:{hammer:3,shuffle:2},paidMirror:false,ownedPartners:[0],decor:[],activeDecor:[],checkin:{last:'',count:0},legacyDiamondCoins:0};
 if(!raw||![1,2].includes(raw.version))return e;
 const old=raw.version===1;
 e.coins=n(raw.coins);e.diamonds=old?0:n(raw.diamonds);
 if(old){e.legacyDiamondCoins=n(raw.diamonds)*100;e.coins+=e.legacyDiamondCoins;e.ownedPartners=[0,1];}
 else {e.paidMirror=raw.paidMirror===true;e.ownedPartners=[0,...[1,2,3].filter(i=>Array.isArray(raw.ownedPartners)&&raw.ownedPartners.includes(i))];e.legacyDiamondCoins=n(raw.legacyDiamondCoins);}
 e.inventory={hammer:n(raw.inventory?.hammer),shuffle:n(raw.inventory?.shuffle)};
 e.decor=['moon','stars'].filter(id=>Array.isArray(raw.decor)&&raw.decor.includes(id));e.activeDecor=e.decor.filter(id=>Array.isArray(raw.activeDecor)&&raw.activeDecor.includes(id));
 if(typeof raw.checkin?.last==='string'&&/^\\d{4}-\\d{2}-\\d{2}$/.test(raw.checkin.last)&&Number.isFinite(Date.parse(raw.checkin.last+'T12:00:00')))e.checkin.last=raw.checkin.last;
 e.checkin.count=n(raw.checkin?.count);return e;
}
data.economy=normalizeEconomy(data.economy);if(!partnerOwned(data.partner))data.partner=0;
''' +s[b:]
s=sub(s,"n===2?'收藏 + 15 钻石':'60 金币'","n===2?'收藏 + 90 金币':'60 金币'")
s=sub(s,"reward.diamonds=firstClear&&state.level%3===2?15:0;","reward.diamonds=0;")
s=sub(s,"data.economy.coins+=reward.coins;data.economy.diamonds+=reward.diamonds;return reward;","data.economy.coins+=reward.coins;return reward;")
a=s.index('const shopGoods=');b=s.index('function prepInventory',a)
s=s[:a]+'''const shopGoods=[
 {id:'hammer',tab:'coins',type:'tool',name:'星锤',price:120,icon:'hammer',copy:'指定清除一颗星糖，不消耗步数。每局最多携带 1 个。'},
 {id:'shuffle',tab:'coins',type:'tool',name:'星盘重排',price:90,icon:'shuffle',copy:'重排棋盘，不消耗步数。每局最多携带 1 个。'},
 ...partnerOffers.filter(p=>['coins','diamonds'].includes(p.kind)).map(p=>({id:p.id,tab:p.kind,type:'partner',partner:p.partner,name:p.name+' · 永久同行',price:p.price,copy:skillCopies[p.partner]})),
 {id:'gold1000',tab:'diamonds',type:'exchange',name:'金币补给',price:10,coins:1000,icon:'coin',copy:'10 钻石兑换 1000 金币。单向兑换，金币不能兑换钻石。'},
 {id:'moon',tab:'diamonds',type:'decor',name:'月光窗饰',price:40,icon:'moon',copy:'永久小屋装饰，可随时布置或收起。'},
 {id:'stars',tab:'diamonds',type:'decor',name:'流星挂帘',price:60,icon:'stars',copy:'永久小屋装饰，可随时布置或收起。'}
];
function goodOwned(g){return g.type==='partner'?partnerOwned(g.partner):g.type==='decor'?data.economy.decor.includes(g.id):false;}
function productArt(g){return g.type==='partner'?portrait(g.partner):lobbyIcon(g.icon);}
function showShop(tab=shopTab){
 shopTab=['coins','diamonds','topup'].includes(tab)?tab:'coins';
 const recharge='<div class="currency-sources"><h3>钻石充值</h3><p>¥1 = 10 钻石。钻石仅通过充值获取，签到、通关和初始礼包均不赠送。</p><div class="stage-choices">'+[['d10',1,10],['d60',6,60],['d180',18,180]].map(([id,yuan,num])=>'<button data-action="cashOffer" data-product="'+id+'"><b>'+num+' 钻石</b><small>固定比例，无首充赠送</small><span>¥'+yuan+'</span></button>').join('')+'</div><h3>绯镜 · 专属直购</h3><p>¥6 永久解锁，不可用金币或钻石购买。</p><button class="primary" data-action="cashOffer" data-product="mirror">查看绯镜 · ¥6</button><p class="economy-note">支付尚未接入，本试玩版不能充值或购买人民币商品。</p><h3>金币来源</h3><p>首次过关 60 金币，每组三关末关 90 金币；重玩获胜 10 金币。每日签到也可领取金币和道具。</p>'+(data.economy.legacyDiamondCoins?'<p class="economy-note">旧试玩免费钻石已一次性转换为 '+data.economy.legacyDiamondCoins+' 金币，原有收藏与道具保留。</p>':'')+'</div>';
 const goods='<p class="economy-note">'+(shopTab==='coins'?'金币可购买道具与澪，不能解锁小焰、青芽或绯镜。':'小焰、青芽和装饰使用钻石兑换；钻石可单向兑换金币。')+'</p><div class="shop-goods">'+shopGoods.filter(g=>g.tab===shopTab).map(g=>{const owned=goodOwned(g);return '<article><div class="shop-item-art">'+productArt(g)+'</div><div><h3>'+g.name+'</h3><p>'+g.copy+'</p>'+(g.type==='tool'?'<small>背包已有 '+data.economy.inventory[g.id]+' 个</small>':'')+'</div><button class="primary" data-action="'+(owned&&g.type==='decor'?'toggleDecor':'buyAsk')+'" data-good="'+g.id+'" '+(owned&&g.type==='partner'?'disabled':'')+'>'+(owned?g.type==='partner'?'已解锁':data.economy.activeDecor.includes(g.id)?'已布置 · 收起':'布置到小屋':g.price+' '+(g.tab==='coins'?'金币':'钻石'))+'</button></article>';}).join('')+'</div>';
 showDialog('<div class="shop-head"><small>WISH BOUTIQUE</small><h2 id="dialogTitle">心愿商店</h2><p>金币日常收集 · 钻石充值获取</p></div>'+walletView()+'<div class="shop-tabs">'+[['coins','金币商店'],['diamonds','钻石商店'],['topup','充值与直购']].map(([id,label])=>'<button data-action="shop" data-tab="'+id+'" aria-pressed="'+(id===shopTab)+'">'+label+'</button>').join('')+'</div>'+(shopTab==='topup'?recharge:goods)+'<button class="secondary" data-action="shopClose">'+(shopBackToPrep?'返回关卡准备':'收起商店')+'</button>');
}
function showMirrorOffer(){showPartnerOffer(4);}
''' +s[b:]
s=sub(s,"for(const k of ['hammer','shuffle'])if(p[k]&&data.economy.inventory[k]<1)","if(!partnerOwned(p.partner)){preparation.partner=0;showPreparation();toast('请先解锁这位伙伴');return false;}\n for(const k of ['hammer','shuffle'])if(p[k]&&data.economy.inventory[k]<1)")
s=sub(s,"const dailyRewards=[{coins:80},{coins:100},{diamonds:10},{coins:120,hammer:1},{coins:150,shuffle:1},{diamonds:15},{coins:200,diamonds:30}];","const dailyRewards=[{coins:80},{coins:100},{coins:120},{coins:120,hammer:1},{coins:150,shuffle:1},{coins:180},{coins:250,hammer:1,shuffle:1}];")
s=sub(s,"e.diamonds+=r.diamonds||0;",'')
a=s.index(" case 'buyAsk':");b=s.index(" case 'toggleDecor':",a)
s=s[:a]+''' case 'partnerOffer':showPartnerOffer(Number(b.dataset.partner));return true;
 case 'cashOffer':showCashOffer(b.dataset.product);return true;
 case 'buyAsk':if(!g)return true;if(goodOwned(g)){toast('已经拥有这件珍藏');return true;}
 showDialog('<div class="shop-confirm">'+productArt(g)+'<h2 id="dialogTitle">'+g.name+'</h2><p>'+g.copy+'</p><strong>'+g.price+' '+(g.tab==='coins'?'金币':'钻石')+'</strong><p>现有 '+data.economy[g.tab]+' · '+(data.economy[g.tab]>=g.price?'兑换后 '+(data.economy[g.tab]-g.price):'余额不足')+'</p></div>'+(data.economy[g.tab]>=g.price?'<button class="primary" data-action="buyConfirm" data-good="'+g.id+'">确认兑换</button>':g.tab==='diamonds'?'<p>钻石仅充值获得，当前支付尚未接入。</p><button class="primary" data-action="shop" data-tab="topup">查看充值规则</button>':'<p>可通过通关、签到获取金币。</p><button class="primary" data-action="daily">查看签到</button>')+'<button class="secondary" data-action="shop" data-tab="'+g.tab+'">返回商店</button>');return true;
 case 'buyConfirm':if(!g||goodOwned(g))return true;if(data.economy[g.tab]<g.price){toast('余额不足');showShop(g.tab);return true;}
 data.economy[g.tab]-=g.price;
 if(g.type==='tool')data.economy.inventory[g.id]++;
 else if(g.type==='partner')data.economy.ownedPartners.push(g.partner);
 else if(g.type==='exchange')data.economy.coins+=g.coins;
 else if(g.type==='decor'){data.economy.decor.push(g.id);data.economy.activeDecor.push(g.id);}
 persist();showShop(g.tab);toast(g.type==='tool'?'道具已放入背包':g.type==='partner'?'伙伴已解锁，可以邀请同行':g.type==='exchange'?'金币已到账':'装饰已布置到小屋');return true;
''' +s[b:]
save(p,s)

p='src/appScript.js';s=load(p)
s=sub(s,"if(p===4&&!state.trial&&!data.economy.mirror){premiumDialog();return;}","if(!partnerOwned(p)&&!(state.trial&&p===4)){showPartnerOffer(p);return;}")
s=sub(s,"partners.slice(0,data.economy.mirror?5:4).map((x,i)=>", "partners.map((x,i)=>!partnerOwned(i)?'':")
s=sub(s,"partner:Math.min(data.economy.mirror?4:3,data.partner)","partner:partnerOwned(data.partner)?data.partner:0")
s=sub(s,"case 'choosePartner':setPartner(Number(b.dataset.partner));", "case 'choosePartner':if(!partnerOwned(Number(b.dataset.partner))){showPartnerOffer(Number(b.dataset.partner));break;}setPartner(Number(b.dataset.partner));")
s=sub(s,"case 'partner':setPartner(Number(b.dataset.partner));", "case 'partner':if(!partnerOwned(Number(b.dataset.partner))&&!(state.trial&&Number(b.dataset.partner)===4)){showPartnerOffer(Number(b.dataset.partner));break;}setPartner(Number(b.dataset.partner));")
s=sub(s,'v12 · 三关一份心愿','v13 · 双货币规则版')
save(p,s)

p='src/game-flow.js';s=load(p)
s=sub(s,"partners.slice(0,data.economy.mirror?5:4).map((x,i)=>","partners.map((x,i)=>!partnerOwned(i)?'':")
s=sub(s,"n<(data.economy.mirror?5:4)","n<partners.length&&partnerOwned(n)")
save(p,s)

p='src/art-flow.js';s=load(p)
s=sub(s,"(i===4&&!data.economy.mirror?'premium':'choosePartner')","(!partnerOwned(i)?'partnerOffer':'choosePartner')")
s=sub(s,"(i===4&&!data.economy.mirror?'180 钻石解锁 · 可免费试用':i===data.partner?'正在同行 · '+p.name:'邀请同行')","(!partnerOwned(i)?partnerPrice(i)+' · 解锁同行':i===data.partner?'正在同行 · '+p.name:'邀请同行')")
s=sub(s,"(i===4?'<small class=\"art-unavailable\">特别伙伴 · '+(data.economy.mirror?'已解锁':'钻石可通过签到和通关获得')+'</small>':'')","('<small class=\"art-unavailable\">'+(partnerOwned(i)?'已拥有':i===4?'人民币直购专属 · 可免费试用':i===1?'金币可通过签到与闯关获得':'钻石仅通过充值获得')+'</small>')")
save(p,s)

p='scripts/build-game.cjs';s=load(p);s=sub(s,"fs.readFileSync('src/economy-flow.js','utf8')","fs.readFileSync('src/commerce.js','utf8')+'\\n'+fs.readFileSync('src/economy-flow.js','utf8')");save(p,s)
p='scripts/package-mobile.cjs';s=load(p);s=sub(s,'v12 三关一份心愿','v13 双货币规则版');save(p,s)
