/* User-selected Stable Audio tracks; bytes embedded by build-game.cjs. */
window.StarCandyMusic=(()=>{
 const assets=__MUSIC_ASSETS__;
 let ctx,enabled=true,unlocked=false,scene='menu',active=null,request=0,duckFactor=1;
 const decoded=new Map();
 const transitionSeconds=2, switchSeconds=1.2;
 // Keep our own envelope so a rapid scene change starts at the current volume.
 function volumeAt(track,t){
  const e=track.envelope;if(!e)return 0;
  const p=Math.max(0,Math.min(1,(t-e.start)/e.duration));
  return e.from+(e.to-e.from)*(1-Math.cos(Math.PI*p))/2;
 }
 function fade(track,to,duration){
  if(!track)return;const t=ctx.currentTime,from=volumeAt(track,t),param=track.gain.gain;
  param.cancelScheduledValues(t);param.setValueAtTime(from,t);
  for(let i=1;i<=40;i++)param.linearRampToValueAtTime(from+(to-from)*(1-Math.cos(Math.PI*i/40))/2,t+duration*i/40);
  track.envelope={from,to,start:t,duration};
 }
 function fadeOut(track,duration=transitionSeconds){
  if(!track)return;fade(track,0,duration);
  try{track.source.stop(ctx.currentTime+duration+.05);}catch(_){}
 }
 async function buffer(key){
  if(!decoded.has(key)){const promise=(async()=>{const bytes=Uint8Array.from(atob(assets[key]),c=>c.charCodeAt(0));return await ctx.decodeAudioData(bytes.buffer);})();decoded.set(key,promise);promise.catch(()=>decoded.delete(key));}
  return decoded.get(key);
 }
 async function play(){
  if(!enabled||!unlocked||document.hidden||!ctx)return;
  const ticket=++request,key=scene;
  try{await ctx.resume();if(ticket!==request||!enabled||document.hidden||key!==scene)return;if(active?.key===key)return;const audio=await buffer(key);if(ticket!==request||!enabled||document.hidden||key!==scene)return;
   const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=audio;source.loop=true;source.connect(gain);gain.connect(ctx.destination);gain.gain.setValueAtTime(0,ctx.currentTime);
   const previous=active,track={key,source,gain,envelope:null};
   source.onended=()=>{source.disconnect();gain.disconnect();};
   source.start();fade(track,.55*duckFactor,previous?transitionSeconds:switchSeconds);fadeOut(previous);active=track;
  }catch(_){/* A later user gesture retries decoding or browser audio permission. */}
 }
 function unlock(){unlocked=true;if(!enabled)return;try{ctx||=new(window.AudioContext||window.webkitAudioContext)();buffer('menu').catch(()=>{});buffer('game').catch(()=>{});if(!active||active.key!==scene||ctx.state!=='running')play();}catch(_){}}
 function set(value){enabled=!!value;if(!enabled){request++;fadeOut(active,switchSeconds);active=null;}else if(unlocked)unlock();}
 function setScene(value){const next=value==='game'?'game':'menu';if(scene===next)return;scene=next;play();}
 document.addEventListener('pointerdown',unlock,{passive:true});document.addEventListener('keydown',unlock);
 document.addEventListener('visibilitychange',()=>{request++;if(!ctx)return;if(document.hidden)ctx.suspend().catch(()=>{});else if(enabled&&unlocked)play();});
 window.addEventListener('pagehide',()=>{request++;if(ctx)ctx.suspend().catch(()=>{});});
 window.addEventListener('pageshow',()=>{if(enabled&&unlocked)play();});
 function duck(value){const next=Math.max(0,Math.min(1,value));if(next===duckFactor)return;duckFactor=next;if(active&&ctx)fade(active,.55*duckFactor,.8);}
 return {set,scene:setScene,duck};
})();
