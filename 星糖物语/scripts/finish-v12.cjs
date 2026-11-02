const fs=require('fs');
let w=fs.readFileSync('src/world-flow.js','utf8');
let a=w.indexOf(" if(next==='home'){");let b=w.indexOf(" if(next==='records'){",a);
if(a<0||b<0)throw Error('world routing markers missing');
w=w.slice(0,a)+" if(next==='home'){screen.innerHTML=renderEconomyLobby();return true;}\n if(next==='map')return renderStageMap(screen);\n"+w.slice(b);
a=w.indexOf(" if(next==='result'&&lastResult&&state.mode==='story'){");b=w.indexOf('\n return false;',a);
if(a<0||b<0)throw Error('result markers missing');
w=w.slice(0,a)+" if(next==='result'&&lastResult&&state.mode==='story'){screen.innerHTML=renderStageResult();return true;}\n"+w.slice(b);
w=w.replace("if(next!==route){roomDraft=null;stopMusicBox();}","if(next!==route){roomDraft=null;shopBackToPrep=false;stopMusicBox();}");
fs.writeFileSync('src/world-flow.js',w);
let app=fs.readFileSync('src/appScript.js','utf8');
a=app.indexOf(' function premiumDialog(){');b=app.indexOf(' function startTrial(){',a);
app=app.slice(0,a)+' function premiumDialog(){showMirrorOffer();}\n'+app.slice(b);
// The legacy direct-start action must use the same inventory confirmation as other starts.
app=app.replace("case 'start':start(b.dataset.mode,Number(b.dataset.level));break;","case 'start':intro(b.dataset.mode,Number(b.dataset.level));break;");
app=app.replace("if(p===4&&!state.trial&&!data.economy.mirror)","if(!Number.isInteger(p)||p<0||p>=partners.length)return;if(p===4&&!state.trial&&!data.economy.mirror)");
fs.writeFileSync('src/appScript.js',app);
