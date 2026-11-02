const fs=require('fs'),crypto=require('crypto');
const dir='opendesign-projects/dedce0c7-5f8a-4ac4-9500-e61d54eb7dd2';
const target=dir+'/design.html',before=fs.readFileSync(target),expected='65ebfc4ac985ac7d715b73bfb23d01cbcf404e326b0164eb3a400f3faf125807';
const html=fs.readFileSync('mobile-play.html');
if(crypto.createHash('sha256').update(before).digest('hex')!==expected&&!before.equals(html))throw Error('Draft changed since context; read context before replacing');
if(!fs.existsSync(dir+'/design.before-elements.html'))fs.writeFileSync(dir+'/design.before-elements.html',before);
fs.writeFileSync(target,html);
fs.writeFileSync('star-candy-elements-v4.html',html);
console.log('Mobile artifact and existing draft updated; '+html.length+' bytes.');
