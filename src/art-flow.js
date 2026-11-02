// Approved art, with live controls and saved progress layered above clean scenes.
let artPartnerView=null;
const artSymbols=['☾','♧','♨','❧','◇'];
function artHeader(title,extra=''){
 return '<header class="art-header"><button data-action="home" aria-label="返回大厅">‹</button><h1 class="screen-title" tabindex="-1">'+title+'</h1>'+extra+'</header>';
}
function artPicks(){return '<div class="art-picks" aria-label="浏览伙伴">'+partners.map((p,i)=>'<button data-action="viewArtPartner" data-partner="'+i+'" aria-pressed="'+(artPartnerView===i)+'" aria-label="查看'+p.name+'">'+portrait(i)+'<span>'+p.name+'</span>'+(i===4?'<small>特别伙伴</small>':'')+'</button>').join('')+'</div>';}
function renderArtFlow(next,screen){
 const stars=data.stars.reduce((a,b)=>a+b,0);
 if(next==='home'){
  const pending=state.active?state:data.snapshot,earned=data.stars.slice(0,3).filter(Boolean).length;
  screen.innerHTML='<section class="art-page art-lobby"><div class="art-backdrop"></div><header class="art-lobby-head"><h1 class="screen-title" tabindex="-1">星糖物语<small>与你一起，点亮小小心愿</small></h1><span class="art-pill">✦ '+stars+'</span></header><button class="art-preferences" data-action="preferences" aria-label="音乐与设置">⚙</button><div class="art-chapter-tag">'+chapterNames()[Math.floor((data.unlocked-1)/4)]+'</div><button class="art-event" data-action="challenge"><span>◷</span>限时挑战</button><div class="art-lobby-copy"><small>月见</small><p>回来啦，今天也一起出发吧。</p></div><div class="art-dock"><p class="art-next">'+(['下一份心愿 · 星光夜灯','下一份心愿 · 花语八音盒','下一份心愿 · 伙伴合照','小屋心愿已集齐 · 继续旅途'][earned])+'</p><button class="primary art-gold" data-action="'+(pending?'resume':'journey')+'">'+(pending?(pending.mode==='time'?'继续限时挑战':'继续第 '+(pending.level+1)+' 关'):'开始第 '+data.unlocked+' 关')+' <span>▸</span></button><button class="art-link" data-action="map">查看星愿旅途 ›</button></div></section>';return true;
 }
 if(next==='partners'){
  if(artPartnerView===null)artPartnerView=data.partner;
  const i=artPartnerView,p=partners[i];
  screen.innerHTML='<section class="art-page art-partners art-character-'+i+'"><div class="art-partner-scene"></div>'+artHeader('同行伙伴')+'<div class="art-name"><span>'+artSymbols[i]+'</span><h2>'+p.name+'</h2><small>'+skillNames[i]+'</small></div><div class="art-dock partner-dock"><section class="art-skill"><div class="art-skill-symbol">'+artSymbols[i]+'</div><div><h3>主动技能 · '+skillNames[i]+'</h3><p>'+skillCopies[i]+'</p><small>'+(i===4?'50':'40')+' 能量 · 每步一次</small><button class="art-link" data-action="artSkill">查看技能说明 ›</button></div></section>'+artPicks()+'<button class="partner-practice" data-action="practicePartner" data-partner="'+i+'">免费练习 · 体验'+p.name+'的技能</button><button class="primary art-gold" data-action="'+(!partnerOwned(i)?'partnerOffer':'choosePartner')+'" data-partner="'+i+'">'+(!partnerOwned(i)?partnerPrice(i)+' · 解锁同行':i===data.partner?'正在同行 · '+p.name:'邀请同行')+'</button>'+('<small class="art-unavailable">'+(partnerOwned(i)?'已拥有':i===4?'金币永久解锁 · 可免费试用':'金币可通过签到与闯关获得')+'</small>')+'</div></section>';return true;
 }
 if(next==='map'){
  if(chapterView===null)chapterView=Math.floor((data.unlocked-1)/4);
  const ch=chapterView,done=data.stars.slice(ch*4,ch*4+4).filter(Boolean).length,target=Math.min(ch*4+3,data.unlocked-1),locked=ch*4>=data.unlocked;
  screen.innerHTML='<section class="art-page art-journey"><div class="art-map-stage chapter-tone-'+ch+'"><div class="art-backdrop"></div>'+[[58,50,8,10],[37,71,7,9],[84,42,7,7],[62,62,7,6]].map((a,i)=>'<i aria-hidden="true" class="art-water water-'+i+'" style="left:'+a[0]+'%;top:'+a[1]+'%;width:'+a[2]+'%;height:'+a[3]+'%"><b></b><em></em></i>').join('')+'</div>'+artHeader('星愿旅途','<span class="art-pill">✦ '+stars+'/36</span>')+'<div class="art-chapters"><button data-action="chapter" data-step="-1" '+(ch===0?'disabled':'')+' aria-label="上一章">‹</button><div><h2>'+chapterNames()[ch]+'</h2><small>'+done+' / 4 站</small></div><button data-action="chapter" data-step="1" '+(ch===2?'disabled':'')+' aria-label="下一章">›</button></div><div class="art-stops">'+levels.slice(ch*4,ch*4+4).map((l,j)=>{const n=ch*4+j,closed=n>=data.unlocked,current=n===data.unlocked-1;return '<div class="art-stop '+(current?'is-current':'')+'" style="left:'+([22,34,62,83][j])+'%;top:'+([74,57,40,24][j])+'%"><button data-action="level" data-level="'+n+'" '+(closed?'disabled':'')+' aria-label="第'+(n+1)+'关 '+l.title+(closed?' 尚未解锁':'')+'">'+(closed?'♙':n+1)+'</button><small>'+(closed?'待解锁':data.stars[n]?'★'.repeat(data.stars[n])+'☆'.repeat(3-data.stars[n]):'当前关卡')+'</small><strong>'+l.title+'</strong></div>';}).join('')+'</div><div class="art-dock map-dock"><p class="art-next">'+(locked?'完成前一章，开启新的旅途':'第 '+(target+1)+' 关 · '+levels[target].title)+'</p><button class="primary art-gold" data-action="level" data-level="'+target+'" '+(locked?'disabled':'')+'>'+(locked?'尚未开启':'开始挑战 ▸')+'</button></div></section>';return true;
 }
 if(next==='records'){
  const earned=roomRewards.map((_,i)=>data.stars[i]>0),count=earned.filter(Boolean).length,first=earned.indexOf(false);
  screen.innerHTML='<section class="art-page art-room"><div class="art-backdrop"></div>'+artHeader('我们的小屋','<span class="art-pill">心愿 '+count+'/3</span>')+'<div class="art-room-objects">'+earned.map((yes,i)=>yes?'<button class="art-object art-object-'+i+'" data-action="artReward" data-reward="'+i+'" aria-label="查看'+roomRewards[i].name+'"><span class="reward-art reward-'+i+'"></span></button>':'').join('')+'</div><div class="art-dock room-dock"><div class="art-gifts">'+roomRewards.map((r,i)=>'<button data-action="artReward" data-reward="'+i+'" class="'+(earned[i]?'earned':'locked')+'"><span class="reward-art reward-'+i+'"></span><b>'+r.name+'</b><small>'+(earned[i]?'✓ 已布置':'第 '+(i+1)+' 关解锁')+'</small></button>').join('')+'</div><p class="art-next">'+(first<0?'心愿已珍藏，新的旅途仍在继续':'下一份心愿 · '+roomRewards[first].name)+'</p><button class="primary art-gold" data-action="journey">前往第 '+data.unlocked+' 关 ▸</button><button class="art-link" data-action="artAlbum">心愿册 · '+stars+' / 36 星章 ›</button></div></section>';return true;
 }
 return false;
}
function handleArtAction(b){
 switch(b.dataset.action){
  case 'viewArtPartner':artPartnerView=Math.max(0,Math.min(4,Number(b.dataset.partner)));showScreen('partners');return true;
  case 'artSkill':{const i=artPartnerView??data.partner;showDialog('<h2 id="dialogTitle">'+partners[i].name+' · '+skillNames[i]+'</h2><p>'+skillCopies[i]+'</p><p>消除星糖积攒 '+(i===4?50:40)+' 能量，点击战斗中的伙伴技能，再选择棋盘上的目标。每步限一次，元素反应仍受每步次数限制。</p><button class="primary" data-action="close">知道了</button>');return true;}
  case 'artReward':{const i=Number(b.dataset.reward),r=roomRewards[i];if(!r)return true;showDialog('<h2 id="dialogTitle">'+r.name+'</h2><span class="reward-art reward-'+i+'" style="display:block;width:150px;margin:auto"></span><p>'+(data.stars[i]?r.copy:'首次完成第 '+(i+1)+' 关后，礼物会自动布置到小屋。')+'</p><button class="primary" data-action="close">'+(data.stars[i]?'好好珍藏':'继续收集')+'</button>');return true;}
  case 'artAlbum':showDialog('<h2 id="dialogTitle">旅途心愿册</h2>'+levels.map((l,i)=>'<div class="record-row"><span>'+String(i+1).padStart(2,'0')+' · '+l.title+'</span><span>'+'★'.repeat(data.stars[i])+'☆'.repeat(3-data.stars[i])+'</span></div>').join('')+'<button class="primary" data-action="close">合上心愿册</button>');return true;
 }
 return false;
}
