const fs=require('fs');
const p='src/release-ops.js';let s=fs.readFileSync(p,'utf8');
const old='遇到问题时，把报告和截图发回提供试玩链接的会话，并说明最后做了哪一步。正式客服入口尚未启用。';
if(!s.includes(old))throw Error('Missing feedback copy');
s=s.replace(old,'客服邮箱：1416303829@qq.com。遇到问题时，可将报告和截图发至客服邮箱，并说明最后做了哪一步。');
fs.writeFileSync(p,s);
const q='src/taptap-cloud-ui.js';s=fs.readFileSync(q,'utf8');
s=s.replace('星糖物语 v34 · 免费游玩与自愿广告补给','星糖物语 · 免费游玩与自愿广告补给')
 .replace('正式发布前需补齐运营主体、客服及正式隐私政策。','客服邮箱：1416303829@qq.com。正式发布前仍需补齐运营主体及正式隐私政策。');fs.writeFileSync(q,s);
const record='docs/release/submission-record.json';const data=JSON.parse(fs.readFileSync(record,'utf8'));data.support.publicContact='1416303829@qq.com';fs.writeFileSync(record,JSON.stringify(data,null,2)+'\n');
