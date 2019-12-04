'use strict'

import { DisplayParty } from './UIFunctions.mjs?v=1';
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
    window.PlayerParty.forEach(function(e){e.ApplyItems();});
    DisplayParty();
}

export function GenerateRandomNumberInRange(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Used in drag and drop inventory window to charcter slots
export function TransferItems(from,to,itemName){
    //find who it's from
    let fromChar = window.PlayerParty.find(Player => window._.isEqual(Player.Name,from));

    //find the item
    const sItem = (Item) => Item.ItemName === itemName;
    let itemIndex = window.PlayerParty[fromChar.Index].Inventory.findIndex(sItem); 
    
    //make a copy of the item
    let item = window.PlayerParty[fromChar.Index].Inventory.find(Item => window._.isEqual(Item.ItemName,itemName));
    
    //get index of party memeber that we drop to
    let PCToIndex = to.substring(6,to.length);

    //do a switcheroo
    if (itemIndex > -1) {
        item.IsApplied = false;
        window.PlayerParty[fromChar.Index].RemoveItem(item);
        if (window.PlayerParty[PCToIndex] != undefined){
            window.PlayerParty[PCToIndex].AddItem(item);
        }
        DisplayParty();
    }
}

