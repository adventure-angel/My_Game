const fs=require('fs');
let app=fs.readFileSync('src/appScript.js','utf8');
app=app.replace("edition.textContent='v9 · 星愿旅途'","edition.textContent='v10 · 星光小屋'");
fs.writeFileSync('src/appScript.js',app);
let art=fs.readFileSync('src/art-flow.js','utf8');
art=art.replace('</header><div class="art-chapter-tag">','</header><button class="art-preferences" data-action="preferences" aria-label="音乐与设置">⚙</button><div class="art-chapter-tag">');
fs.writeFileSync('src/art-flow.js',art);
fs.mkdirSync('archives/pre-v10',{recursive:true});
for(const f of ['index.html','mobile-play.html','star-candy-play.html']){
 const target='archives/pre-v10/'+f;
 if(fs.existsSync(f)&&!fs.existsSync(target))fs.copyFileSync(f,target);
}
