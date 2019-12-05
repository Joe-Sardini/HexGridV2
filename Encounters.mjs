
'use strict'

import { EncounterHistoryElement } from './Elements.mjs';
import { CombatEngine } from './CombatEngine.mjs';
import { DisplayParty, DisplayNPCParty } from './UIFunctions.mjs';
import { CreatePlayerCharacter, CreatNPCName, CreateNPC, RandomPartyMemberIndex } from './Generators.mjs';
import { ApplyPartyItems } from './Utilities.mjs';

//#region Encounters
export class Encounter {
    constructor(location, items, description){
        this._Location = location;
        this._Items = items;
        this._Description = description;
        this._EncounterLogElement = EncounterHistoryElement;
    }
    
    get Location(){
        return this._Location;
    }
    set Location(value){
        this._Location = value;
    }
    get Items(){
        return this._Items;
    }
    set Items(value){
        this._Items = value;
    }
    get Description(){
        return this._Description;
    }
    set Description(value){
        this._Description = value;
    }
    get DifficultyLevel(){
        return this._DifficultyLevel;
    }
    set DifficultyLevel(value){
        this._DifficultyLevel = value;
    }
    RunEncounter(){
        this._EncounterLogElement.innerHTML += `<BR> ${this._Description}`;
    }
}

export class Rest extends Encounter{
    constructor(location,items,description){
        super(location,items,description);    
    }

    RunEncounter(){
        EncounterHistoryElement.innerHTML += "<BR>Your party is partially healed.";
        this.PartialPartyHealing();
        DisplayParty();
    }

    PartialPartyHealing(){
        const healingAmount = Math.ceil(Math.random() * 3)*this._DifficultyLevel;
        for (let idx = 0;idx < window.PlayerParty.length;idx++){
            if ((window.PlayerParty[idx].CurrentHealth + healingAmount) > window.PlayerParty[idx].Health){
                window.PlayerParty[idx].CurrentHealth = window.PlayerParty[idx].Health;
            }else{
                window.PlayerParty[idx].CurrentHealth += healingAmount;
            }
        }
    }
}

export class GainPartyMember extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
    }
    
    RunEncounter(){
        this._EncounterLogElement.innerHTML += `<BR> ${this._Description}`;
        window.PlayerParty.push(CreatePlayerCharacter("New PC ".concat(window.PlayerParty.length-2)));
        DisplayParty();
    }
}

export class Friendly extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
    }

    RunEncounter(){
        this._EncounterLogElement.innerHTML += "<BR>Your party is fully healed.";
        window.PlayerParty.forEach(player => {player.RestoreHealth();});
        DisplayParty();
    }
}

export class Combat extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
    }
    
    ConstructEnemyParty(){
        let partySize = 2 + this._DifficultyLevel;
        let name;
        let party = [];
        for (let index = 0; index < partySize;index++){
            name = CreatNPCName("!BsV!i");
            party.push(CreateNPC(name,this._DifficultyLevel,party.length));
            party[index].index = index;
        }
        window.NPCParty = party;
        DisplayNPCParty();
        return party;
    }

    RunEncounter(){
        this._EncounterLogElement.innerHTML += `<BR> ${this.Description}`;
        // Should probably have a global combat engine so I'm not making a new one everytime
        const combatEncounter = new CombatEngine(window.PlayerParty,this.ConstructEnemyParty());
        let idx = 0;
        do{
            combatEncounter.RandomTargetCombat();
            if (idx > 50){ //50 rounds max
                window.bCombatIsOver = true;
            }
            idx++;
        }while(!window.bCombatIsOver);

        window.bCombatIsOver = false;
        DisplayNPCParty();
        DisplayParty();
    }
}

export class Trap extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
        this._TrapDamage = 3;
    }

    get TrapDamage(){
        return this._TrapDamage;
    }
    set TrapDamage(value){
        this._TrapDamage = value;
    }

    RunEncounter(){
        this._EncounterLogElement.innerHTML += `<BR>Trap Damage - ${this._TrapDamage*this._DifficultyLevel} damage to all party memebers.`;
        for (let idx = 0; idx < window.PlayerParty.length; idx++){
            if (window.PlayerParty[idx].IsAlive){
                window.PlayerParty[idx].CurrentHealth = (window.PlayerParty[idx].CurrentHealth - (this._TrapDamage * this._DifficultyLevel));
            }
        }
        DisplayParty();
    }
}

export class SpotDamage extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
        this._SpotDamage = 5; //Base damage value
    }

    get SpotDamage(){
        return this._SpotDamage;
    }
    set SpotDamage(value){
        this._SpotDamage = value;
    }

    RunEncounter(){
        this._EncounterLogElement.innerHTML += "<BR>A few of your party members take damage...";
        this.SprinkleDamage();
        DisplayParty();
    }

    SprinkleDamage(){
        const numberOfVictims = Math.ceil(Math.random() * (window.PlayerParty.length+1)/2)+1;
        for (let i = 0; i < numberOfVictims; i++){
            let playerIndex = Math.ceil(Math.random() * window.PlayerParty.length-1);
            let damageTaken = Math.ceil(Math.random() * this._SpotDamage+1)*this._DifficultyLevel;
            if (window.PlayerParty[playerIndex].IsAlive){
                window.PlayerParty[playerIndex].CurrentHealth -= damageTaken;

            }
        }
    }
}

export class Treasure extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
    }

    RunEncounter(){
        this._Items.forEach(e => {console.log(e);});
        for (let idx = 0; idx < this._Items.length; idx++){
            window.PlayerParty[RandomPartyMemberIndex(window.PlayerParty)].Inventory.push(this._Items[idx]);
        }
        window.PlayerParty.forEach(e => {e.ApplyExperience(5)})
        ApplyPartyItems();
    }
}
//#endregion
