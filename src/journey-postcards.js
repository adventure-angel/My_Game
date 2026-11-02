// Return-journey keepsakes are story pages. The original twelve room objects stay independent.
function journeyComplete(){return levels.length>0&&levels.every((_,i)=>data.stars[i]>0);}
function journeyEndingWords(){return '这一程的星光，已经带回家。下一次冒险，我们还要一起出发。';}
function journeyEndingActions(){return '<button class="primary art-gold" data-action="records">回小屋 · 等下一封来信</button><button class="secondary" data-action="challenge">进入90秒星光挑战</button><button class="text-button" data-action="map">重访旅途 · 收集三星</button>';}
function showJourneyEnding(){
 if(!journeyComplete()){showScreen('map');return;}
 showDialog('<section class="journey-ending"><div class="result-small-art">'+portrait(0)+'</div><small>当前 '+levels.length+' 关已全部完成</small><h2 id="dialogTitle">未完待续</h2><blockquote>“'+journeyEndingWords()+'”<span>—— 月见</span></blockquote><p>谢谢你，把每一份心愿带回家。</p></section><div class="journey-ending-actions">'+journeyEndingActions()+'</div>');
}
function decorateJourneyEnding(screen){
 if(!lastResult?.won||state.mode!=='story'||!journeyComplete()||(!lastResult.firstClear&&state.level!==levels.length-1))return;
 const result=screen.querySelector('.mobile-result');if(!result)return;
 result.classList.add('journey-finale');
 result.querySelector('h1').textContent='未完待续';
 const copy=result.querySelector('h1 + p');if(copy)copy.textContent='当前 '+levels.length+' 关已全部完成，感谢你一路同行。';
 if(copy)copy.insertAdjacentHTML('afterend','<blockquote class="journey-ending-quote">“'+journeyEndingWords()+'”<span>—— 月见</span></blockquote>');
 const actions=result.querySelector('.result-actions');if(actions)actions.innerHTML=journeyEndingActions();
}
function journeyReward(group){return group<collectibles.length?collectibles[group]:journeyPostcards[group-collectibles.length];}
function journeyRewardArt(group,extra=''){
 if(group<collectibles.length)return collectionArt(group,extra);
 const c=journeyReward(group);return '<span class="journey-postcard-art postcard-scene-'+c.scene+' '+extra+'" role="img" aria-label="'+c.name+'"><i aria-hidden="true">✦</i></span>';
}
function postcardOwned(i){return !!data.stars[journeyPostcards[i].level-1];}
function postcardAlbum(){
 const owned=journeyPostcards.filter((_,i)=>postcardOwned(i)).length;
 return '<section class="postcard-album"><h3>旅途后记 · '+owned+'/'+journeyPostcards.length+'</h3><p>第37—72关，每三关留下一页故事。</p><div class="postcard-grid">'+journeyPostcards.map((c,i)=>'<button data-action="journeyPostcard" data-card="'+i+'" class="'+(postcardOwned(i)?'':'postcard-locked')+'">'+journeyRewardArt(i+12)+'<b>'+c.name+'</b><small>'+(postcardOwned(i)?data.home.postcardsRead.includes(c.id)?'已珍藏':'新故事 · 待阅读':'第'+c.level+'关收藏')+'</small></button>').join('')+'</div></section>';
}
function showJourneyPostcard(i){
 const c=journeyPostcards[i];if(!c)return;const owned=postcardOwned(i);
 if(owned&&!data.home.postcardsRead.includes(c.id)){data.home.postcardsRead.push(c.id);persist();}
 showDialog('<section class="postcard-letter">'+journeyRewardArt(i+12)+'<small>'+c.place+' · '+(owned?'已收入旅途后记':'故事预告')+'</small><h2 id="dialogTitle">'+c.name+'</h2><p>'+(owned?c.story:'和'+c.speaker+'重访'+c.place+'。完成第'+(c.level-2)+'—'+c.level+'关，把这一页故事收入小屋回忆。')+'</p><span>—— '+c.speaker+'</span></section><button class="primary" data-action="'+(owned?'rgMemories':'journey')+'">'+(owned?'放回小屋回忆册':'继续旅途 · 第'+data.unlocked+'关')+'</button>');
}
function returnJourneyWish(){
 if(journeyComplete())return {title:'未完待续',action:'journeyEnding',button:'未完待续 · 下一程再相见',detail:'这一程的心愿已带回家，下一次冒险，我们还要一起出发',upcoming:true};
 const unread=journeyPostcards.findIndex((c,i)=>postcardOwned(i)&&!data.home.postcardsRead.includes(c.id));
 if(unread>=0)return {title:'新故事 · '+journeyPostcards[unread].name,action:'journeyPostcardNext',button:'读一页旅途后记',detail:journeyPostcards[unread].place+' · 已收入小屋回忆',upcoming:true};
 const next=journeyPostcards.findIndex((_,i)=>!postcardOwned(i));
 if(next>=0)return {title:'下一页故事 · '+journeyPostcards[next].name,action:'journey',button:'继续第 '+data.unlocked+' 关',detail:journeyPostcards[next].place+' · 再过'+(3-stageCount(next+12))+'关收藏',upcoming:true};
 return {title:'七十二关的故事，都在这里',action:'rgMemories',button:'翻开我们的旅途后记',detail:'十二件小屋收藏与十二页旅途后记，已经全部带回家',upcoming:true};
}
function returnJourneyDock(){
 const next=journeyPostcards.findIndex((_,i)=>!postcardOwned(i)),unread=journeyPostcards.findIndex((c,i)=>postcardOwned(i)&&!data.home.postcardsRead.includes(c.id));
 const i=unread>=0?unread:next<0?11:next,c=journeyPostcards[i],owned=postcardOwned(i);
 return '<div class="rg-dock"><div class="rg-wish"><span class="rg-prize">'+journeyRewardArt(i+12)+'</span><div><small>'+(journeyComplete()?'未完待续 · 下一程再相见':owned?'新故事到家':'下一页旅途后记')+'</small><b>'+c.name+'</b><small>'+c.place+(owned?'':' · 再过'+(3-stageCount(i+12))+'关')+'</small></div><button class="rg-preview-link" data-action="journeyPostcard" data-card="'+i+'">'+(owned?'阅读':'预告')+' ›</button></div><button class="primary art-gold" data-action="'+(owned?'journeyPostcard':'journey')+'" data-card="'+i+'">'+(owned?'翻开这一页故事':'继续第 '+data.unlocked+' 关')+'</button></div>';
}
function renderReturnResult(){
 const r=lastResult,i=state.level,g=Math.floor(i/3),c=journeyReward(g),gift=r.won&&i%3===2,rew=r.reward||{coins:0,diamonds:0};
 return '<section class="mobile-result"><div class="result-small-art">'+portrait(data.partner)+'</div><div class="result-stars">'+(r.won?'★'.repeat(r.stars)+'☆'.repeat(3-r.stars):'✧')+'</div><h1 class="screen-title" tabindex="-1">'+(r.won?gift?'这一页故事，留给我们的家':'又留下一点新的星光':'调整一步，再出发')+'</h1><p>第'+(i+1)+'关 · '+levels[i].title+'</p><div class="result-tally"><span>本局星光<strong>'+state.score.toLocaleString()+'</strong></span><span>剩余步数<strong>'+state.moves+'</strong></span></div>'+chapterResultGoals()+(r.won?'<div class="earned-currency">'+lobbyIcon('coin')+'<b>+'+rew.coins+'</b>'+(rew.diamonds?lobbyIcon('diamond')+'<b>+'+rew.diamonds+'</b>':'')+'<small>'+(r.firstClear?'首次通关奖励':'重玩奖励')+'</small></div>'+(gift?'<div class="world-reward-reveal">'+journeyRewardArt(g)+'<h2>'+c.name+'</h2><p>'+(r.firstClear?'旅途后记已收入小屋回忆':'故事已珍藏 · 星级记录已更新')+'</p><button class="secondary" data-action="journeyPostcard" data-card="'+(g-12)+'">读'+c.speaker+'的故事</button></div>':stagePreparation(i))+(r.firstClear&&[47,59,71].includes(i)?'<p class="room-theme-unlock">小屋新氛围已解锁 · '+['森林夜色','潮汐星光','归航星夜'][[47,59,71].indexOf(i)]+'。回小屋就能看到，也可切换。</p>':'')+'<div class="result-actions">'+(i<levels.length-1?'<button class="primary art-gold" data-action="next">继续第 '+(i+2)+' 关</button>':'<button class="primary art-gold" data-action="records">七十二关完成 · 一起回家</button>')+'<button class="secondary" data-action="rgMemories">回小屋翻看旅途后记</button></div>':chapterFailure()+'<button class="primary" data-action="retry">调整伙伴与道具，再试一次</button>')+'<button class="text-button" data-action="map">回旅途地图</button></section>';
}
function handleJourneyPostcardAction(b){
 if(b.dataset.action==='journeyEnding'){showJourneyEnding();return true;}
 if(b.dataset.action==='journeyPostcard'){const i=Number(b.dataset.card);if(Number.isInteger(i))showJourneyPostcard(i);return true;}
 if(b.dataset.action==='journeyPostcardNext'){const i=journeyPostcards.findIndex((c,n)=>postcardOwned(n)&&!data.home.postcardsRead.includes(c.id));showJourneyPostcard(i<0?11:i);return true;}
 return false;
}
