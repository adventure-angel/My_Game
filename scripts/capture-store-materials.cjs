// Capture the unchanged v30 build in an isolated browser, never the player's profile.
const {chromium}=require('../.capture-tools/node_modules/playwright-core');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dir=path.resolve('release/taptap-materials-v30');fs.mkdirSync(dir,{recursive:true});
const source=path.resolve('release/h5-playtest-v30/index.html');
const records=[];
const base={version:4,prologueSeen:true,music:false,sound:false,soundDefaultVersion:1,motion:true,vibration:false,unlocked:1,stars:Array(36).fill(0),bestTime:0,partner:0,snapshot:null};
const items=['nightlight','musicbox','photo','letter'];
const developed={...base,unlocked:13,stars:Array.from({length:36},(_,i)=>i<12?2:0),economy:{version:2,coins:600,diamonds:0,ownedPartners:[0,1],inventory:{hammer:3,shuffle:2},chapterSupply:true},home:{version:2,placements:Object.fromEntries(items.map(i=>[i,i])),seen:items,read:['welcome','forest'],lamp:true,styles:{},memories:items,events:items.map((id,i)=>({id,items:items.slice(0,i+1),lamp:true,styles:{},layoutVersion:2}))}};
async function run(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 async function open(save){
  const context=await browser.newContext({viewport:{width:432,height:864},deviceScaleFactor:2.5,isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:4329/');
  await page.evaluate(s=>localStorage.setItem('starCandyV2',JSON.stringify(s)),save);
  await page.reload();await page.locator('[data-action="enterLobby"]').click();
  await page.waitForTimeout(700);return {page,context};
 }
 async function shot(page,file,state){
  await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(600);
  await page.screenshot({path:path.join(dir,file),type:'png'});
  records.push({file,width:1080,height:2160,state,source:'Unmodified v30 rendered UI; isolated staged save, not a real player account'});
 }
 const fresh=await open(base),p=fresh.page;
 await shot(p,'01-lobby.png','新游戏大厅');
 await p.locator('[data-route="records"]').click();await shot(p,'05-room-before.png','零收藏的初始小屋');
 await fresh.context.close();
 const rich=await open(developed),q=rich.page;
 await q.locator('[data-route="map"]').click();
 console.log('Map buttons:',await q.locator('button:visible').allTextContents());
 // Return to the first chapter via its visible previous button when needed.
 const previous=q.locator('[data-action="worldPrev"]');if(await previous.count())await previous.click();
 await shot(q,'03-journey.png','旅途地图；演示存档已完成前12关');
 await q.locator('[data-route="partners"]').click();await shot(q,'04-companion.png','月见伙伴页');
 await q.locator('[data-route="records"]').click();await shot(q,'06-room-after.png','前四份收藏实际摆放、夜灯点亮后的房间；演示存档');
 await q.locator('[data-route="map"]').click();
 console.log('Battle entry buttons:',await q.locator('button:visible').allTextContents());
 const level=q.locator('[data-action="level"]:not([disabled])').first();await level.click();
 console.log('Prep:',await q.locator('button:visible').allTextContents());
 await q.getByRole('button',{name:/开始挑战 · 消耗/}).click();await q.waitForTimeout(800);
 await shot(q,'02-match3.png','真实游戏棋盘，当前关卡刚开局');
 await rich.context.close();await browser.close();
 fs.writeFileSync(path.join(dir,'capture-provenance.json'),JSON.stringify({capturedAt:new Date().toISOString(),source:'release/h5-playtest-v30/index.html',sha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),viewport:{width:432,height:864,deviceScaleFactor:2.5},note:'Screenshots are actual unchanged game UI with isolated staging saves. No UI text/art is composited onto screenshots. Original player saves are untouched.',records},null,2));
}
run().catch(e=>{console.error(e);process.exit(1)});
