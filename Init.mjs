'use strict'

// eslint-disable-next-line no-unused-vars
import { RandomEncounter, CreatePlayerCharacter } from './Generators.mjs';
import { Player } from './Characters.mjs';
import { DisplayParty } from './UIFunctions.mjs';
import { EncounterTypes } from './Enums.mjs';

export function InitializeGameData(){
    for (let index = 0; index < window.Hexes.length;index++){
        window.Hexes[index].EncounterType = RandomEncounter(); //EncounterTypes.TREASURE; //
    }
    
    window.PlayerParty.push(new Player(20,25,5,2,1,0,"CP1",window.PlayerParty.length,7,5));
    window.PlayerParty.push(new Player(8,20,5,4,1,0,"CP2",window.PlayerParty.length,5,3));
    window.PlayerParty.push(CreatePlayerCharacter("CP3"));
    DisplayParty();
}
