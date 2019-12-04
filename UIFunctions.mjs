'use strict'

import { NPCInfoElement, EndGameOverlayElement, PlayerInfoElement, inventoryListElement, modal } from './Elements.mjs';
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

export function UpdateNPCDisplay(){
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
        EndGameOverlayElement.innerText = "The party is all dead, game over!";
        EndGameOverlayElement.style.display = "block";
    }
    ConfigurePartyDisplay();
}

export function DisplayParty(){
    PlayerInfoElement.innerHTML = "<thead><tr><Th>Character Info</th></tr></thead>";
    for (let i = 0; i < window.PlayerParty.length; i++){
        let PlayerCharacter = window.PlayerParty[i];
        PlayerInfoElement.innerHTML += `<tr><TD><div class='PCDisplay' id='PCSlot${i}' style='border:2px solid black; width:150px' ondrop='drop_handler(event)' ondragover='dragover_handler(event)'> 
            Name: ${PlayerCharacter.Name} 
            <BR/>Init: ${DetermineStatColor(PlayerCharacter.Initiative,PlayerCharacter.BaseInitiative) 
            + PlayerCharacter.Initiative}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dmg: ${DetermineStatColor(PlayerCharacter.Damage,PlayerCharacter.BaseDamage) 
            + PlayerCharacter.Damage}</span><BR/>ToHit: ${DetermineStatColor(PlayerCharacter.ToHit,PlayerCharacter.BaseToHit) 
            + PlayerCharacter.ToHit}</span>&nbsp;&nbsp;&nbsp;Ev: ${DetermineStatColor(PlayerCharacter.Evasion,PlayerCharacter.BaseEvasion) 
            + PlayerCharacter.Evasion}</span><BR/>HP: ${DetermineStatColor(PlayerCharacter.CurrentHealth,PlayerCharacter.Health) 
            + PlayerCharacter.CurrentHealth}</span>/${PlayerCharacter.Health} 
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

export function HandlePartyDisplayClick(PartyMemberIndex){
    window.PlayerMemberIndex = PartyMemberIndex;
    inventoryListElement.innerHTML = BuildCharacterInventoryDisplay(window.PlayerParty[PartyMemberIndex]);
}

function BuildCharacterInventoryDisplay(Character){
    modal.style.display = "block";
    let invenTableHTML = "<table class='steelBlueCols'><thead><tr><th colspan=4>Inventory</th></tr></thead><tbody><tr>";
    
    for (let idx = 0; idx < Character.Inventory.length; idx++){
        let ToolTipData = Character.Inventory[idx].ItemName 
        + "\n" + StringOfEnum(ItemTypes,Character.Inventory[idx].ItemType) 
        + "\n" + StringOfEnum(Rarity,Character.Inventory[idx].ItemRarity);

        invenTableHTML += `<td><a href='#' draggable='true' ondragstart='dragstart_handler(event)' data-toggle='tooltip' id='${Character.Name}' data-html=true data-placement='bottom' title='${ToolTipData}'><img src='${Character.Inventory[idx].ImageLocation}' width='20px' height='20px' />${Character.Inventory[idx].ItemName}</a></td>`;

        if ((idx-3) % 4 === 0){
            invenTableHTML += "</tr><tr>";
        }
    }
    invenTableHTML += "</tr></table>";
    return invenTableHTML;
}

function HandleDeadPartyDisplayClick(){
    //TODO 
    console.log("This character is dead.");
}

