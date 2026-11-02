const fs=require('fs');
let text=fs.readFileSync('src/world-flow.js','utf8');
text=text.replace('class="secondary" data-action="close">关上信箱','class="secondary" data-action="wcRefresh">关上信箱');
text=text.replace('class="primary art-gold" data-action="journey">\'+(data.stars.every(Boolean)?\'重访旅途','class="primary art-gold" data-action="\'+(data.stars.every(Boolean)?\'map\':\'journey\')+\'">\'+(data.stars.every(Boolean)?\'重访旅途');
text=text.replace('musicBoxContext.resume();const ctx=',"musicBoxContext.resume().catch(()=>{stopMusicBox();toast('声音暂时未能播放，请再轻触八音盒。');});const ctx=");
fs.writeFileSync('src/world-flow.js',text);
