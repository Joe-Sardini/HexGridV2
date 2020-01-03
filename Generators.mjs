'use strict'

import { EncounterTypes } from './Enums.mjs';
import { NPC, Player } from './Characters.mjs'


export function RandomEncounter(){
    let rnd = Math.ceil(Math.random() * 9);
    switch(rnd){
        case 1:
            return EncounterTypes.COMBAT;
        case 2:
            return EncounterTypes.FRIENDLY;
        case 3:
            return EncounterTypes.INFORMATION;
        case 4:
            return EncounterTypes.REST;
        case 5:
            return EncounterTypes.TREASURE;
        case 6:
            return EncounterTypes.TRAP;
        case 7:
            return EncounterTypes.GAINPARTYMEMBER;
        case 8:
            return EncounterTypes.SPOTDAMAGE;
        case 9:
            return EncounterTypes.RESURRECTION;
        default:
            return EncounterTypes.REST;
    }
}

export function CreateNPC(name,difficultyLevel = 1,index){
    const strength = GenerateRandomNumberInRange(2,10) * difficultyLevel;
    const health = GenerateRandomNumberInRange(2,10) * difficultyLevel;
    const damage = GenerateRandomNumberInRange(2,7) * difficultyLevel;
    const tohit = GenerateRandomNumberInRange(4,8) * difficultyLevel;
    const evasion = GenerateRandomNumberInRange(0,4) * difficultyLevel;
    const armor = GenerateRandomNumberInRange(1,6) * difficultyLevel;

    return new NPC(strength,health,damage,tohit,difficultyLevel,25*difficultyLevel,name,index,evasion,armor);
}

export function CreatePlayerCharacter(name){
    const strength = GenerateRandomNumberInRange(4,16);
    const health = GenerateRandomNumberInRange(14,31);
    const damage = GenerateRandomNumberInRange(2,7);
    const tohit = GenerateRandomNumberInRange(6,12);
    const evasion = GenerateRandomNumberInRange(2,8);
    const armor = GenerateRandomNumberInRange(1,3);

    return new Player(strength,health,damage,tohit,1,0,name,window.PlayerParty.length,window.PlayerParty.length,evasion,armor);
}

function GenerateRandomNumberInRange(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// eslint-disable-next-line no-unused-vars
export function CreatNPCName(seed){
    // eslint-disable-next-line no-undef
    const generator = NameGen.compile(seed);
    return generator.toString();
}

export function RandomPartyMemberIndex(Party){
    let rnd = Math.ceil(Math.random() * Party.length - 1);
    if (!Party[rnd].IsAlive){
        RandomPartyMemberIndex(Party);
    }
    return rnd;
}