// Preserve the previously uploaded packages; produce a separate v35 build.
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
let source=fs.readFileSync(path.join(__dirname,'package-ad-economy.cjs'),'utf8');
source=source.replaceAll('h5-ad-economy-v33','h5-ad-no-wait-v35')
 .replaceAll('star-candy-v33-ad-economy','star-candy-v35-ad-no-wait')
 .replaceAll('v33-ad-economy','v35-ad-no-wait')
 .replaceAll('v33','v35').replaceAll('心愿补给','视频补给');
const config=JSON.parse(fs.readFileSync(path.join(root,'config/release.json'),'utf8'));
if(config.ads&&(!config.rewardedAdSupply?.enabled||!config.rewardedAdSupply?.adUnitId))throw Error('Enabled ads require a real adUnitId');
vm.runInNewContext(source,{require,__dirname,console,Buffer,process},{filename:'package-ad-no-wait-generated.cjs'});
