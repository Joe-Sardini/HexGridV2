'use strict'

import { EncounterTypes } from './Enums.mjs';
import { NPC, Player } from './Characters.mjs'


export function RandomEncounter(){
    let rnd = Math.ceil(Math.random() * 8);
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
        default:
            return EncounterTypes.REST;
    }
}

export function CreateNPC(name,difficultyLevel = 1,index){
    let strength = GenerateRandomNumberInRange(2,10);
    strength *= difficultyLevel;

    //health
    let health = GenerateRandomNumberInRange(2,10);
    health *= difficultyLevel;
    //dmg
    let damage = GenerateRandomNumberInRange(2,7);
    damage *= difficultyLevel;

    //tohit
    let tohit = GenerateRandomNumberInRange(4,8);
    tohit *= difficultyLevel;

    //Evasion
    let evasion = GenerateRandomNumberInRange(0,4);
    evasion *= difficultyLevel;

    //Armor
    let armor = GenerateRandomNumberInRange(1,6);
    armor *= difficultyLevel;

    return new NPC(strength,health,damage,tohit,difficultyLevel,25*difficultyLevel,name,index,evasion,armor);
}

export function CreatePlayerCharacter(name){
    //strength
    let strength = GenerateRandomNumberInRange(4,16);
   
    //health
    let health = GenerateRandomNumberInRange(14,31);

    //dmg
    let damage = GenerateRandomNumberInRange(2,7);

    //tohit
    let tohit = GenerateRandomNumberInRange(6,12);

    //Evasion
    let evasion = GenerateRandomNumberInRange(2,8);

    //Armor
    let armor = GenerateRandomNumberInRange(1,3);

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
    let rnd = Math.ceil(Math.random() * Party.length-1);
    if (!Party[rnd].IsAlive){
        SelectTarget(Party);
    }
    return rnd;
}

function SelectTarget(Party){
    let rnd = Math.ceil(Math.random() * Party.length-1);
    if (!Party[rnd].IsAlive){
        SelectTarget(Party);
    }
    return Party[rnd];
}