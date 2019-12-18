/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
'use strict'

//#region Global letables
window.PlayerParty = [];
window.PlayerPartyItems = [];
window.NPCParty = [];
window.Hexes = [];
window.bCombatIsOver = false;
window.PlayerMemberIndex = 0;
window.PartyBackpack = [];
window.HexesCompletedTracker = 0;
window.HexCount = 0;

//Attaching included library functions to global scope so they can be used with modules
window.NameGen = NameGen;
window._.isEqual = _.isEqual;
var dragged;
//#endregion 

//These elements are also referenced in the elements module
const modal = document.getElementById("myModal");
const modalBackpack = document.getElementById("modalBackpack");
const span = document.getElementsByClassName("close")[0];
const spanBP = document.getElementsByClassName("closeBP")[0];

span.onclick = function(){
    modal.style.display = "none";
}

spanBP.onclick = function(){
    modalBackpack.style.display = "none";
}

window.onclick = function(event){
    if (event.target == modal) {
        modal.style.display = "none";
    }else if (event.target == modalBackpack) {
        modalBackpack.style.display = "none";
    }
}

function extractItemName(item){
    const itemName = item.substring(item.lastIndexOf('>')+1);
    return itemName;
}

window.dragstart_handler = function(ev){
    ev.dataTransfer.setData("text/plain", extractItemName(ev.target.innerHTML));
    ev.dataTransfer.setData("CharacterName", ev.target.id);
    dragged = ev.target;
}

window.dragover_handler = function(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

window.drop_handler = function(ev) {
    ev.preventDefault();
    const ItemData = ev.dataTransfer.getData("text/plain");
    const FromChar = ev.dataTransfer.getData("CharacterName");
    const ToCharSlot = ev.target.id; 
    if (dragged.parentNode !== null){
        dragged.parentNode.removeChild(dragged);
        window.TransferItems(FromChar,ToCharSlot,ItemData);
        window.DisplayParty();
        const event = new Event('click');
        if (FromChar === 'ibackpack'){
            document.getElementById('backpack').dispatchEvent(event);    
        }else{
            document.getElementById(`PCSlot${window.PlayerMemberIndex}`).dispatchEvent(event);
        }
    }
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});
