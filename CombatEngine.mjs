'use strict'

import { CombatLogElement, EventLogElement } from './Elements.mjs';
import { Player } from './Characters.mjs';
import { CompareInitiative } from './Utilities.mjs';
import { UpdateDisplay, UpdateNPCDisplay } from './UIFunctions.mjs';

//#region CombatEngine
export class CombatEngine{
    constructor(PlayerParty,EnemyParty){
        this._PlayerParty = [];
        for (let idx = 0; idx < PlayerParty.length; idx++){ //Only add living players to merged list
            if (PlayerParty[idx].IsAlive){
                this._PlayerParty.push(PlayerParty[idx]);    
            }
        }
        this._EnemyParty = EnemyParty;
        this._MergedParties = [];
        this._CombatLogElement = CombatLogElement;
    }

    //#region Properties
    get PlayerParty(){
        return this._PlayerParty;
    }
    set PlayerParty(value){
        this._PlayerParty = value;
    }
    get EnemyParty(){
        return this._EnemyParty;
    }
    set EnemyParty(value){
        return this._EnemyParty = value;
    }
    //#endregion

    DetermineOrderOfBattle(){
        this._MergedParties = this._PlayerParty.concat(this._EnemyParty);
        this._MergedParties.sort(CompareInitiative);
    }

    IsPartyAllDead(party){
        for(let idx = 0; idx < party.length; idx++){
            if (party[idx].IsAlive){
                return false;
            }
        }
        return true;
    }

    //One v One combat
    PvNPCCombat(player1,player2,isPC){
        let damage = 0;
        const max = 24;
        const min = 10;
        let P1Roll = Math.floor(Math.random() * (max - min + 1)) + min;
        P1Roll = P1Roll-player2.Evasion;
        this._CombatLogElement.innerHTML += `<BR>${player1.Name} makes an attack and `;
        if (P1Roll > player1.ToHit){ //Hit scored
            damage = (player1.Damage*2) - player2.Armor;
            if (damage > 0) {
                this._CombatLogElement.innerHTML += `hits ${player2.Name} for ${damage} damage!`;
                if (isPC){
                    this._EnemyParty[player2.Index].CurrentHealth -= damage;
                    if (this._EnemyParty[player2.Index].IsAlive === false){
                        try {
                            if (this._PlayerParty[player1.Index].ExperiencePoints != undefined){
                                this._PlayerParty[player1.Index].ExperiencePoints += this._EnemyParty[player2.Index].ExperienceValue;
                            }
                        } catch (exception){
                            console.log(exception);
                        }
                    }
                }else{
                    try {
                        this._PlayerParty[player2.Index].CurrentHealth -= damage;    
                    } catch (ex){
                        
                    }
                }
            }else{
                this._CombatLogElement.innerHTML += `does no damage!`;
            }
        }else{
            this._CombatLogElement.innerHTML += `misses!`;
        }
    }

    RandomTargetCombatRound(){
        for (let i = 0; i < this._MergedParties.length; i++){
            if (this._MergedParties[i].IsAlive){
                if (this._MergedParties[i] instanceof Player){ //Player character turn
                    this.PvNPCCombat(this._MergedParties[i],this.SelectTarget(this._EnemyParty),true);
                }else{ //NPC combat turn
                    this.PvNPCCombat(this._MergedParties[i],this.SelectTarget(this._PlayerParty),false);
                }
            }
            if (this.IsPartyAllDead(this._EnemyParty) || this.IsPartyAllDead(this._PlayerParty)){
                window.bCombatIsOver = true;
                EventLogElement.innerHTML += `<BR> ${(this.IsPartyAllDead(this._EnemyParty)) ? 'Enemy ' : 'Player '} party destroyed!`;
                return true;
                //break;
            }
        }
    }

    RandomTargetCombat(){
        this.DetermineOrderOfBattle();
        this.RandomTargetCombatRound();        
        UpdateDisplay();
        UpdateNPCDisplay();
    }

    SelectTarget(Party){
        const rnd = Math.ceil(Math.random() * Party.length-1);
        if (!Party[rnd].IsAlive){
            this.SelectTarget(Party);
        }
        return Party[rnd];
    }
}
//#endregion
