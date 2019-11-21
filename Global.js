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
    console.log("drag started");
    ev.dataTransfer.setData("text/plain", ev.target.innerText);
}

window.dragover_handler = function(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

window.drop_handler = function(ev) {
    console.log("Dro ZOne");
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    //var data = ev.dataTransfer.getData("text/plain");
    //ev.target.appendChild(document.getElementById(data));
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});