// Keep the original level indices and collection unlocks. Bridge chapter 1 to the return journey.
const bridgeMoves=[[25,25,25],[25,25,26],[25,26,26],[26,26,26],[26,26,27],[26,27,27],[27,27,27],[27,27,27]];
for(let i=12;i<36;i++){
 const group=Math.floor((i-12)/3),stage=(i-12)%3;
 Object.assign(levels[i],{goal:1900+(i-12)*100,moves:bridgeMoves[group][stage],count:10+group+stage,
  pool:i<18?[0,1,2,3,4]:[0,1,2,3,4,5],stars:[4,9]});
 if(!levels[i].pool.includes(levels[i].color))levels[i].pool.push(levels[i].color);
}
// Eight three-level arcs: familiar objective, changed board, combined challenge.
const bridgeArcs=[
 {ice:'window',type:'steam',color:3,tip:'先收集草芽；再用已有水附着与火糖配合，清理窗边薄霜。'},
 {ice:'corners',type:'bloom',color:0,tip:'先收集火糖；水与草附着会绽芽，边角薄霜可用直线糖处理。'},
 {ice:'steps',type:'steam',color:3,tip:'颜色逐步增加到六种；先适应新棋盘，再安排水火蒸腾。'},
 {ice:'path',type:'steam',color:1,tip:'沿着薄霜路径规划交换，水火反应能帮你打开局面。'},
 {ice:'waves',type:'bloom',color:4,tip:'试着留下直线糖，清理薄霜后安排水草绽芽。'},
 {ice:'ring',type:'bloom',color:5,tip:'先处理环形薄霜，再用水草反应收好海边的星光。'},
 {ice:'frame',type:'steam',color:0,tip:'用特殊糖清理冰纹，水火反应完成最后一步。'},
 {ice:'stars',type:'any',color:2,tip:'把已学会的薄霜、元素反应和收集目标连起来。'}
];
for(let i=12;i<36;i++){
 const arc=bridgeArcs[Math.floor((i-12)/3)],stage=(i-12)%3,d=levels[i];
 d.managedGoals=true;d.color=stage===1?-1:arc.color;d.count=stage===1?0:stage===2?12+Math.floor((i-12)/3):10+Math.floor((i-12)/3);
 d.ice=stage===0?[]:[...returnIce[arc.ice]];
 d.reactions=stage===0?0:stage===1?arc.type==='any'?1:1:arc.type==='any'?2:1;
 d.types=d.reactions?[arc.type]:[];d.auras=d.reactions?arc.type==='bloom'?[[3,'grass'],[24,'water'],[45,'grass']]:[[3,'water'],[24,'fire'],[45,'water']]:[];
 d.recommend=arc.type==='bloom'?1:0;d.tip=stage===0?'用熟悉的收集目标热身；连成四颗可留下直线糖。':stage===1?arc.tip:'这是本组三关的小挑战：'+arc.tip;
 if(i===18)d.pool=[0,1,2,3,4]; // Level 19 remains five colors; level 20 introduces six.
 if(i>=19&&i<36)d.pool=[0,1,2,3,4,5];
 if(!d.pool.includes(d.color)&&d.color>=0)d.pool.push(d.color);
}
// In-progress rounds from older builds keep their original targets until that round ends.
function roundLevel(saved){
 if(state.mode!=='story')return null;
 const base=state.chapter?.legacy||saved&&!saved.rulesVersion&&state.level>=12&&state.level<36?legacyLevels[state.level]:levels[state.level];
 const old=saved?.levelTargets;
 if(old&&Number.isInteger(old.goal)&&old.goal>=100&&old.goal<=100000&&Number.isInteger(old.count)&&old.count>=0&&old.count<=100&&Number.isInteger(old.color)&&old.color>=-1&&old.color<=6)
  return {...base,goal:old.goal,count:old.count,color:old.color};
 return {...base};
}
