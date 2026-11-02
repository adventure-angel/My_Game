// Build the v47 H5 candidate from current source. Upload is a separate step.
const fs=require('fs'),path=require('path'),vm=require('vm');
const releaseRoot=path.resolve(__dirname,'..','release');
const output=path.resolve(releaseRoot,'h5-mirror-ads-v47');
if(!output.startsWith(releaseRoot+path.sep))throw Error('Invalid output directory');
fs.rmSync(output,{recursive:true,force:true});
const source=fs.readFileSync(path.join(__dirname,'package-room-lighting.cjs'),'utf8')
 .replaceAll('v44-room-lighting','v47-mirror-ads')
 .replaceAll('h5-room-lighting-v44','h5-mirror-ads-v47')
 .replaceAll('v44','v47');
vm.runInNewContext(source,{require,__dirname,console,Buffer,process},{filename:'package-mirror-ads-generated.cjs'});
