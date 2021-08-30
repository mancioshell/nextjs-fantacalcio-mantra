function PlayerAlreadyInTeam(message) {
  this.message = message;
}
function MaxOfferOverflow(message) {
  this.message = message;
}
function MaxPlayersAlreadyBought(message) {
  this.message = message;
}

PlayerAlreadyInTeam.prototype = new Error();
MaxOfferOverflow.prototype = new Error();
MaxPlayersAlreadyBought.prototype = new Error();

export { PlayerAlreadyInTeam, MaxOfferOverflow, MaxPlayersAlreadyBought };
