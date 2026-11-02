// A single entry point rebuilds the game before packaging; no stale mobile intermediate.
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..');process.chdir(root);
const config=JSON.parse(fs.readFileSync('config/release.json','utf8'));
if(config.build!=='v39-free-play-72'||config.totalLevels!==72||config.stamina.enabled!==false)throw Error('Expected v39 free-play 72-level configuration');
for(const script of ['build-game.cjs','package-mobile.cjs'])execFileSync(process.execPath,[path.join(__dirname,script)],{cwd:root,stdio:'inherit'});
let source=fs.readFileSync(path.join(__dirname,'package-ad-economy.cjs'),'utf8')
 .replaceAll('h5-ad-economy-v33','h5-free-play-72-v39').replaceAll('star-candy-v33-ad-economy','star-candy-v39-free-play-72')
 .replaceAll('v33-ad-economy','v39-free-play-72').replaceAll('v33','v39').replaceAll('心愿补给','72关 · 自由闯关');
vm.runInNewContext(source,{require,__dirname,console,Buffer,process},{filename:'package-free-play-72-generated.cjs'});
const folder='release/h5-free-play-72-v39',game=folder+'/game';let entry=fs.readFileSync(game+'/index.html','utf8');
const contentFiles=[];
// Native clients may keep scripts with the same URL. Content hashes give every changed resource its own URL.
for(const name of fs.readdirSync(game).filter(n=>/^(runtime-\d+\.js|style-\d+\.css)$/.test(n))){
 const bytes=fs.readFileSync(game+'/'+name),hash=crypto.createHash('sha256').update(bytes).digest('hex');
 const next=name.replace(/\.(js|css)$/,'.'+hash.slice(0,12)+'.$1');
 fs.renameSync(game+'/'+name,game+'/'+next);entry=entry.replaceAll('"'+name+'"','"'+next+'"');contentFiles.push({file:next,sha256:hash});
}
fs.writeFileSync(game+'/index.html',entry);
const manifest=JSON.parse(fs.readFileSync(folder+'/manifest.json','utf8'));
manifest.entryBytes=Buffer.byteLength(entry);manifest.sourceSha256=crypto.createHash('sha256').update(fs.readFileSync('mobile-play.html')).digest('hex');manifest.files=contentFiles;
fs.writeFileSync(game+'/version.json',JSON.stringify({build:config.build,totalLevels:72,stamina:false,sourceSha256:manifest.sourceSha256},null,2));
fs.writeFileSync(folder+'/manifest.json',JSON.stringify(manifest,null,2));
console.log('Ready: v39, 72 levels, free play; resource URLs include content hashes.');
