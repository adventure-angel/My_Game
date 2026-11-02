// Independent v32 candidate based on the exact uploaded v31, retaining save keys.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
process.chdir(path.resolve(__dirname,'..'));
const source='release/h5-cloud-v31/game/index.html',out='release/h5-boot-v32',game=out+'/game';
let html=fs.readFileSync(source,'utf8');
fs.mkdirSync(game+'/assets',{recursive:true});
function replace(old,value){if(!html.includes(old))throw Error('Missing anchor: '+old.slice(0,80));html=html.replace(old,()=>value);}
const uiStart=html.indexOf('// Inserted into the existing application closure for the platform candidate only.');
const uiEnd=html.indexOf('function showSaveCenter(){',uiStart);
if(uiStart<0||uiEnd<0)throw Error('Cloud UI boundary missing');
html=html.slice(0,uiStart)+fs.readFileSync('src/taptap-cloud-ui.js','utf8')+'\n'+html.slice(uiEnd);
html=html.replace(/<title>[^<]*<\/title>/,'<title>星糖物语 · v32 启动诊断版</title>').replaceAll('v31-cloud','v32-boot');
replace("const raw=StarCandySave.load();","window.StarCandyBoot.stage('读取本机进度');\n const raw=StarCandySave.load();");
replace('extraUI();',"window.StarCandyBoot.stage('准备游戏界面');\nextraUI();");
replace("routingReady=true;","window.StarCandyBoot.finish();\nroutingReady=true;");
const assets=new Map();
html=html.replace(/data:(image\/(?:jpeg|webp|png));base64,([A-Za-z0-9+/=]+)/g,(_,mime,b64)=>{
 const bytes=Buffer.from(b64,'base64'),hash=crypto.createHash('sha256').update(bytes).digest('hex');
 const file='assets/'+hash+'.'+({'image/jpeg':'jpg','image/webp':'webp','image/png':'png'}[mime]);
 if(!assets.has(file)){fs.writeFileSync(game+'/'+file,bytes);assets.set(file,{file,bytes:bytes.length,sha256:hash});}
 return file;
});
let styleCount=0;html=html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g,(_,attrs,css)=>{
 const file='style-'+(++styleCount)+'.css';fs.writeFileSync(game+'/'+file,css);return '<link rel="stylesheet" href="'+file+'">';
});
let scriptCount=0;html=html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g,(_,attrs,js)=>{
 const file='runtime-'+(++scriptCount)+'.js';new vm.Script(js,{filename:file});
 const stage="window.StarCandyBoot.stage('载入程序 "+scriptCount+"/10');\n";
 fs.writeFileSync(game+'/'+file,stage+js);return '<script'+attrs+' defer src="'+file+'"></script>';
});
const css='#bootGuard{position:fixed!important;inset:0!important;z-index:2147483647!important;display:flex;align-items:center;justify-content:center;padding:24px;background:#20162e;color:#ffedc4;font:16px/1.7 system-ui;text-align:center}#bootGuard[hidden]{display:none!important}#bootGuard h1{font-size:30px;letter-spacing:4px}#bootGuard pre{white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.7 system-ui;color:#ded1ed}#bootRetry{min-height:44px;padding:8px 24px;border:1px solid #ead096;border-radius:24px;background:#f4dfa6;color:#392542}';
const guard='<style>'+css+'</style><section id="bootGuard" role="status"><div><h1>星糖物语</h1><p id="bootStatus">正在打开小屋…</p><pre id="bootDetail">v32 · 启动诊断版</pre><button id="bootRetry" hidden>重新打开</button></div></section><script id="bootGuardScript">'+fs.readFileSync('src/boot-guard.js','utf8')+'</script>';
replace('<body>','<body>\n'+guard);
fs.writeFileSync(game+'/index.html',html);
const manifest={build:'v32-boot',source,sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),entryBytes:Buffer.byteLength(html),scripts:scriptCount,styles:styleCount,assets:[...assets.values()],notes:['Same save keys and gameplay as uploaded v31','Assets extracted byte-for-byte; no artwork re-encoding','Early visible boot status, errors, timeout and reload; no save reset','Cloud list status/date UI correction'],phoneValidated:false};
fs.writeFileSync(out+'/manifest.json',JSON.stringify(manifest,null,2));
console.log(JSON.stringify({entryBytes:manifest.entryBytes,scripts:scriptCount,styles:styleCount,assets:assets.size}));
