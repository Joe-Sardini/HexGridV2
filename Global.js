/* eslint-disable no-unused-vars */
'use strict'

//#region Global letables
window.PlayerParty = [];
window.PlayerPartyItems = [];
window.NPCParty = [];
window.Hexes = [];
window.bCombatIsOver = false;
// eslint-disable-next-line no-undef
window.NameGen = NameGen;
// eslint-disable-next-line no-undef
window._.isEqual = _.isEqual;
//#endregion 

const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

span.onclick = function(){
    modal.style.display = "none";
}

window.onclick = function(event){
    if (event.target == modal) {
      modal.style.display = "none";
    }
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});