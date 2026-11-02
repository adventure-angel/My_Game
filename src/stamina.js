// Legacy save compatibility. Starting or retrying a game is now free of stamina.
const staminaRules={max:50,cost:0,interval:300000};
function normalizeStamina(raw){
 const now=Date.now();return {version:3,value:Number.isInteger(raw?.value)?Math.max(0,Math.min(100,raw.value)):50,updatedAt:Number.isFinite(raw?.updatedAt)?Math.min(now,raw.updatedAt):now,recovery:0};
}
data.stamina=normalizeStamina(data.stamina);
function syncStamina(){return data.stamina;}
function spendStamina(){return true;}
function staminaView(){return '';}
function updateStaminaView(){}
function handleStaminaAction(b){
 if(b.dataset.action==='staminaInfo'){showDialog('<h2 id="dialogTitle">自在出发</h2><p>闯关与重试都不再消耗体力，按自己的节奏玩就好。</p><button class="primary" data-action="close">知道了</button>');return true;}
 if(b.dataset.action==='staminaBack'){closeDialog();return true;}return false;
}
