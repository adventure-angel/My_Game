// Native H5 rewarded video. show() resolution is NOT a completion receipt.
const StarCandyAds=(()=>{
 let active=null;
 const error=(message,code)=>Object.assign(new Error(message),{code});
 function availability(){
  const c=StarCandyRelease.rewardedAdSupply;
  if(!c?.adUnitId||!StarCandyRelease.ads||!c.enabled)return '视频补给尚未开通，普通游玩照常进行';
  if(typeof globalThis.tap?.createRewardedVideoAd!=='function')return '请从 TapTap 客户端打开游戏使用视频补给';
  return '';
 }
 function message(e){return ({1001:'广告配置有误，请稍后再试',1002:'广告位尚不可用，请稍后再试',1004:'暂时没有可播放的视频，请稍后再来',1005:'广告位仍在审核，请稍后再来',1006:'广告位未通过审核',1007:'广告服务暂不可用',1008:'广告位尚未开启'})[Number(e?.errCode)]||'视频未能播放，请检查网络后重试';}
 function watch(onStage=()=>{}){
  const unavailable=availability();if(unavailable)return Promise.reject(error(unavailable,'unavailable'));
  if(active)return Promise.reject(error('已有视频正在处理','busy'));
  return new Promise((resolve,reject)=>{
   let ad=null,settled=false,timer=null,requested=false;
   const finish=(err,result)=>{
    if(settled)return;settled=true;clearTimeout(timer);active=null;
    try{ad?.offClose?.(onClose);}catch(_){}
    try{ad?.offError?.(onError);}catch(_){}
    try{ad?.destroy?.();}catch(_){}
    err?reject(err):resolve(result);
   };
   const arm=ms=>{clearTimeout(timer);timer=setTimeout(()=>finish(error('等待视频超时，没有扣除领取次数；请稍后重试','timeout')),ms);};
   const onClose=res=>finish(null,{completed:requested&&res?.isEnded===true});
   const onError=e=>finish(error(message(e),'platform'));
   active={cancel:()=>finish(error('已取消本次视频，没有发放奖励','cancelled'))};
   try{
    ad=globalThis.tap.createRewardedVideoAd({adUnitId:StarCandyRelease.rewardedAdSupply.adUnitId});
    if(!ad||['onClose','onError','load','show'].some(k=>typeof ad[k]!=='function'))throw error('当前客户端不支持完整广告接口，请更新 TapTap 后重试','environment');
    ad.onClose(onClose);ad.onError(onError);arm(25000);onStage('loading');
    Promise.resolve(ad.load()).then(()=>{
     if(settled)return;requested=true;arm(300000);onStage('playing');return ad.show();
    }).catch(e=>{if(!settled)finish(error(message(e),'platform'));});
   }catch(e){finish(error(e.code?e.message:message(e),e.code||'platform'));}
  });
 }
 return {availability,watch,cancel:()=>active?.cancel(),busy:()=>!!active};
})();
