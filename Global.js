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

window.dragstart_handler = function(ev){
    ev.dataTransfer.setData("text/plain", ev.target.innerHTML);
    ev.dataTransfer.setData("CharacterName", ev.target.id);
}

window.dragover_handler = function(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

window.drop_handler = function(ev) {
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    let data = ev.dataTransfer.getData("text/plain");
    let cName = ev.dataTransfer.getData("CharacterName");
    //console.log(cName + "-->" + ev.target.id);
    var event = new CustomEvent('TransferItem',{from:data,to:cName});
    window.dispatchEvent(event)
    //ev.target.appendChild(document.getElementById(data));
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});