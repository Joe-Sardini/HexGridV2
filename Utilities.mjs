'use strict'

import { DisplayParty } from './UIFunctions.mjs';

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
