// Local repair build; does not upload or replace the TapTap distribution.
const fs=require('fs'),path=require('path'),vm=require('vm');
const releaseRoot=path.resolve(__dirname,'..','release');
const output=path.resolve(releaseRoot,'h5-gameplay-polish-v46');
if(!output.startsWith(releaseRoot+path.sep))throw Error('Invalid output directory');
fs.rmSync(output,{recursive:true,force:true});
const source=fs.readFileSync(path.join(__dirname,'package-room-lighting.cjs'),'utf8')
 .replaceAll('v44-room-lighting','v46-gameplay-polish')
 .replaceAll('h5-room-lighting-v44','h5-gameplay-polish-v46')
 .replaceAll('v44','v46');
vm.runInNewContext(source,{require,__dirname,console,Buffer,process},{filename:'package-gameplay-polish-generated.cjs'});
