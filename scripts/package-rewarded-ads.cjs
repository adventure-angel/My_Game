// Reuse the proven split-asset builder without altering frozen v33 artifacts.
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
let source=fs.readFileSync(path.join(__dirname,'package-ad-economy.cjs'),'utf8');
source=source.replaceAll('h5-ad-economy-v33','h5-rewarded-ads-v34')
 .replaceAll('star-candy-v33-ad-economy','star-candy-v34-rewarded-ads')
 .replaceAll('v33-ad-economy','v34-rewarded-ads')
 .replaceAll('v33','v34').replaceAll('心愿补给','视频补给');
const config=JSON.parse(fs.readFileSync(path.join(root,'config/release.json'),'utf8'));
if(config.ads&&(!config.rewardedAdSupply?.enabled||!config.rewardedAdSupply?.adUnitId))throw Error('Enabled ads require a real adUnitId and supply.enabled');
vm.runInNewContext(source,{require,__dirname,console,Buffer,process},{filename:'package-rewarded-ads-generated.cjs'});
