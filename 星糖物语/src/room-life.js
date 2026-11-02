// Daily notes are small keepsakes, not an additional reward currency or streak.
const roomDailyLines={
 quiet:[
  ['给刚到家的你','窗边的位置一直为你留着。今天不用急着走很远，一起找回一点星光就好。'],
  ['一份小小邀请','我把今天的第一杯茶留给了你。等我们找到夜灯，就能在暖光里慢慢喝。'],
  ['窗外的云','今天的云像一颗柔软的星糖。猫咪看了好久，我想，它也在等你回来。'],
  ['空着的位置','屋子还有许多空位置，正好留给我们的故事。先从喜欢的一件小东西开始吧。'],
  ['不着急的日子','如果今天只想坐一会儿，也很好。冒险可以慢慢来，小屋会一直在这里。'],
  ['猫咪的约定','猫咪在沙发上给你留了一小块地方。它装作睡着了，耳朵却一直朝着门口。'],
  ['把心愿带回家','我喜欢你认真挑选的样子。等第一盏灯亮起来，我们就有自己的归处了。']
 ],
 warm:[
  ['窗边的微光','你安放的夜灯，让这个角落有了家的感觉。今晚回来时，我们再一起点亮它。'],
  ['把脚步放轻','猫咪今天绕着夜灯走了一圈，又回到沙发上。它好像也认得你带回来的光。'],
  ['给忙碌的你','不必每次都带礼物回来。你推开门的时候，这间屋子就已经热闹了一点。'],
  ['下一段旋律','屋子里有了灯，我开始想象音乐响起的样子。下一次，一起去温室听听吧。'],
  ['云后的月亮','月亮躲进云里也没关系。窗台还有你留下的那盏灯，陪我们等它出来。'],
  ['温柔的角落','我把窗边收拾好了。你若想休息，就坐在离夜灯近一点的地方。'],
  ['今天也欢迎回家','有些心愿很小，却会让一整天变暖。比如留一盏灯，也比如等一个人回来。']
 ],
 lived:[
  ['旋律里的午后','我刚刚又听了一遍八音盒。你带回来的旋律，把普通的午后也变成了回忆。'],
  ['慢半拍也很好','猫咪跟着八音盒的旋律点了点头。今天我们也慢半拍，不急着赶路。'],
  ['关于下一次冒险','有音乐陪伴的小屋，连等待都变得轻快。下一份心愿，你想先摆在哪里？'],
  ['只属于这里的声音','窗外有风，屋里有你选的旋律。闭上眼睛，也能认出这是我们的家。'],
  ['一首歌的时间','如果今天很忙，就留下听一小段吧。等你回来，我们再接着讲旅途的故事。'],
  ['猫咪的听众席','它今天选好了听歌的位置，还把尾巴摆得整整齐齐。看来八音盒有一位忠实听众。'],
  ['留给明天的心愿','今天不用完成所有事。我们可以留一点期待，等下次回来时再一起打开。']
 ],
 home:[
  ['今天的两杯茶','茶具已经摆好，我也留好了你的位置。小屋的模样，是我们一点一点带回来的。'],
  ['合照旁边','我又看了看我们的合照。旅途里的风已经过去，那时候的笑容却一直留在这里。'],
  ['森林的来信','森林的朋友说，营地里有像云一样的烛台。等它来到家里，阅读角就能亮起来了。'],
  ['好好休息的理由','抱枕、花香，还有你喜欢的摆设，都是可以安心休息的理由。今天也辛苦啦。'],
  ['下一页故事','我把书页翻到了一处喜欢的地方。等你有空，我们一起把后面的故事读完。'],
  ['家的声音','听，猫咪的呼噜声混在窗外的风里。原来家的声音，可以这样轻。'],
  ['为你留下的位置','不管旅途走到了哪里，这里总有一个位置留给你。回来坐坐，再决定下一次出发。']
 ]
};
function roomDayNumber(){const [y,m,d]=localDay().split('-').map(Number);return Math.floor(Date.UTC(y,m-1,d)/86400000);}
const roomHomeExtra=[
 ['窗台的新影子','你摆下的每件收藏，都在月光里有了自己的位置。今天回家，先看看哪一角最亮。'],
 ['一页新的回忆','旅途后记又添了一页。等你坐下，我想听你说说最喜欢哪一段。'],
 ['茶桌边的晚安','杯子已经放好，猫咪也找到了舒服的位置。今晚的小屋很安静。'],
 ['星光的方向','窗外的星光换了方向，屋里这盏灯却还在原来的地方等你。'],
 ['把故事放慢','我们不急着翻完所有书页。先在小屋坐一会儿，也算今天的心愿。'],
 ['门口的脚步声','每次听见你回来，猫咪都会先抬起耳朵，再装作什么都没发生。'],
 ['新的摆法','今天把收藏换个位置，熟悉的小屋也会出现一点新的风景。'],
 ['月光留给你','我把窗边收拾好了。你若想看星星，就坐在最亮的地方。']
];
function recordRoomNoteSignal(type,id){
 if(!data.home||!['clear','place','partner'].includes(type)||!Number.isInteger(id))return;
 data.home.noteSignals=[...(data.home.noteSignals||[]),{type,id,at:Date.now()}].slice(-12);
}
function roomSignalNote(signal){
 if(signal.type==='place'&&collectibles[signal.id])return ['新收藏到家','你刚把'+collectibles[signal.id].name+'摆进小屋。我还想再看一眼你选的位置。'];
 if(signal.type==='partner'&&partners[signal.id])return ['新伙伴的座位',partners[signal.id].name+'已经和我们同行。我在小屋里给大家留了说话的位置。'];
 if(signal.type==='clear'&&levels[signal.id])return ['刚走过的这一站','第'+(signal.id+1)+'关已经完成。'+(signal.id+1===48?'森林夜色也来到了窗边。':signal.id+1===60?'潮汐的光留在了地板上。':signal.id+1===72?'现在，归航的星夜也在小屋里等你。':'回来歇一会儿，再决定下一站。')];
 return null;
}
function roomDailyNote(){
 const day=localDay();let note=data.home.dailyNotes.find(n=>n.day===day);if(note)return note;
 const kind=roomPlaced(3)&&roomPlaced(2)?'home':roomPlaced(1)?'lived':roomPlaced(0)?'warm':'quiet';
 const signals=(data.home.noteSignals||[]).filter(s=>Date.now()-s.at<=3*86400000&&s.at<=Date.now()).sort((a,b)=>b.at-a.at);
 const signal=signals[0];let chosen=signal&&roomSignalNote(signal);
 if(signal)data.home.noteSignals=data.home.noteSignals.filter(s=>s!==signal&&Date.now()-s.at<=3*86400000);
 if(!chosen){const pool=[...roomDailyLines[kind],...(kind==='home'?roomHomeExtra:[])],recent=new Set(data.home.dailyNotes.slice(-14).map(n=>n.title));const start=roomDayNumber()%pool.length;chosen=Array.from({length:pool.length},(_,i)=>pool[(start+i)%pool.length]).find(row=>!recent.has(row[0]))||pool[start];}
 note={day,title:chosen[0],text:chosen[1],read:false};data.home.dailyNotes=[...data.home.dailyNotes.filter(n=>n.day!==day),note].sort((a,b)=>a.day.localeCompare(b.day)).slice(-14);persist();return note;
}
function showRoomDailyNote(){
 const note=roomDailyNote();if(!note.read){note.read=true;persist();}
 const older=data.home.dailyNotes.filter(n=>n.day<note.day).slice(-6).reverse();
 showDialog('<section class="room-note"><small>月见留给你的便签 · '+releaseEsc(note.day)+'</small><h2 id="dialogTitle">'+releaseEsc(note.title)+'</h2><p>'+releaseEsc(note.text)+'</p><span class="room-note-sign">月见 ✧</span></section><button class="primary" data-action="roomNoteReturn">回小屋坐坐</button>'+(older.length?'<details class="room-note-history"><summary>翻看最近的便签</summary>'+older.map(n=>'<article><small>'+releaseEsc(n.day)+'</small><b>'+releaseEsc(n.title)+'</b><p>'+releaseEsc(n.text)+'</p></article>').join('')+'</details>':''));
}
const roomCatLines=[
 ['你轻轻挠了挠它的下巴。猫咪把眼睛眯成了一条线。','它用额头碰了碰你的手，尾巴慢慢扫过沙发。','你把手伸过去，它先闻了闻，再安心地靠过来。'],
 ['猫咪听见八音盒，耳朵一动一动地跟着旋律。','它安静地趴好，像是在认真听这一小段歌。','音乐停顿了一下，它抬头看你，似乎想再听一遍。'],
 ['它在你铺好的星毯上翻了个身，把最暖的位置让出一点。','猫咪踩了踩柔软的星毯，又把爪子整齐地收好。','它把星毯当成了自己的小岛，邀请你在旁边坐坐。']
];
let roomCatTouches=0,roomChimeTimer=0;
function roomPetCat(){
 if(roomStory)return;
 const lines=roomCatLines[roomPlaced(8)?2:musicBoxPlaying?1:0],text=lines[(roomDayNumber()+roomCatTouches++)%lines.length];
 roomSay(text,true);const speaker=document.querySelector('.rg-speech b');if(speaker)speaker.textContent='猫咪';if(data.sound)tone(1);
 const scene=document.querySelector('.growing-room');if(scene){scene.classList.remove('rg-cat-tail','rg-cat-ears','rg-cat-roll');void scene.offsetWidth;scene.classList.add(['rg-cat-tail','rg-cat-ears','rg-cat-roll'][roomCatTouches%3]);}
}
function roomItemReply(i){
 const replies={
  4:['烛光晃了一下。月见把书挪近一点：“这一页，我们一起读。”','云朵般的暖光落在书页上。猫咪也靠近了阅读角。'],
  5:['你轻轻碰了碰叶尖，小花盆里的绿意随风晃了晃。','月见替花盆转了个方向：“这样，今天也能多晒一点月光。”'],
  6:['书页里夹着澪留下的书签，刚好停在一个温柔的结尾。','你翻开故事集。月见笑着说：“上次，我们就读到这里。”'],
  7:['灯笼轻轻摇了一下，门廊上的月影也跟着动起来。','你抬头看了看灯笼。晚归的时候，它会替我们照亮门口。'],
  8:['猫咪踩过你铺的星毯，留下一小片暖暖的褶皱。','你抚平星毯的一角，猫咪立刻又把那里当成了枕头。'],
  9:['星晶映出一小片柔光，像把海边的夜色留在了屋里。','换个角度看，星晶里的光就变了。月见说，这是海浪留下的小秘密。'],
  10:['你轻轻转动星望镜，窗外的一点星光落进视野。','月见凑过来：“下一次，一起去看看那颗更远的星星吧。”'],
  11:['你碰了碰星海挂饰，十二站的心愿轻轻晃在一起。','星链发出细小的光。一路带回来的故事，都在这里了。']
 };
 return replies[i]?.[roomDayNumber()%2]||roomLines[i];
}
function forestWishAvailable(){return !!data.stars[11];}
function forestWishCard(){
 if(!forestWishAvailable())return '';
 const owned=ownedItem(4),left=3-stageCount(4);
 return '<button class="forest-wish-card" data-action="forestWish">'+collectionArt(4)+'<span><small>下一段故事 · 萤火营地</small><b>为阅读角带回云朵烛台</b><span>'+(owned?'已获得 · 点击看看它的故事':'第15关获得 · 还差'+left+'关')+'</span></span><i aria-hidden="true">›</i></button>';
}
function showForestWish(){
 if(!forestWishAvailable())return;
 const owned=ownedItem(4),left=3-stageCount(4);
 showDialog('<section class="forest-letter"><small>森林来信 · 萤火营地</small><h2 id="dialogTitle">把一小片暖光带回家</h2>'+collectionArt(4,'collection-large')+'<p>“营地里的夜晚有一点凉。我们做了一盏像云朵一样的烛台，想送给愿意听故事的朋友。”</p><p>月见把来信折好：“等它来到家里，我们就能在阅读角，一起读完睡前的故事了。”</p><strong>'+(owned?'云朵烛台已收入收藏柜':'完成第13—15关 · 还差'+left+'关')+'</strong><p class="forest-wish-effect">摆放后：阅读角亮起第二层暖光，轻触烛台可听见月见的回应。</p></section><button class="primary" data-action="rgPreview" data-item="4">'+(owned?'把烛台摆进小屋':'预览摆进小屋的样子')+'</button>'+(!owned?'<button class="secondary" data-action="journey">出发去萤火营地</button>':''));
}
function handleRoomLifeAction(b){
 const a=b.dataset.action;
 if(a==='roomDailyNote'){showRoomDailyNote();return true;}
 if(a==='roomNoteReturn'){closeDialog();showScreen('records');return true;}
 if(a==='forestWish'){showForestWish();return true;}
 if(a==='roomChime'){
  if(!data.economy.activeDecor.includes('wishStar')||roomStory)return true;
  roomSay('你轻碰窗铃，清亮的一声落在窗边。月见说：“这是属于我们家的声音。”');
  const node=document.querySelector('.wish-chime');if(node){node.classList.remove('chime-playing');void node.offsetWidth;node.classList.add('chime-playing');clearTimeout(roomChimeTimer);roomChimeTimer=setTimeout(()=>node.classList.remove('chime-playing'),1500);}if(data.sound)tone(2);return true;
 }
 return false;
}
