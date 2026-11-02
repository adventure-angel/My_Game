// Separate v38 artifacts; keep all previously uploaded package folders intact.
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'config/release.json'),'utf8'));
if(config.build!=='v38-room-life')throw Error('Expected v38-room-life release configuration');
if(config.ads&&(!config.rewardedAdSupply?.enabled||!config.rewardedAdSupply?.adUnitId))throw Error('Enabled ads require a real adUnitId');
let source=fs.readFileSync(path.join(__dirname,'package-ad-economy.cjs'),'utf8');
source=source.replaceAll('h5-ad-economy-v33','h5-room-life-v38')
 .replaceAll('star-candy-v33-ad-economy','star-candy-v38-room-life')
 .replaceAll('v33-ad-economy','v38-room-life')
 .replaceAll('v33','v38').replaceAll('心愿补给','小屋日常');
vm.runInNewContext(source,{require,__dirname,console,Buffer,process},{filename:'package-room-life-generated.cjs'});
