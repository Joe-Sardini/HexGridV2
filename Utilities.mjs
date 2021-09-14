'use strict'

import { DisplayParty } from './UIFunctions.mjs';
// eslint-disable-next-line no-unused-vars
import { Player } from './Characters.mjs';
// eslint-disable-next-line no-unused-vars
import { Item } from './Item.mjs';

export function CompareInitiative(a,b){
    if (a.Initiative < b.Initiative){
        return -1;
    }
    if (a.Initiative > b.Initiative){
        return 1;
    }
    return 0;
}

export function StringOfEnum(enumObj,value){
    for (let k in enumObj) if (enumObj[k] == value) return k;
    return null;
}

export function CheckWinCondition(){
    return (window.HexesCompletedTracker === window.HexCount ? true : false);
    // if (window.HexesCompletedTracker === window.HexCount){
    //     return true;
    // }
    // return false;
}

export function CheckIfPartyIsAllDead(){
    for(let idx = 0; idx < window.PlayerParty.length;idx++){
        if (window.PlayerParty[idx].IsAlive){
            return false;
        }
    }
    return true;
}

export function CheckIfNPCPartyIsAllDead(){
    for(let idx = 0; idx < window.NPCParty.length;idx++){
        if (window.NPCParty[idx].IsAlive){
            return false;
        }
    }
    return true;
}

export function ApplyPartyItems(){
    window.PlayerParty.forEach(e => {e.ApplyItems();});
    DisplayParty();
}

export function GenerateRandomNumberInRange(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Used in drag and drop inventory window(s)
export function TransferItems(from,to,itemName){
    (from === 'ibackpack' ? TransferItemFromBackpack(to,itemName) : TransferItemFromCharacter(from,to,itemName));
    // if (from === 'ibackpack'){
    //     TransferItemFromBackpack(to,itemName);
    // }else{
    //     TransferItemFromCharacter(from,to,itemName);
    // }
}

function TransferItemFromBackpack(to,itemName){
    //find the item
    const sItem = (Item) => Item.ItemName === itemName;
    const itemIndex = window.PartyBackpack.findIndex(sItem); 

    //make a copy of the item
    const item = window.PartyBackpack.find(Item => window._.isEqual(Item.ItemName,itemName));

    //get index of party memeber that we drop to
    const PCToIndex = to.substring(6,to.length);

    //do a switcheroo
    if (itemIndex > -1) {
        item.IsApplied = false;
        window.PartyBackpack = window.PartyBackpack.slice(0,itemIndex).concat(window.PartyBackpack.slice(itemIndex+1,window.PartyBackpack.length));
        if (window.PlayerParty[PCToIndex] != undefined){
            window.PlayerParty[PCToIndex].AddItem(item);
        }
    }
    DisplayParty();
}

function TransferItemFromCharacter(from,to,itemName){
    const fromChar = window.PlayerParty.find(Player => window._.isEqual(Player.Name,from));

    //find the item
    const sItem = (Item) => Item.ItemName === itemName;
    const itemIndex = window.PlayerParty[fromChar.Index].Inventory.findIndex(sItem); 
    
    //make a copy of the item
    const item = window.PlayerParty[fromChar.Index].Inventory.find(Item => window._.isEqual(Item.ItemName,itemName));
    
    //get index of party memeber that we drop to
    const PCToIndex = to.substring(6,to.length);

    //do a switcheroo
    if (itemIndex > -1){
        item.IsApplied = false;
        window.PlayerParty[fromChar.Index].RemoveItem(item);
        if (window.PlayerParty[PCToIndex] != undefined){
            window.PlayerParty[PCToIndex].AddItem(item);
        }
    }

    if (to === "backpack"){
        item.IsApplied = false;
        window.PartyBackpack.push(item);
    }
    DisplayParty();
}

