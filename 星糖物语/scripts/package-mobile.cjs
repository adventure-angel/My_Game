const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
// Preserve the full-resolution cover for high-density phone displays.
for (const name of ['worlds-v2']) {
  const original = 'data:image/jpeg;base64,' + fs.readFileSync('assets/' + name + '.jpg').toString('base64');
  const mobile = 'data:image/jpeg;base64,' + fs.readFileSync('assets/' + name + '-mobile.jpg').toString('base64');
  if (!html.includes(original)) throw new Error('Missing artwork: ' + name);
  html = html.replaceAll(original, mobile);
}
html = html.replace(/<title>[^<]*<\/title>/, '<title>星糖物语 · v30 封闭试玩</title>');
// Includes both approved offline music tracks in addition to the artwork.
if (Buffer.byteLength(html) > 13*1048576) throw new Error('Mobile preview exceeds 13 MiB');
fs.writeFileSync('mobile-play.html', html);
console.log('Mobile preview: ' + Buffer.byteLength(html) + ' bytes');
