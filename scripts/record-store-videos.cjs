// Record actual v30 frames and Web Audio output in an isolated browser.
const {chromium}=require('../.capture-tools/node_modules/playwright-core');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'release/taptap-videos-v30'),raw=path.join(out,'source');fs.mkdirSync(raw,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const log=[];
function audioTap(){
 const connect=AudioNode.prototype.connect,contexts=new Map();let mixer,dest,rec,chunks=[];
 function ensure(){if(!mixer){mixer=new AudioContext();dest=mixer.createMediaStreamDestination();}return mixer;}
 AudioNode.prototype.connect=function(target,...args){
  const result=connect.call(this,target,...args);
  if(target instanceof AudioDestinationNode){
   let sink=contexts.get(this.context);
   if(!sink){sink=this.context.createMediaStreamDestination();contexts.set(this.context,sink);const m=ensure(),source=m.createMediaStreamSource(sink.stream);connect.call(source,dest);}
   connect.call(this,sink);
  }return result;
 };
 window.startAudioCapture=async()=>{ensure();await mixer.resume();chunks=[];rec=new MediaRecorder(dest.stream,{mimeType:'audio/webm;codecs=opus'});rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};rec.start(100);};
 window.stopAudioCapture=()=>new Promise(resolve=>{rec.onstop=async()=>{const a=new Uint8Array(await new Blob(chunks).arrayBuffer());let s='';for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.subarray(i,i+8192));resolve(btoa(s));};rec.stop();});
}
async function main(){
 const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(fs.readFileSync(path.join(root,'release/h5-playtest-v30/index.html')))});await new Promise(r=>server.listen(4331,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--autoplay-policy=no-user-gesture-required']});
 const context=await browser.newContext({viewport:{width:432,height:864},deviceScaleFactor:1.6666666667,isMobile:true,hasTouch:true});await context.addInitScript(audioTap);
 const page=await context.newPage();page.setDefaultTimeout(6000);
 const save={version:4,prologueSeen:true,music:true,sound:true,soundDefaultVersion:1,motion:true,vibration:false,unlocked:12,stars:Array.from({length:36},(_,i)=>i<11?2:0),bestTime:0,partner:1,snapshot:null,economy:{version:2,coins:600,diamonds:0,ownedPartners:[0,1],inventory:{hammer:3,shuffle:2}},home:{version:2,placements:{},seen:[],read:['welcome'],lamp:false,styles:{},memories:[],moments:[],events:[]}};
 await page.goto('http://127.0.0.1:4331');await page.evaluate(s=>localStorage.setItem('starCandyV2',JSON.stringify(s)),save);await page.reload();await page.locator('[data-action="enterLobby"]').click();
 const cdp=await context.newCDPSession(page);
 async function capture(name,flow){
  const folder=path.join(raw,name);fs.mkdirSync(folder,{recursive:true});let frames=[],pending=[],seq=0;
  const onframe=e=>{const n=seq++,file=String(n).padStart(5,'0')+'.jpg';pending.push(fs.promises.writeFile(path.join(folder,file),Buffer.from(e.data,'base64')));frames.push({file,t:e.metadata.timestamp});cdp.send('Page.screencastFrameAck',{sessionId:e.sessionId}).catch(()=>{});};
  cdp.on('Page.screencastFrame',onframe);await page.evaluate(()=>startAudioCapture());const start=Date.now();
  await cdp.send('Page.startScreencast',{format:'jpeg',quality:90,maxWidth:720,maxHeight:1440,everyNthFrame:1});
  await flow();await sleep(300);await cdp.send('Page.stopScreencast');cdp.off('Page.screencastFrame',onframe);
  const audio=await page.evaluate(()=>stopAudioCapture());fs.writeFileSync(path.join(raw,name+'.webm'),Buffer.from(audio,'base64'));await Promise.all(pending);
  const duration=(Date.now()-start)/1000;
  let concat='ffconcat version 1.0\n';for(let i=0;i<frames.length;i++){concat+=`file '${frames[i].file}'\noption framerate 1000\nduration ${Math.max(.001,i+1<frames.length?frames[i+1].t-frames[i].t:Math.max(.05,duration-(frames[i].t-frames[0].t))).toFixed(6)}\n`;}concat+=`file '${frames.at(-1).file}'\noption framerate 1000\n`;fs.writeFileSync(path.join(folder,'frames.txt'),concat);
  cp.execFileSync('ffmpeg',['-y','-v','error','-f','concat','-safe','0','-i',path.join(folder,'frames.txt'),'-i',path.join(raw,name+'.webm'),'-vf','scale=720:1440:flags=lanczos,setsar=1,fps=30','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-af','apad','-t',String(duration),'-shortest','-movflags','+faststart',path.join(out,name+'.mp4')],{stdio:'inherit'});
  log.push({name,frames:frames.length,duration,audio:'Captured actual game Web Audio, no replacement track'});console.log(name,frames.length,duration);
 }
 await page.locator('[data-route="map"]').click();
 console.log('map',await page.locator('button:visible').evaluateAll(bs=>bs.map(b=>({text:b.textContent,action:b.dataset.action,level:b.dataset.level,group:b.dataset.group}))));
 const group=page.locator('[data-action="stageGroup"][data-group="3"]');if(await group.count())await group.click();
 await page.locator('[data-action="level"][data-level="11"]').last().click();await page.getByRole('button',{name:/开始挑战 · 消耗/}).click();await sleep(1100);
 async function move(){
  const indices=await page.evaluate(()=>{
   const tiles=[...document.querySelectorAll('.tile')].sort((a,b)=>+a.dataset.index-+b.dataset.index);if(tiles.length!==49)return null;
   const cells=tiles.map(t=>({k:+t.dataset.k,s:t.dataset.s}));let best=null,bestScore=-1;
   function matches(){const set=new Set();for(let a=0;a<49;a++){if(a%7<5&&cells[a].k===cells[a+1].k&&cells[a].k===cells[a+2].k)[a,a+1,a+2].forEach(i=>set.add(i));if(a<35&&cells[a].k===cells[a+7].k&&cells[a].k===cells[a+14].k)[a,a+7,a+14].forEach(i=>set.add(i));}return set;}
   for(let a=0;a<49;a++)for(const b of [a%7<6?a+1:-1,a<42?a+7:-1])if(b>=0){[cells[a],cells[b]]=[cells[b],cells[a]];const m=matches();let score=m.size;if(cells[a].s==='rainbow'||cells[b].s==='rainbow')score+=10;for(const i of m){if(tiles[i].className.includes('ice'))score+=2;}[cells[a],cells[b]]=[cells[b],cells[a]];if(score>bestScore&&score>0){best=[a,b];bestScore=score;}}
   return best;
  });if(!indices)return false;
  for(const i of indices){await page.locator('.tile[data-index="'+i+'"]').tap();await sleep(220);}return true;
 }
 await capture('gameplay-raw',async()=>{
  const start=Date.now();await sleep(1800);let used=false;
  while(Date.now()-start<44000){
   if(await page.locator('#gamePage').isHidden())break;
   const skill=page.locator('#skill');
   if(!used&&await skill.isEnabled()){await skill.tap();await page.locator('.tile[data-index="24"]').tap();used=true;await sleep(3300);}
   if(!(await move()))break;await sleep(3300);
   if(await page.locator('#veil').isVisible())break;
  }await sleep(1800);
 });
 await page.locator('#homeButton').click();
 await capture('lobby',async()=>{await sleep(4500)});
 await page.locator('[data-route="map"]').click();await capture('journey',async()=>{await sleep(5500)});
 await page.locator('[data-route="partners"]').click();await capture('partners',async()=>{await sleep(2500);await page.locator('[data-action="viewArtPartner"][data-partner="0"]').click();await sleep(2800)});
 await page.locator('[data-route="records"]').click();
 await capture('first-light',async()=>{await sleep(1200);await page.locator('[data-action="rgPreview"][data-item="0"]').first().click();await sleep(1100);await page.locator('[data-action="rgPlace"][data-item="0"]').click();await sleep(1000);await page.locator('[data-action="rgLight"]').click();await sleep(6200)});
 fs.writeFileSync(path.join(out,'recording-provenance.json'),JSON.stringify({date:new Date().toISOString(),source:'release/h5-playtest-v30/index.html',note:'Unmodified v30 game. Isolated staged progress used to enter levels and demonstrate earned nightlight. Moves, skill and placement performed through actual UI; no game-state edits while filming. Continuous gameplay has no captions, voiceover, device chrome or picture-in-picture.',log},null,2));
 await context.close();await browser.close();await new Promise(r=>server.close(r));
}
main().catch(e=>{console.error(e);process.exit(1)});
