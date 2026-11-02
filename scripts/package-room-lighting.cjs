// Local filming candidate. Does not upload or replace the v42 distribution.
const fs=require('fs'),path=require('path'),vm=require('vm');
const source=fs.readFileSync(path.join(__dirname,'package-free-play-72.cjs'),'utf8')
 .replaceAll('v39-free-play-72','v44-room-lighting')
 .replaceAll('h5-free-play-72-v39','h5-room-lighting-v44')
 .replaceAll('v39','v44');
vm.runInNewContext(source,{require,__dirname,console,Buffer,process},{filename:'package-trailer-prep-generated.cjs'});
