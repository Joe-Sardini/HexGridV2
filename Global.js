/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
'use strict'

//#region Global letables
window.PlayerParty = [];
window.PlayerPartyItems = [];
window.NPCParty = [];
window.Hexes = [];
window.bCombatIsOver = false;

//Attaching included library functions to global scope so they can be used with modules
window.NameGen = NameGen;
window._.isEqual = _.isEqual;
//#endregion 

//These elements are also referenced in the elements module
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