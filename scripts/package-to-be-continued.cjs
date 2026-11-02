// Reuse the source-first, fingerprinted v39 packaging pipeline for the new release.
const fs=require('fs'),path=require('path'),vm=require('vm');
const source=fs.readFileSync(path.join(__dirname,'package-free-play-72.cjs'),'utf8')
 .replaceAll('v39-free-play-72','v41-to-be-continued')
 .replaceAll('h5-free-play-72-v39','h5-to-be-continued-v41')
 .replaceAll('v39','v41');
vm.runInNewContext(source,{require,__dirname,console,Buffer,process},{filename:'package-to-be-continued-generated.cjs'});
