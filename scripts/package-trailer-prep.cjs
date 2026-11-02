// Local filming candidate. Does not upload or replace the v42 distribution.
const fs=require('fs'),path=require('path'),vm=require('vm');
const source=fs.readFileSync(path.join(__dirname,'package-free-play-72.cjs'),'utf8')
 .replaceAll('v39-free-play-72','v43-trailer-prep')
 .replaceAll('h5-free-play-72-v39','h5-trailer-prep-v43')
 .replaceAll('v39','v43');
vm.runInNewContext(source,{require,__dirname,console,Buffer,process},{filename:'package-trailer-prep-generated.cjs'});
