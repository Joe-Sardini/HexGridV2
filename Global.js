/* eslint-disable no-unused-vars */
'use strict'

//#region Global letables
let PlayerParty = [];
let PlayerPartyItems = [];
let NPCParty = [];
let Hexes = [];
let bCombatIsOver = false;
//#endregion 

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