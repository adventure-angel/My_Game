const fs=require('fs');
function edit(p,f){fs.writeFileSync(p,f(fs.readFileSync(p,'utf8')));}
edit('src/world-flow.js',s=>{
 s=s.replace("const homeSlots={window:'窗台',table:'桌面',wall:'墙面',rug:'地毯',hanging:'挂饰'};","const homeSlots={nightlight:'夜灯窗台',musicbox:'八音盒茶桌',photo:'回忆相框',letter:'来信与软装',candle:'阅读烛台',planter:'植物角',books:'故事书架',lantern:'门廊灯笼',rug:'猫咪星毯',coral:'星晶陈列',telescope:'观星角',mobile:'星海挂饰'};");
 const a=s.indexOf('function normalizeHome(raw){'),b=s.indexOf('\ndata.home=normalizeHome',a);
 if(a<0||b<0)throw Error('Missing home normalization');
 s=s.slice(0,a)+`// Dedicated slots preserve every collected object. Migrate v1 by item identity.
collectibles.forEach(c=>{c.slots=[c.id];});
function normalizeHome(raw){
 const h={version:2,placements:{},seen:[],read:[],lamp:true,styles:{},memories:[]};
 if(raw&&[1,2].includes(raw.version)){
  for(const id of Object.values(raw.placements||{})){const i=collectibles.findIndex(c=>c.id===id);if(i>=0&&ownedItem(i))h.placements[id]=id;}
  h.seen=Array.isArray(raw.seen)?[...new Set(raw.seen.filter(id=>collectibles.some((c,i)=>c.id===id&&ownedItem(i))))]:[];
  h.read=Array.isArray(raw.read)?[...new Set(raw.read.filter(id=>homeLetters.some(l=>l.id===id&&(!l.level||data.stars[l.level*3-1]))))]:[];
  h.lamp=raw.lamp!==false;
  for(const c of collectibles)h.styles[c.id]=raw.styles?.[c.id]===1?1:0;
  h.memories=Array.isArray(raw.memories)?[...new Set(raw.memories.filter(id=>collectibles.some((c,i)=>c.id===id&&ownedItem(i))))]:Object.values(h.placements);
 }
 return h;
}
`+s.slice(b);
 const ra=s.indexOf(" if(next==='records'){"),rb=s.indexOf(" if(next==='result'",ra);
 s=s.slice(0,ra)+" if(next==='records'){screen.innerHTML=renderGrowingRoom();return true;}\n"+s.slice(rb);
 s=s.replace('function handleWorldAction(b){','function handleWorldAction(b){\n if(handleRoomGrowthAction(b))return true;');
 s=s.replace('function worldBeforeRoute(next){','function worldBeforeRoute(next){\n if(next!==route)resetRoomGrowth();');
 return s;
});
edit('scripts/build-game.cjs',s=>s.replace("fs.readFileSync('src/world-flow.js','utf8')+'\\n'", "fs.readFileSync('src/world-flow.js','utf8')+'\\n'+fs.readFileSync('src/room-growth.js','utf8')+'\\n'").replace(" 'economy-props':'economy-props-v15.webp',", " 'room-base':'room-base-v25.webp',\n 'room-soft':'room-soft-v25.webp',\n 'economy-props':'economy-props-v15.webp',").replace("fs.readFileSync('src/dialog-close.css','utf8')", "fs.readFileSync('src/dialog-close.css','utf8')+fs.readFileSync('src/room-growth.css','utf8')"));
edit('scripts/package-mobile.cjs',s=>s.replace('v24 右上角关闭','v25 小屋成长'));
