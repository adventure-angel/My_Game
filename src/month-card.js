// Legacy shape retained; paid passes have been retired.
function normalizeMonthCard(){return {version:1,startsAt:0,expiresAt:0,claimedDays:[]};}
data.monthCard=normalizeMonthCard();
function monthCardActive(){return false;}
function monthCardBanner(){return '';}
function handleMonthCardAction(b){
 if(['monthCard','monthCardClaim'].includes(b.dataset.action)){showShop('rewards');return true;}
 return false;
}
