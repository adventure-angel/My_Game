
class CandyEngine {
  constructor(rng=Math.random){this.n=7;this.rng=rng;this.serial=0;this.cells=[];this.pool=[0,1,2,3,4,5];this.generate();}
  cell(k,s=''){return {id:++this.serial,k,s};}
  swap(a,b){[this.cells[a],this.cells[b]]=[this.cells[b],this.cells[a]];}
  adjacent(a,b){return a>=0&&b>=0&&a<49&&b<49&&Math.abs(Math.floor(a/7)-Math.floor(b/7))+Math.abs(a%7-b%7)===1;}
  runs(){
    const groups=[];
    for(let axis=0;axis<2;axis++)for(let line=0;line<7;line++){
      let seq=[];
      const flush=()=>{if(seq.length>=3)groups.push({ids:[...seq],axis:axis?'col':'row'});};
      for(let p=0;p<=7;p++){
        const i=axis?p*7+line:line*7+p,cell=p<7?this.cells[i]:null;
        if(seq.length&&(!cell||cell.s==='rainbow'||cell.k!==this.cells[seq[0]].k)){flush();seq=[];}
        if(cell&&cell.s!=='rainbow')seq.push(i);
      }
    }
    return groups;
  }
  legalMoves(limit=Infinity){
    const moves=[];
    for(let a=0;a<49;a++)for(const b of [a%7<6?a+1:-1,a<42?a+7:-1]){
      if(b<0)continue;
      const x=this.cells[a],y=this.cells[b];if(!x||!y)continue;
      let yes=x.s==='rainbow'||y.s==='rainbow'||(x.s&&y.s);
      if(!yes&&x.k!==y.k){this.swap(a,b);yes=this.runs().length>0;this.swap(a,b);}
      if(yes){moves.push([a,b]);if(moves.length>=limit)return moves;}
    }return moves;
  }
  move(){return this.legalMoves(1)[0]||null;}
  boardChoices(){
    const moves=this.legalMoves(),regions=new Set();
    // A move belongs to its midpoint region, so one boundary swap cannot count twice.
    for(const [a,b] of moves){const row=(Math.floor(a/7)+Math.floor(b/7))/2,col=(a%7+b%7)/2;regions.add((row>=3.5?2:0)+(col>=3.5?1:0));}
    const target=this.pool.length<=4?6:this.pool.length===5?5:4;
    return {count:moves.length,regions:regions.size,ready:moves.length>=target&&regions.size>=3,rank:Math.min(moves.length,target)*10+regions.size};
  }
  fillRandomBoard(fixed=[]){
    const locked=new Map(fixed);this.cells=Array(49).fill(null);
    const colorAt=i=>this.cells[i]?.k??locked.get(i);
    for(let i=0;i<49;i++){
      const options=(locked.has(i)?[locked.get(i)]:this.pool).filter(k=>{
        if(!this.pool.includes(k))return false;
        // Look ahead to lesson locks as well as already-filled neighbours.
        for(const step of [1,7])for(let offset=-2;offset<=0;offset++){
          const start=i+offset*step,end=start+2*step;
          if(start<0||end>=49||(step===1&&Math.floor(start/7)!==Math.floor(end/7)))continue;
          if([start,start+step,end].every(p=>p===i||colorAt(p)===k))return false;
        }
        return true;
      });
      if(!options.length)return false;
      this.cells[i]=this.cell(options[Math.floor(this.rng()*options.length)]);
    }
    return true;
  }
  generate({fixed=[]}={}){
    let best=null,bestRank=-1;
    for(let attempt=0;attempt<96;attempt++){
      if(!this.fillRandomBoard(fixed))continue;
      const choice=this.boardChoices();
      if(choice.ready)return;
      if(choice.count&&choice.rank>bestRank){best=[...this.cells];bestRank=choice.rank;}
    }
    if(best){this.cells=best;return;}
    // Rare constrained/RNG fallback: plant local exchanges, never a patterned whole board.
    const [a,b]=this.pool,seeds=fixed.length?fixed:[[0,a],[1,a],[2,b],[9,a],[4,a],[5,a],[6,b],[13,a],[35,a],[36,a],[37,b],[44,a],[39,a],[40,a],[41,b],[48,a]];
    for(let attempt=0;attempt<96;attempt++)if(this.fillRandomBoard(seeds)&&this.move())return;
    throw new Error('暂时无法生成可玩的棋盘，请重新进入本关');
  }
  plan(preferred=[]){
    let clusters=[];
    for(const run of this.runs()){
      let cluster={ids:new Set(run.ids),runs:[run]};
      const remaining=[];
      for(const c of clusters){
        if([...c.ids].some(i=>cluster.ids.has(i))){c.ids.forEach(i=>cluster.ids.add(i));cluster.runs.push(...c.runs);}
        else remaining.push(c);
      }
      // A new run can bridge previously separate horizontal runs.
      let merged=true;
      while(merged){merged=false;for(let j=remaining.length-1;j>=0;j--)if([...remaining[j].ids].some(i=>cluster.ids.has(i))){remaining[j].ids.forEach(i=>cluster.ids.add(i));cluster.runs.push(...remaining[j].runs);remaining.splice(j,1);merged=true;}}
      clusters=[...remaining,cluster];
    }
    const clear=new Set(),creates=new Map();
    for(const c of clusters){
      c.ids.forEach(i=>clear.add(i));
      const longest=c.runs.reduce((a,b)=>a.ids.length>=b.ids.length?a:b);
      const s=longest.ids.length>=5?'rainbow':c.runs.some(r=>r.axis!==longest.axis)?'bomb':longest.ids.length===4?longest.axis:'';
      if(s){
        const candidates=[...preferred,...c.ids].filter(i=>c.ids.has(i)&&!this.cells[i].s);
        if(candidates.length){const at=candidates[0];creates.set(at,{k:this.cells[at].k,s});clear.delete(at);}
      }
    }
    const matches=this.runs().sort((a,b)=>Number(b.ids.some(i=>preferred.includes(i)))-Number(a.ids.some(i=>preferred.includes(i)))||this.cells[a.ids[0]].k-this.cells[b.ids[0]].k||a.ids[0]-b.ids[0]);
    return {clear,creates,matches};
  }
  specialSwap(a,b){
    const x=this.cells[a],y=this.cells[b],clear=new Set([a,b]);
    if(x.s!=='rainbow'&&y.s!=='rainbow'&&!(x.s&&y.s))return null;
    if(x.s==='rainbow'||y.s==='rainbow'){
      const other=x.s==='rainbow'?y:x;
      this.cells.forEach((c,i)=>{if(other.s==='rainbow'||c.k===other.k)clear.add(i);});
    }
    if(x.s==='bomb'&&y.s==='bomb')for(let r=0;r<7;r++)for(let c=0;c<7;c++)if(Math.abs(r-Math.floor(b/7))<=2&&Math.abs(c-b%7)<=2)clear.add(r*7+c);
    return {clear,creates:new Map(),rainbowColor:x.s==='rainbow'?y.k:y.s==='rainbow'?x.k:undefined};
  }
  expand(plan){
    const clear=new Set(plan.clear),queue=[...clear],seen=new Set();let triggered=0;
    const add=i=>{if(i>=0&&i<49&&!plan.creates.has(i)&&!clear.has(i)){clear.add(i);queue.push(i);}};
    for(let p=0;p<queue.length;p++){
      const i=queue[p],cell=this.cells[i];if(!cell||seen.has(i))continue;seen.add(i);
      if(cell.s)triggered++;
      const r=Math.floor(i/7),c=i%7;
      if(cell.s==='row')for(let x=0;x<7;x++)add(r*7+x);
      if(cell.s==='col')for(let y=0;y<7;y++)add(y*7+c);
      if(cell.s==='bomb')for(let y=Math.max(0,r-1);y<=Math.min(6,r+1);y++)for(let x=Math.max(0,c-1);x<=Math.min(6,c+1);x++)add(y*7+x);
      if(cell.s==='rainbow'){const counts=Array(7).fill(0);this.cells.forEach(t=>counts[t.k]++);const k=plan.rainbowColor===undefined?counts.indexOf(Math.max(...counts)):plan.rainbowColor;this.cells.forEach((t,j)=>{if(t.k===k)add(j);});}
    }return {clear,creates:plan.creates,triggered};
  }
  apply(plan){
    const removed=[...plan.clear].map(i=>this.cells[i]);
    plan.clear.forEach(i=>this.cells[i]=null);
    plan.creates.forEach((v,i)=>this.cells[i]=this.cell(v.k,v.s));
    for(let c=0;c<7;c++){
      const stack=[];for(let r=6;r>=0;r--)if(this.cells[r*7+c])stack.push(this.cells[r*7+c]);
      for(let r=6;r>=0;r--)this.cells[r*7+c]=stack[6-r]||this.cell(this.pool[Math.floor(this.rng()*this.pool.length)]);
    }return removed;
  }
  shuffle(){
    const saved=[...this.cells];let best=null,bestRank=-1;
    for(let attempt=0;attempt<150;attempt++){
      this.cells=[...saved];
      for(let i=48;i>0;i--){const j=Math.floor(this.rng()*(i+1));this.swap(i,j);}
      if(this.runs().length)continue;
      const choice=this.boardChoices();
      if(choice.ready)return;
      if(choice.count&&choice.rank>bestRank){best=[...this.cells];bestRank=choice.rank;}
    }
    if(best){this.cells=best;return;}
    this.generate();
  }
}
