// Runs inside the application closure, sharing its normal navigation and save flow.
function showElementGuide(){
 const rows=[['火＋水','蒸腾','横向清除三格'],['火＋冰','融解','清除中心与最近一格'],['火＋雷','爆裂','纵向清除三格'],['冰＋雷','碎霜','中心及两个对角'],['水＋雷','导电','中心与最近两颗水／雷糖'],['水＋草','绽芽','留下种子；下一步结束十字绽放'],['火＋草','燃烧','留下余焰；后续两步各清一邻格'],['水＋冰','凝露','两颗普通糖获得露珠，正常消除再清邻格'],['雷＋草','激生','一颗草糖长芽，正常消除再清左右'],['风＋火水冰雷','扩散','清除中心，向两邻格传递附着'],['岩＋火水冰雷','结晶','留下晶体，同元素再触碰清两格']];
 showDialog('<h2 id="dialogTitle">七元素 · 反应手册</h2><p>三消向上下左右的邻糖染色；染色跟着糖果移动。两次有效交换后褪去，遇到不同元素产生反应。糖果图案决定配对，外层光效代表附着。</p><div class="element-legend">'+ElementSystem.ids.map((e,i)=>'<span>'+icon(i)+names[i]+'</span>').join('')+'</div>'+rows.map(r=>'<div class="reaction-row"><b>'+r[0]+' · '+r[1]+'</b><small>'+r[2]+'</small></div>').join('')+'<p>种子＋火：提前十字绽放；种子＋雷：精准清三格；余焰＋水：一次结清剩余余焰。<br>冰草、风草、岩草、风岩只替换附着。每步最多四次即时反应；反应清除不再次染色。棋盘最多四个持续机关。</p><button class="secondary" data-action="elementPreview">查看动态演示</button><button class="primary" data-action="close">回到游戏</button>');
}
function premiumDialog(){
 showDialog('<div class="premium-portrait">'+portrait(4)+'</div><div class="page-kicker">MIRROR WISH · 特别伙伴</div><h2 id="dialogTitle">绯镜 · 万象折光</h2><p>把一颗糖果已有的附着转换为你选择的元素，安排下一次反应。需要 50 能量，每步限一次；不能凭空制造附着。</p><p>完整观看两次广告永久解锁 · 可先免费练习技能。</p><button class="primary" data-action="trial">免费试用 · 独立练习局</button><button class="secondary" data-action="close">返回</button>');
}
function startTrial(){
 if(state.busy)return;
 trialBackup={state:structuredClone(state),cells:structuredClone(engine.cells),pool:[...engine.pool],elements:structuredClone(elements.export()),partner:data.partner,snapshot:data.snapshot};
 trialPending=true;data.partner=4;start('time',0);trialPending=false;state.energy=50;
 [8,17,24,31,40].forEach((i,j)=>elements.attach(i,['water','grass','ice','fire','lightning'][j]));setPartner(4);render();hud();toast('独立试玩：已备好附着与能量，不影响旅途进度');
}
function exitTrial(){
 if(!trialBackup)return;const old=trialBackup;trialBackup=null;
 state={...old.state,epoch:state.epoch+1,paused:true,busy:false,selected:-1};engine.cells=old.cells;engine.pool=old.pool;elements.restore(old.elements);data.partner=old.partner;data.snapshot=old.snapshot;skillMode=null;board.innerHTML='';setPartner(data.partner);render(false);hud();
}
function showReactionEvents(){
 elements.events.forEach(ev=>{const host=document.createElement('div');host.className='reaction-overlay';host.style.left=(ev.i%7*100/7)+'%';host.style.top=(Math.floor(ev.i/7)*100/7)+'%';board.append(host);StarCandyEffects.burst(host,ev.a,ev.b,!data.motion);setTimeout(()=>{StarCandyEffects.clear(host);host.remove();},1400);});
 if(elements.events.length){reactionText=elements.events.map(e=>e.name).join(' · ');$('reactionStatus').textContent=reactionText;}
}
function renderElements(){
 engine.cells.forEach((c,i)=>{const el=board.querySelector('.tile[data-id="'+c.id+'"]');if(!el)return;const key=c.aura?.e||'';if(el.dataset.aura!==key){StarCandyEffects.clear(el);el.dataset.aura=key;if(key)StarCandyEffects.attach(el,key,!data.motion);}let badge=el.querySelector('.aura-age');if(!badge){badge=document.createElement('span');badge.className='aura-age';el.append(badge);}badge.textContent=c.aura?Math.max(0,c.aura.until-elements.turn):'';let buff=el.querySelector('.buff-mark');if(!buff){buff=document.createElement('span');buff.className='buff-mark';el.append(buff);}buff.textContent=c.buff?c.buff.type==='dew'?'◉':'❧':'';});
 board.querySelectorAll('.field-mark').forEach(n=>n.remove());elements.fields.forEach(f=>{const mark=document.createElement('span');mark.className='field-mark '+f.type;mark.style.left=((f.i%7+.5)*100/7)+'%';mark.style.top=((Math.floor(f.i/7)+.85)*100/7)+'%';mark.textContent=({seed:'❧',burn:'♨',crystal:'◆'}[f.type])+(f.type==='burn'?f.left:Math.max(0,f.until-elements.turn));mark.title=({seed:'种子',burn:'余焰',crystal:'晶体'}[f.type]);board.append(mark);});
 $('trialExit').hidden=!state.trial;
}
function beginSkill(){
 if(!canAct()||state.energy<skillCost()||state.skillTurn===elements.turn)return;
 if(skillMode){skillMode=null;render();hud();return;}
 skillMode={source:null,e:mirrorElement};state.hammer=false;state.selected=-1;
 $('caption').textContent=data.partner===0?'先点一颗有附着的糖，再点无附着的普通糖。':data.partner===4?'点一颗已有附着的糖，将它转换成'+names[ElementSystem.ids.indexOf(mirrorElement)]:'点选要施加元素的糖果';
 hud();
}
async function useSkill(i){
 const p=data.partner,c=engine.cells[i];let entries=[];
 if(p===0){if(skillMode.source===null){if(!c.aura){toast('先选一颗有元素附着的糖');return;}skillMode.source=c.id;state.selected=i;render();return;}const source=engine.cells.find(x=>x.id===skillMode.source);if(!source?.aura||c.aura||c.s||c===source){toast('再选一颗没有附着的普通糖');return;}c.aura={...source.aura};delete source.aura;
 }else if(p===4){if(!c.aura){toast('绯镜只转换已有附着');return;}if(c.aura.e===mirrorElement){toast('这颗糖已经是该元素');return;}elements.attach(i,mirrorElement);burst('万象折光','绯镜与你重新安排命运');
 }else{entries=[{i,e:p===1?'water':p===2?'fire':'grass'}];}
 state.energy-=skillCost();state.skillTurn=elements.turn;state.skillUsed=true;skillMode=null;state.selected=-1;
 elements.events=[];const clear=elements.pulse(entries);showReactionEvents();render();hud();tone(3);
 if(clear.size){state.busy=true;await resolve({clear,creates:new Map(),reactionOnly:true},[],state.epoch,false);}else snapshot();
}
function skillCost(){return data.partner===4?50:40;}
function refreshPartnerUI(){
 $('partnerName').textContent=partners[data.partner].name+' · '+skillNames[data.partner];
 $('energyText').textContent=(skillMode?'选中目标 · 再点技能取消':state.skillTurn===elements.turn?'本步已使用 · 消除后再次准备':skillNames[data.partner]+' · '+state.energy+' / '+skillCost());
 $('energyBar').style.width=(state.energy/skillCost()*100)+'%';$('skill').disabled=!canAct()||state.energy<skillCost()||state.skillTurn===elements.turn;$('skill').textContent=skillMode?'取消':'共鸣';
 $('mirrorPicker').hidden=!state.trial;
}
function extraUI(){
 const strip=document.createElement('div');strip.className='element-panel';strip.innerHTML='<button data-action="elements">七元素反应手册 ↗</button><span id="reactionStatus">三消染色 · 再次触碰触发反应</span><button id="trialExit" data-action="exitTrial" hidden>结束试用</button><label id="mirrorPicker" hidden>折光元素 <select id="mirrorElement">'+ElementSystem.ids.map((e,i)=>'<option value="'+e+'">'+names[i]+'</option>').join('')+'</select></label>';$('boardShell').after(strip);
 $('mirrorElement').onchange=e=>{mirrorElement=e.target.value;};
}
extraUI();
StarCandyMusic.set(data.music);
