// Layer the platform adapter onto the exact v30 package used for store recording.
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const root=path.resolve(__dirname,'..');process.chdir(root);
const source='release/h5-playtest-v30/index.html';let html=fs.readFileSync(source,'utf8');
const replace=(old,value)=>{if(!html.includes(old))throw Error('Missing injection anchor: '+old.slice(0,80));html=html.replace(old,()=>value);};
replace('<script id="appScript">','<script id="tapCloudAdapter">\n'+fs.readFileSync('src/taptap-cloud.js','utf8')+'\n</script>\n<script id="appScript">');
replace('function showSaveCenter(){',fs.readFileSync('src/taptap-cloud-ui.js','utf8')+'\nfunction showSaveCenter(){');
replace('<div class="release-settings">','<div class="release-settings"><button class="secondary" data-action="tapCloudCenter">TapTap 云备份 <small>手动备份与恢复 · 联调版</small></button>');
replace('function handleReleaseAction(b){','function handleReleaseAction(b){\n if(handleTapCloudAction(b))return true;');
replace("case 'releasePrivacy':showReleasePrivacy();return true;","case 'releasePrivacy':showTapCloudPrivacy();return true;");
html=html.replaceAll('正式账号与云同步尚未开放。','云备份请从设置中的 TapTap 云备份进入。').replaceAll('隐私与试玩说明 · v30','隐私与联调说明 · v31');
html=html.replace(/<title>[^<]*<\/title>/,'<title>星糖物语 · v31 云备份联调</title>');
const config={...JSON.parse(fs.readFileSync('config/release.json','utf8')),build:'v31-cloud',channel:'taptap-h5-cloud-integration',cloudSave:false,cloudSaveIntegration:{implemented:true,mode:'manual-append-only',platformValidated:false}};
html=html.replace(/<script id="releaseConfig">[\s\S]*?<\/script>/,()=>'<script id="releaseConfig">const StarCandyRelease=Object.freeze('+JSON.stringify(config)+');</script>');
let count=0;for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:'cloud-candidate-'+(++count)});
const dest='release/h5-cloud-v31/game';fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(dest+'/index.html',html);fs.writeFileSync('star-candy-v31-cloud.html',html);
fs.writeFileSync('release/h5-cloud-v31/manifest.json',JSON.stringify({build:'v31-cloud',source,sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),sha256:crypto.createHash('sha256').update(html).digest('hex'),scripts:count,config},null,2));
console.log('Created v31 cloud integration candidate; syntax compiled, no runtime/platform validation claimed. '+Buffer.byteLength(html)+' bytes.');
