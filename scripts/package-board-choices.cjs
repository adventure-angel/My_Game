// Reuse the source-first, fingerprinted v39 packaging pipeline for the new release.
const fs=require('fs'),path=require('path'),vm=require('vm');
const source=fs.readFileSync(path.join(__dirname,'package-free-play-72.cjs'),'utf8')
 .replaceAll('v39-free-play-72','v40-board-choices')
 .replaceAll('h5-free-play-72-v39','h5-board-choices-v40')
 .replaceAll('v39','v40');
vm.runInNewContext(source,{require,__dirname,console,Buffer,process},{filename:'package-board-choices-generated.cjs'});
