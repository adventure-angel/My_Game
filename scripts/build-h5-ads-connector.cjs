'use strict';
// Reproducible local adaptation, not an upstream release. Keep original intact.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const dir=path.resolve(__dirname,'../taptap-h5-ads-connector/node/upstream/dist');
const original=fs.readFileSync(path.join(dir,'server.js'),'utf8');
if(crypto.createHash('sha256').update(original).digest('hex')!=='c5cbe9e358efa13963c567aeea6c67d41a0612f25e3f9469f16cae524165e942')throw Error('Unexpected upstream bundle; re-audit before adapting');
const marker='xOe().catch(t=>';
if(original.split(marker).length!==2)throw Error('Upstream start marker changed');
const extension=`
// CINDY LOCAL ADAPTATION: expose a read-only response, no cache fabrication.
// H5 package orientation is verified separately through the official package API.
// Keep upstream authentication, signing, endpoint and status values unchanged.
NY.tools.push({
 definition:{name:'get_h5_ad_spaces',description:'Read the current Star Candy app ad configuration directly from the official GET /ad/v1/config. Returns server status and the original orientation-typed ad spaces. No app writes or ad cache updates. Verify the target H5 package orientation through package-management list-h5-packages before choosing a space.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
 requiresAuth:true,
 handler:async function(args,context){
   if(Object.keys(args).length)throw new Error('This read-only tool takes no parameters');
   const app=context.resolveApp();
   if(app.developerId!==504573||app.appId!==1011919)throw new Error('Select Star Candy 504573/1011919 first');
   const result=await $Y(context,{developerId:app.developerId,appId:app.appId});
   return JSON.stringify({source:'TapTap GET /ad/v1/config',adapter:'cindy-h5-package-direction',queried_at:new Date().toISOString(),developer_id:app.developerId,app_id:app.appId,status:result.status,ad_spaces:Array.isArray(result.ad_spaces)?result.ad_spaces.map(s=>({id:s.id,type:s.type})):[],type_mapping:{1:'landscape',2:'portrait'},note:'Read-only server response. Select using the actual H5 package orientation, not missing legacy level metadata. Runtime playback is not yet verified.'});
 }
});
`;
fs.writeFileSync(path.join(dir,'server-cindy-compat.js'),original.replace(marker,extension+'\n'+marker));
console.log('Built read-only H5 ad configuration adapter; original preserved');
