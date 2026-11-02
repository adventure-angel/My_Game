// Local water surfaces only: directions follow the illustrated channels.
function startWorldWater(ch){
 cancelAnimationFrame(waterFrame);waterFrame=0;
 const canvas=$('worldWater');if(!canvas||route!=='map'||document.hidden||!data.motion||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 let last=0;
 const falls=ch===0?[
  {x:.895,y:.455,w:.022,h:.025},{x:.912,y:.494,w:.057,h:.033},
  {x:.833,y:.568,w:.071,h:.092},{x:.439,y:.727,w:.063,h:.077}
 ]:ch===1?[
  {x:.377,y:.315,w:.023,h:.034},{x:.325,y:.354,w:.035,h:.034},
  {x:.567,y:.531,w:.036,h:.045},{x:.245,y:.697,w:.080,h:.040},
  {x:.252,y:.824,w:.065,h:.041},{x:.431,y:.828,w:.038,h:.040}
 ]:[];
 const streams=ch===0?[[[.92,.53],[.89,.55],[.83,.56]],[[.39,.711],[.42,.721],[.44,.725]]]:ch===1?[[[.27,.738],[.35,.762],[.48,.784]],[[.4,.889],[.56,.91],[.75,.94]]]:[[[.49,.71],[.60,.72],[.54,.77]],[[.36,.80],[.45,.81],[.57,.82]],[[.5,.88],[.64,.90],[.69,.94]],[[.36,.47],[.41,.49],[.43,.51]]];
 function paint(now){
  if(!canvas.isConnected||route!=='map'||document.hidden||!data.motion)return;
  waterFrame=requestAnimationFrame(paint);if(now-last<32)return;last=now;
  const rect=canvas.getBoundingClientRect(),scale=Math.min(1.5,window.devicePixelRatio||1),cw=Math.round(rect.width*scale),cht=Math.round(rect.height*scale);
  if(cw<1||cht<1)return;if(canvas.width!==cw||canvas.height!==cht){canvas.width=cw;canvas.height=cht;}
  const w=canvas.width,h=canvas.height,t=now/1000;ctx.clearRect(0,0,w,h);
  for(const f of falls){
   const x=f.x*w,y=f.y*h,fw=f.w*w,fh=f.h*h;
   ctx.save();ctx.beginPath();ctx.moveTo(x-fw*.5,y);ctx.lineTo(x+fw*.45,y);ctx.lineTo(x+fw*.60,y+fh);ctx.lineTo(x-fw*.60,y+fh);ctx.closePath();ctx.clip();
   const glow=ctx.createLinearGradient(0,y,0,y+fh);glow.addColorStop(0,'#b3edff05');glow.addColorStop(.2,'#74cfff77');glow.addColorStop(.8,'#d5faff55');glow.addColorStop(1,'#ecffff00');ctx.fillStyle=glow;ctx.fillRect(x-fw,y,fw*2,fh);
   for(let n=0;n<14;n++){const phase=(t*(.75+n%3*.12)+n*.187)%1,px=x+(n/13-.5)*fw*.86,py=y+phase*fh;ctx.strokeStyle=n%3===0?'#fffaf0ed':'#c8f3ffb0';ctx.lineWidth=Math.max(.6,fw*.032);ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px+Math.sin(t*2+n)*fw*.035,py+fh*.08,px+fw*.025,py+fh*.18);ctx.stroke();}
   ctx.restore();
   for(let n=0;n<5;n++){const p=(t*.5+n*.2)%1;ctx.strokeStyle='rgba(222,250,255,'+((1-p)*.55)+')';ctx.lineWidth=Math.max(.7,w*.002);ctx.beginPath();ctx.ellipse(x,y+fh+2,fw*(.3+p*.7),Math.max(1,fw*.14*p),0,0,Math.PI*2);ctx.stroke();}
   for(let n=0;n<7;n++){const p=(t*.9+n*.17)%1;ctx.fillStyle='rgba(242,255,255,'+((1-p)*.7)+')';ctx.beginPath();ctx.arc(x+Math.sin(n*4.7)*fw*p,y+fh-Math.sin(p*Math.PI)*fw*.48,Math.max(.5,w*.0015),0,7);ctx.fill();}
  }
  for(const points of streams){
   ctx.save();ctx.lineCap='round';ctx.strokeStyle='#b8efff88';ctx.lineWidth=Math.max(1,w*.003);ctx.setLineDash([w*.008,w*.025]);ctx.lineDashOffset=-t*w*.045;
   for(let n=0;n<3;n++){ctx.beginPath();ctx.moveTo(points[0][0]*w,points[0][1]*h+n*2);ctx.quadraticCurveTo(points[1][0]*w,points[1][1]*h+n*2,points[2][0]*w,points[2][1]*h+n*2);ctx.stroke();}ctx.restore();
  }
  if(ch===1){for(let n=0;n<12;n++){const x=(.12+((n*37)%76)/100)*w,y=(.37+((n*19)%43)/100)*h+Math.sin(t*.7+n)*4;ctx.fillStyle='rgba(255,236,139,'+(.15+.35*(Math.sin(t*1.4+n)+1)/2)+')';ctx.beginPath();ctx.arc(x,y,Math.max(.7,w*.002),0,7);ctx.fill();}}
 }
 waterFrame=requestAnimationFrame(paint);
}
