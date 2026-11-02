const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
process.chdir(path.resolve(__dirname,'..'));
const out='release/h5-ad-economy-v33',game=out+'/game';
let html=fs.readFileSync('mobile-play.html','utf8');
fs.mkdirSync(game+'/assets',{recursive:true});
function replace(old,value){if(!html.includes(old))throw Error('Missing anchor: '+old.slice(0,80));html=html.replace(old,()=>value);}
html=html.replace(/<title>[^<]*<\/title>/,'<title>星糖物语 · v33 心愿补给</title>');
replace('const raw=StarCandySave.load();',"window.StarCandyBoot.stage('读取本机进度');\n const raw=StarCandySave.load();");
replace('extraUI();',"window.StarCandyBoot.stage('准备游戏界面');\nextraUI();");
replace('routingReady=true;','window.StarCandyBoot.finish();\nroutingReady=true;');
const css='#bootGuard{position:fixed!important;inset:0!important;z-index:2147483647!important;display:flex;align-items:center;justify-content:center;padding:24px;background:#20162e;color:#ffedc4;font:16px/1.7 system-ui;text-align:center}#bootGuard[hidden]{display:none!important}#bootGuard h1{font-size:30px;letter-spacing:4px}#bootGuard pre{white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.7 system-ui;color:#ded1ed}#bootRetry{min-height:44px;padding:8px 24px;border:1px solid #ead096;border-radius:24px;background:#f4dfa6;color:#392542}';
const guard='<style>'+css+'</style><section id="bootGuard" role="status"><div><h1>星糖物语</h1><p id="bootStatus">正在打开小屋…</p><pre id="bootDetail">v33 · 心愿补给</pre><button id="bootRetry" hidden>重新打开</button></div></section><script id="bootGuardScript">'+fs.readFileSync('src/boot-guard.js','utf8').replaceAll('v32','v33')+'</script>';
// Deliver a self-contained phone preview separately from the TapTap package.
const preview=html.replace('<body>','<body>'+guard);
let compiled=0;for(const m of preview.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:'v33-inline-'+(++compiled)});
fs.writeFileSync('star-candy-v33-ad-economy.html',preview);
const assets=new Map();
html=html.replace(/data:(image\/(?:jpeg|webp|png));base64,([A-Za-z0-9+/=]+)/g,(_,mime,b64)=>{
 const bytes=Buffer.from(b64,'base64'),hash=crypto.createHash('sha256').update(bytes).digest('hex'),file='assets/'+hash+'.'+({'image/jpeg':'jpg','image/webp':'webp','image/png':'png'}[mime]);
 if(!assets.has(file)){fs.writeFileSync(game+'/'+file,bytes);assets.set(file,{file,bytes:bytes.length,sha256:hash});}return file;
});
let styles=0;html=html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g,(_,attrs,css)=>{const file='style-'+(++styles)+'.css';fs.writeFileSync(game+'/'+file,css);return '<link rel="stylesheet" href="'+file+'">';});
const total=[...html.matchAll(/<script\b/g)].length;let scripts=0;
html=html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g,(_,attrs,js)=>{
 const file='runtime-'+(++scripts)+'.js';new vm.Script(js,{filename:file});fs.writeFileSync(game+'/'+file,"window.StarCandyBoot.stage('载入程序 "+scripts+'/'+total+"');\n"+js);return '<script'+attrs+' defer src="'+file+'"></script>';
});
replace('<body>','<body>'+guard);fs.writeFileSync(game+'/index.html',html);
const config=JSON.parse(fs.readFileSync('config/release.json','utf8'));
const manifest={build:'v33-ad-economy',entryBytes:Buffer.byteLength(html),previewBytes:Buffer.byteLength(preview),scripts,styles,assets:[...assets.values()],config,phoneValidated:false,adPlaybackValidated:false};
fs.writeFileSync(out+'/manifest.json',JSON.stringify(manifest,null,2));
console.log(JSON.stringify({entryBytes:manifest.entryBytes,previewBytes:manifest.previewBytes,scripts,styles,assets:assets.size,ads:config.ads,payments:config.payments}));
