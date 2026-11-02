// Read-only visual comparison using the current game and isolated demo saves.
const fs=require('fs'),path=require('path'),vm=require('vm'),http=require('http');
const root=path.resolve('release/h5-support-v36/game');
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 const target=file===root?path.join(root,'index.html'):file;
 fs.readFile(target,(err,body)=>{if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'html':'text/html; charset=utf-8','js':'application/javascript; charset=utf-8','css':'text/css; charset=utf-8','png':'image/png','webp':'image/webp','jpg':'image/jpeg'})[path.extname(target).slice(1)]||'application/octet-stream');res.end(body);});
});
server.listen(4391,'127.0.0.1',async()=>{
 let source=fs.readFileSync(path.join(__dirname,'capture-store-materials.cjs'),'utf8');
 source=source.replaceAll('release/taptap-materials-v30','release/store-assets-audit-v36/current')
  .replaceAll('release/h5-playtest-v30/index.html','release/h5-support-v36/game/index.html')
  .replaceAll('127.0.0.1:4329','127.0.0.1:4391').replaceAll('v30','v36');
 source=source.replace("run().catch(e=>{console.error(e);process.exit(1)});",'run().then(()=>server.close()).catch(e=>{console.error(e);server.close();process.exitCode=1;});');
 vm.runInNewContext(source,{require,console,process,server},{filename:'capture-store-audit-generated.cjs'});
});
