'use strict'

import { NPCInfoElement, EndGameOverlayElement, PlayerInfoElement, inventoryListElement } from './Elements.mjs';
import { StringOfEnum, CheckIfPartyIsAllDead, CheckIfNPCPartyIsAllDead } from './Utilities.mjs';
import { ItemTypes, Rarity } from './Enums.mjs';


export function DisplayNPCParty(){
    NPCInfoElement.innerHTML = "<thead><tr><Th class='InfoTableHeaders'>NPC Info</th></tr></thead>";
    let HealthIndicatorFont = "<span style='color:black';>";
    for (let i = 0; i < window.NPCParty.length; i++){
        if (window.NPCParty[i].IsAlive){
            if(window.NPCParty[i].CurrentHealth < window.NPCParty[i].Health){
                HealthIndicatorFont = "<span style='color:red';>";
                }else{
                    HealthIndicatorFont = "<span style='color:black';>";
            }
        }
        NPCInfoElement.innerHTML += `<tr><TD><div class='NPCDisplay' id='NPCSlot${i}' style='border:2px solid black; width:450px'> 
            Name: ${window.NPCParty[i].Name} 
            <BR/>Init: ${window.NPCParty[i].Initiative}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dmg: ${window.NPCParty[i].Damage} 
            <BR/>ToHit: ${window.NPCParty[i].ToHit}&nbsp;&nbsp;&nbsp;Ev: ${window.NPCParty[i].Evasion}
            <BR/>HP: ${HealthIndicatorFont + window.NPCParty[i].CurrentHealth}</span>/${window.NPCParty[i].Health} 
            </div></TD></tr>`;
    }
    UpdateNPCDisplay();
}

function UpdateNPCDisplay(){
    for (let i = 0; i < window.NPCParty.length; i++){
        if (!window.NPCParty[i].IsAlive){
            let divID = `NPCSlot${i}`;
            document.getElementById(divID).style.backgroundColor = "grey";
        }
    }
    if (CheckIfNPCPartyIsAllDead()){
        //Do something!
    }
}

export function UpdateDisplay(){
    for (let i = 0; i < window.PlayerParty.length; i++){
        if (!window.PlayerParty[i].IsAlive){
            let divID = `PCSlot${i}`;
            document.getElementById(divID).style.backgroundColor = "grey";
        }
    }
    if (CheckIfPartyIsAllDead()){
        console.log("The party is all dead, game over!");
        EndGameOverlayElement.innerText = "The party is all dead, game over!";
        EndGameOverlayElement.style.display = "block";
    }
    ConfigurePartyDisplay();
}

export function DisplayParty(){
    PlayerInfoElement.innerHTML = "<thead><tr><Th>Character Info</th></tr></thead>";
    for (let i = 0; i < window.PlayerParty.length; i++){
        PlayerInfoElement.innerHTML += `<tr><TD><div class='PCDisplay' id='PCSlot${i}' style='border:2px solid black; width:150px'> 
        Name: ${window.PlayerParty[i].Name} 
        <BR/>Init: ${DetermineStatColor(window.PlayerParty[i].Initiative,window.PlayerParty[i].BaseInitiative) + window.PlayerParty[i].Initiative}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dmg: ${DetermineStatColor(window.PlayerParty[i].Damage,window.PlayerParty[i].BaseDamage) + window.PlayerParty[i].Damage}</span> 
        <BR/>ToHit: ${DetermineStatColor(window.PlayerParty[i].ToHit,window.PlayerParty[i].BaseToHit) + window.PlayerParty[i].ToHit}</span>&nbsp;&nbsp;&nbsp;Ev: ${DetermineStatColor(window.PlayerParty[i].Evasion,window.PlayerParty[i].BaseEvasion) + window.PlayerParty[i].Evasion}</span>
        <BR/>HP: ${DetermineStatColor(window.PlayerParty[i].CurrentHealth,window.PlayerParty[i].Health) + window.PlayerParty[i].CurrentHealth}</span>/${window.PlayerParty[i].Health} 
        </div></TD></tr>`;
    }
    UpdateDisplay();
}

function DetermineStatColor(newValue,oldValue){
    if (newValue < oldValue){
        return "<span style='color:red';>";
    }
    if (newValue > oldValue){
        return "<span style='color:#49fb35';>";
    }
    return "<span style='color:black';>";
}

function ConfigurePartyDisplay(){
    for (let i = 0; i < window.PlayerParty.length; i++){
        let divID = `PCSlot${i}`;
        if (window.PlayerParty[i].IsAlive){
            document.getElementById(divID).addEventListener("click",function(){HandlePartyDisplayClick(i);},false);
        }else{
            document.getElementById(divID).addEventListener("click",HandleDeadPartyDisplayClick);
        }
    }
}

function HandlePartyDisplayClick(partyMemberIndex){
    modal.style.display = "block";
    let invenTableHTML = "<table class='steelBlueCols'><thead><tr><th colspan=4>Inventory</th></tr></thead><tbody><tr>";
    
    for (let idx = 0; idx < window.PlayerParty[partyMemberIndex].Inventory.length; idx++){
        if (idx == 4 || idx == 8 || idx == 12){
            invenTableHTML += "<tr>";
        }
        let tooltipdata = window.PlayerParty[partyMemberIndex].Inventory[idx].ItemName + "\n" + StringOfEnum(ItemTypes,window.PlayerParty[partyMemberIndex].Inventory[idx].ItemType) + "\n" + StringOfEnum(Rarity,window.PlayerParty[partyMemberIndex].Inventory[idx].ItemRarity);
        invenTableHTML += "<td><a class='test' href='#' data-toggle='tooltip' data-html=true data-placement='bottom' title='" + tooltipdata + "'>" + window.PlayerParty[partyMemberIndex].Inventory[idx].ItemName + "</a></td>"
        if (idx == 4 || idx == 8 || idx == 12){
            invenTableHTML += "</tr>";
        }

    }
    invenTableHTML += "</tr></table>";

    inventoryListElement.innerHTML = invenTableHTML;
}

function HandleDeadPartyDisplayClick(){
    //TODO 
    console.log("This character is dead.");
}