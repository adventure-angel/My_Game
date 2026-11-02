const fs=require('fs'),vm=require('vm'),path=require('path');
let source=fs.readFileSync(path.join(__dirname,'package-ad-no-wait.cjs'),'utf8');
source=source.replaceAll('h5-ad-no-wait-v35','h5-prologue-fit-v37').replaceAll('star-candy-v35-ad-no-wait','star-candy-v37-prologue-fit').replaceAll('v35-ad-no-wait','v37-prologue-fit').replaceAll("'v35'","'v37'");
vm.runInNewContext(source,{require,__dirname,console,Buffer,process},{filename:'package-prologue-fit-generated.cjs'});
