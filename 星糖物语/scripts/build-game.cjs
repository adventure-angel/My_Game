const fs=require('fs');
if(!fs.existsSync('index.html')){
 const path=require('path'),crypto=require('crypto');
 const dir='template/index.html.parts',manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
 const bytes=Buffer.concat(manifest.parts.map(name=>fs.readFileSync(path.join(dir,name))));
 if(bytes.length!==manifest.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==manifest.sha256)throw Error('Template checksum mismatch');
 fs.writeFileSync('index.html',bytes);
}
let html=fs.readFileSync('index.html','utf8');
for(const [id,file] of [['engine','src/engine.js'],['elementEffects','scripts/element-effects.js'],['elementRules','src/elements.js'],['gameMusic','src/music.js'],['prologueReader','src/prologue-reader.js'],['releaseConfig','src/release-config.js'],['saveStore','src/save-store.js'],['playtestData','src/playtest-data.js'],['tapCloudAdapter','src/taptap-cloud.js'],['appScript','src/appScript.js']]){
 let source=fs.readFileSync(file,'utf8');
 if(id==='releaseConfig')source=source.replace('__RELEASE_CONFIG__',fs.readFileSync('config/release.json','utf8'));
 if(id==='appScript')source=source.replace('/* JOURNEY_EXPANSION_DATA */',fs.readFileSync('src/journey-expansion.js','utf8')).replace('/* GAME_FLOW_IMPLEMENTATION */',fs.readFileSync('src/month-card.js','utf8')+'\n'+fs.readFileSync('src/stamina.js','utf8')+'\n'+fs.readFileSync('src/commerce.js','utf8')+'\n'+fs.readFileSync('src/taptap-ads.js','utf8')+'\n'+fs.readFileSync('src/ad-economy.js','utf8')+'\n'+fs.readFileSync('src/economy-flow.js','utf8')+'\n'+fs.readFileSync('src/world-flow.js','utf8')+'\n'+fs.readFileSync('src/room-growth.js','utf8')+'\n'+fs.readFileSync('src/room-chapter.js','utf8')+'\n'+fs.readFileSync('src/room-life.js','utf8')+'\n'+fs.readFileSync('src/journey-postcards.js','utf8')+'\n'+fs.readFileSync('src/first-light.js','utf8')+'\n'+fs.readFileSync('src/first-chapter.js','utf8')+'\n'+fs.readFileSync('src/difficulty-bridge.js','utf8')+'\n'+fs.readFileSync('src/weekly-challenge.js','utf8')+'\n'+fs.readFileSync('src/world-water.js','utf8')+'\n'+fs.readFileSync('src/art-flow.js','utf8')+'\n'+fs.readFileSync('src/prologue.js','utf8')+'\n'+fs.readFileSync('src/taptap-cloud-ui.js','utf8')+'\n'+fs.readFileSync('src/release-ops.js','utf8')+'\n'+fs.readFileSync('src/game-flow.js','utf8'));
 if(id==='gameMusic')source=source.replace('__MUSIC_ASSETS__',JSON.stringify({menu:fs.readFileSync('assets/music-ai/menu-b-loop.mp3').toString('base64'),game:fs.readFileSync('assets/music-ai/game-a-loop.mp3').toString('base64')}));
 const script='<script id="'+id+'">\n'+source+'\n</script>';
 const re=new RegExp('<script id="'+id+'">[\\s\\S]*?</script>');
 if(re.test(html))html=html.replace(re,()=>script);else html=html.replace('<script id="appScript">',()=>script+'\n<script id="appScript">');
}
// Remove the old four-face atlas entirely, use the new five-face atlas once.
const old='data:image/jpeg;base64,'+fs.readFileSync('assets/companions-v2.jpg').toString('base64');
html=html.replaceAll(old,'');
const portraits=Array.from({length:4},(_,n)=>{const i=n+1;return '.portrait-'+i+'{background-image:url("data:image/webp;base64,'+fs.readFileSync('assets/partner-face-'+i+'-v10.webp').toString('base64')+'")}';}).join('\n');
const rewards='data:image/webp;base64,'+fs.readFileSync('assets/rewards-v16.webp').toString('base64');
const css='<style id="integrationStyle">'+fs.readFileSync('src/integration.css','utf8')+'\n.portrait-art{background-size:cover!important;background-position:50% 18%!important}.partner-card>.portrait-art{aspect-ratio:1;height:auto!important}.portrait-4{background-position:50% 12%!important}'+portraits+'.reward-art{background-image:url("'+rewards+'")}\n</style>';
html=html.replace(/<style id="integrationStyle">[\s\S]*?<\/style>/,'');html=html.replace('</head>',()=>css+'\n</head>');
html=html.replace(/<style id="mobileFlowStyle">[\s\S]*?<\/style>/,'');html=html.replace('</head>',()=>'<style id="mobileFlowStyle">'+fs.readFileSync('src/game-flow.css','utf8')+'</style>\n</head>');
const artFiles={
 'prologue-atlas':'prologue-comic-v29.webp',
 'currency-coin':'currency-coin-v26.webp',
 'currency-diamond':'currency-diamond-b-v26.webp',
 'room-base':'room-base-v25.webp',
 'room-soft':'room-soft-v25.webp',
 'economy-props':'economy-props-v15.webp',
 'moon-master':'moon-master-v16.webp',
 ...Object.fromEntries(['lobby','room','cloud','forest','sea'].map(name=>['world-'+name,'world-'+name+(name==='lobby'?'-v16.webp':'-v11.webp')])),
 'collection-extras':'world-extras-v11.webp',
 ...Object.fromEntries([1,2,3,4].map(i=>['partner-'+i,'partner-scene-'+i+'-v10.webp'])),
 ...Object.fromEntries([0,1,2,3].map(i=>['nav-'+i,'nav-'+i+'-v10.webp']))
};
const artVars=':root{'+Object.entries(artFiles).map(([key,file])=>'--'+key+':url("data:image/webp;base64,'+fs.readFileSync('assets/'+file).toString('base64')+'");').join('')+'}';
const faceCss=':root{--scene-lobby:var(--world-lobby)}.portrait-art{background-position:center!important}';
html=html.replace(/<style id="approvedArtStyle">[\s\S]*?<\/style>/,'');
html=html.replace('</head>',()=>'<style id="approvedArtStyle">'+artVars+faceCss+fs.readFileSync('src/art-flow.css','utf8')+'\n'+fs.readFileSync('src/world-flow.css','utf8')+'\n'+fs.readFileSync('src/economy-flow.css','utf8')+'\n'+fs.readFileSync('src/economy-art.css','utf8')+'\n'+fs.readFileSync('src/moon-identity.css','utf8')+'\n'+fs.readFileSync('src/mobile-fit.css','utf8')+'\n'+fs.readFileSync('src/lobby-layout.css','utf8')+fs.readFileSync('src/topbar.css','utf8')+fs.readFileSync('src/header-restored.css','utf8')+fs.readFileSync('src/moonlight-ribbon.css','utf8')+fs.readFileSync('src/single-row-header.css','utf8')+fs.readFileSync('src/dialog-close.css','utf8')+fs.readFileSync('src/room-growth.css','utf8')+'\n'+fs.readFileSync('src/room-life.css','utf8')+'\n'+fs.readFileSync('src/journey-postcards.css','utf8')+fs.readFileSync('src/currency-v26.css','utf8')+'\n'+fs.readFileSync('src/first-light.css','utf8')+'\n'+fs.readFileSync('src/first-chapter.css','utf8')+'\n'+fs.readFileSync('src/prologue.css','utf8')+'\n'+fs.readFileSync('src/release-ops.css','utf8')+'\n'+fs.readFileSync('src/ad-economy.css','utf8')+'\n'+fs.readFileSync('src/weekly-challenge.css','utf8')+'</style>\n</head>');
fs.writeFileSync('index.html',html);
