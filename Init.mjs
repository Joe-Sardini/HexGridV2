'use strict'

import { RandomEncounter, CreatePlayerCharacter } from './Generators.mjs';
import { Player } from './Characters.mjs';

export function InitializeGameData(){
    for (let index = 0; index < window.Hexes.length;index++){
        window.Hexes[index].EncounterType = RandomEncounter();
    }
    
    window.PlayerParty.push(new Player(10,20,5,10,1,0,"CP1",window.PlayerParty.length,7,5));
    window.PlayerParty.push(new Player(8,20,5,10,1,0,"CP2",window.PlayerParty.length,5,3));
    window.PlayerParty.push(CreatePlayerCharacter("CP3"));
    DisplayParty();
}
