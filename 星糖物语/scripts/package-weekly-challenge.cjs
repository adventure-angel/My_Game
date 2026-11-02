// Reuse the source-first, fingerprinted v39 packaging pipeline for the new release.
const fs=require('fs'),path=require('path'),vm=require('vm');
const source=fs.readFileSync(path.join(__dirname,'package-free-play-72.cjs'),'utf8')
 .replaceAll('v39-free-play-72','v42-weekly-challenge')
 .replaceAll('h5-free-play-72-v39','h5-weekly-challenge-v42')
 .replaceAll('v39','v42');
vm.runInNewContext(source,{require,__dirname,console,Buffer,process},{filename:'package-weekly-challenge-generated.cjs'});
