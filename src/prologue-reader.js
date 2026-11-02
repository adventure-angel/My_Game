/* Shared by the game and the self-contained comic reading draft. */
class StarCandyPrologue {
 static steps=[
  {title:'有一盏灯，等你回家',speaker:'那封没有署名的信',copy:'「希望有一盏灯，能等我回家。」\n那晚，一封发光的来信回应了这个小小的心愿。你循着星光，来到云端。',alt:'夜色中的窗边，一封新月封蜡的来信发出星光，通向远处的云端。'},
  {title:'原来，是你来了',speaker:'月见',copy:'「我叫月见，替人们守着还没完成的心愿。」\n「你的愿望，让这条星光小路亮了起来。」',alt:'银紫长发、紫瞳的月见站在云端小屋门前，伸手迎接你。'},
  {title:'这里，可以成为我们的家',speaker:'月见',copy:'「欢迎来到星光小屋。以后，旅途里的心愿都能带回这里。」\n「不过，窗边还缺一束暖光。」',alt:'月见示意清冷小屋中的空窗台，白猫蜷在沙发上，夜灯还没有到来。'},
  {title:'先从第一盏灯开始',speaker:'月见',copy:'「把同色星糖连成三颗，就能收集散落的心愿。」\n「完成三次小冒险，带回夜灯。最后那束光，留给你亲手点亮。」',alt:'月见陪着你看向星灯工坊，三颗相连的星糖引出寻找夜灯的约定。'}
 ];
 constructor(host,options={}){
  this.host=host;this.options=options;this.page=0;this.shown=0;this.seen=new Set();this.frame=0;this.disposed=false;this.overview=false;
  this.motion=matchMedia('(prefers-reduced-motion: reduce)');
  this.onClick=e=>this.click(e);this.onVisibility=()=>{this.host.querySelector('.prologue-page')?.classList.toggle('comic-paused',document.hidden);if(document.hidden)cancelAnimationFrame(this.frame);else if(!this.disposed&&!this.overview)this.reveal();};
  this.onMotion=()=>{if(this.motion.matches){this.host.querySelector('.prologue-page')?.classList.add('comic-reduced');this.reveal();}};
  this.onResize=()=>this.fitFrame();
  this.frameObserver=typeof ResizeObserver==='function'?new ResizeObserver(this.onResize):null;
  window.addEventListener('resize',this.onResize);window.visualViewport?.addEventListener('resize',this.onResize);
  host.addEventListener('click',this.onClick);document.addEventListener('visibilitychange',this.onVisibility);this.motion.addEventListener?.('change',this.onMotion);
  this.render();
 }
 reduced(){return this.motion.matches||!!this.options.reduced?.();}
 escape(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 fitFrame(){
  if(this.disposed||this.overview)return;
  const wrap=this.host.querySelector('.comic-image-wrap');if(!wrap)return;
  const side=Math.floor(Math.min(wrap.clientWidth,wrap.clientHeight));
  if(side>0)wrap.style.setProperty('--comic-side',side+'px');
 }
 render(){
  cancelAnimationFrame(this.frame);this.frameObserver?.disconnect();if(this.disposed)return;
  if(this.overview){this.renderOverview();return;}
  const s=StarCandyPrologue.steps[this.page],complete=this.seen.has(this.page)||this.reduced();this.shown=complete?[...s.copy].length:0;if(complete)this.seen.add(this.page);
  this.host.innerHTML='<section class="prologue-page '+(this.reduced()?'comic-reduced':'')+'" aria-label="星愿序章"><header class="comic-header"><div><small>STAR CANDY</small><b>一束光的来信</b></div><button data-comic="overview" aria-label="查看四格漫画总览">四格</button><button data-comic="skip">'+this.escape(this.options.skipLabel||'跳过')+' <span aria-hidden="true">×</span></button></header><div class="comic-reading"><div class="comic-image-wrap"><button class="comic-art comic-art-'+this.page+'" data-comic="reveal" aria-label="'+s.alt+' 点击立即显示全部台词。"><span class="comic-illustration" aria-hidden="true"></span><span class="comic-sheen" aria-hidden="true"></span>'+[0,1,2,3,4].map(n=>'<i class="comic-mote mote-'+n+'" aria-hidden="true"></i>').join('')+'<span class="comic-panel-number" aria-hidden="true">0'+(this.page+1)+'</span></button></div><section class="comic-copy"><div class="comic-copy-heading"><small>'+s.speaker+'</small><h1 tabindex="-1">'+s.title+'</h1></div><p class="comic-dialogue" aria-label="'+this.escape(s.copy)+'"><span aria-hidden="true">'+(complete?this.escape(s.copy):'')+'</span></p></section></div><footer class="comic-footer"><div class="comic-progress" aria-label="四格阅读进度">'+StarCandyPrologue.steps.map((p,i)=>'<button data-comic="page" data-page="'+i+'" aria-label="第 '+(i+1)+' 格：'+p.title+'" '+(i===this.page?'aria-current="step"':'')+'><span>'+String(i+1).padStart(2,'0')+'</span></button>').join('')+'</div><div class="comic-actions"><button class="comic-prev" data-comic="prev" '+(this.page===0?'disabled':'')+' aria-label="上一格">‹</button><button class="comic-next" data-comic="next">'+this.nextLabel()+'</button></div><small class="comic-reading-hint">'+(complete?(this.page===3?'第一份心愿 · 星光夜灯':'按自己的节奏，慢慢看'): '点画面可立即读完台词')+'</small></footer></section>';
  this.fitFrame();this.frameObserver?.observe(this.host.querySelector('.comic-image-wrap'));
  requestAnimationFrame(()=>{if(!this.disposed){this.fitFrame();this.host.querySelector('.comic-copy h1')?.focus({preventScroll:true});}});
  if(!complete&&!document.hidden)this.type();
 }
 nextLabel(){return this.page===3?this.escape(this.options.finishLabel||'和月见一起出发')+' <span aria-hidden="true">✦</span>':'下一格 <span aria-hidden="true">›</span>';}
 type(){
  const chars=[...StarCandyPrologue.steps[this.page].copy],start=performance.now()-this.shown*32;
  const tick=now=>{if(this.disposed||this.overview||document.hidden)return;this.shown=Math.min(chars.length,Math.floor((now-start)/32));const out=this.host.querySelector('.comic-dialogue>span');if(out)out.textContent=chars.slice(0,this.shown).join('');if(this.shown<chars.length)this.frame=requestAnimationFrame(tick);else{this.seen.add(this.page);this.updateHint();}};
  this.frame=requestAnimationFrame(tick);
 }
 updateHint(){const hint=this.host.querySelector('.comic-reading-hint');if(hint)hint.textContent=this.page===3?'第一份心愿 · 星光夜灯':'按自己的节奏，慢慢看';}
 reveal(){
  if(this.disposed||this.overview)return;cancelAnimationFrame(this.frame);this.shown=[...StarCandyPrologue.steps[this.page].copy].length;this.seen.add(this.page);
  const out=this.host.querySelector('.comic-dialogue>span');if(out)out.textContent=StarCandyPrologue.steps[this.page].copy;this.updateHint();
 }
 setPage(i){if(!Number.isInteger(i)||i<0||i>=4)return;this.page=i;this.overview=false;this.render();}
 click(e){
  const button=e.target.closest('[data-comic]');if(!button||!this.host.contains(button)||this.disposed)return;
  switch(button.dataset.comic){
   case 'skip':this.options.onSkip?.();break;
   case 'overview':this.overview=true;this.render();break;
   case 'read':this.overview=false;this.render();break;
   case 'page':this.setPage(Number(button.dataset.page));break;
   case 'prev':this.setPage(this.page-1);break;
   case 'reveal':this.reveal();break;
   case 'next':if(!this.seen.has(this.page)){this.reveal();return;}if(this.page<3)this.setPage(this.page+1);else this.options.onFinish?.();break;
  }
 }
 renderOverview(){
  this.host.innerHTML='<section class="prologue-page comic-overview"><header class="comic-header"><div><small>STAR CANDY · PROLOGUE</small><b>一束光的来信</b></div><button data-comic="read" aria-label="返回逐格阅读">返回 <span aria-hidden="true">×</span></button></header><div class="comic-grid">'+StarCandyPrologue.steps.map((s,i)=>'<article><button class="comic-art comic-art-'+i+'" data-comic="page" data-page="'+i+'" aria-label="放大阅读第 '+(i+1)+' 格"><span class="comic-illustration" aria-hidden="true"></span><span class="comic-panel-number">0'+(i+1)+'</span></button><div><small>'+s.speaker+'</small><h2>'+s.title+'</h2><p>'+this.escape(s.copy)+'</p></div></article>').join('')+'</div><footer class="comic-overview-footer"><button class="comic-next" data-comic="read">回到第 '+(this.page+1)+' 格 ›</button></footer></section>';
 }
 destroy(){this.disposed=true;cancelAnimationFrame(this.frame);this.frameObserver?.disconnect();window.removeEventListener('resize',this.onResize);window.visualViewport?.removeEventListener('resize',this.onResize);this.host.removeEventListener('click',this.onClick);document.removeEventListener('visibilitychange',this.onVisibility);this.motion.removeEventListener?.('change',this.onMotion);}
}
