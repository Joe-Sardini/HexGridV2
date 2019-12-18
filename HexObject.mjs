'use strict'

import { EncounterTypes } from './Enums.mjs';
import { ItemManager } from './ItemManager.mjs';
import { Encounter, Rest, GainPartyMember, Friendly, Combat, Trap, SpotDamage, Treasure, Ressurection } from './Encounters.mjs';
import { PointF } from './PointF.mjs';


//#region Hex object
//represents a game board tile
export class HexObject {
    constructor(image, PointF, index){
        //this._Image = image;
        this._IsSelected = false;
        this._PointF = PointF;
        this._IsVisible = false;
        this._IsEncounterComplete = false;
        this._DifficultyLevel = Math.ceil(Math.random() * 5);
        this._DifficultyLevelColour = this.SetDifficultyLevelColour();
        this._HexIndex = index;
    }

    //#region Properties
    get DifficultyLevelColour(){
        return this._DifficultyLevelColour;
    }
    set DifficultyLevelColour(value){
        this._DifficultyLevelColour = value;
    }

    get HexIndex(){
        return this._HexIndex;
    }
    set HexIndex(value){
        this._HexIndex = value;
    }

    get DifficultyLevel(){
        return this._DifficultyLevel;
    }
    set DifficultyLevel(value){
        this._DifficultyLevel = value;
    }

    get PointF(){
        return this._PointF;
    }
    set PointF(value){
        this._PointF = value;
    }

    get IsSelected(){
        return this._IsSelected;
    }
    set IsSelected(value){
        this._IsSelected = value
    }
    
    get Image(){
        return this._Image;
    }
    set Image(value) {
        this._Image = value;
    }

    get IsVisible(){
        return this._IsVisible;
    }
    set IsVisible(value){
        this._IsVisible = value;
    }

    get EncounterType(){
        return this._EncounterType;
    }
    set EncounterType(value){
        this._EncounterType = value;
        this.SetEncounter();
    }

    get IsEncounterComplete(){
        return this._IsEncounterComplete;
    }
    set IsEncounterComplete(value){
        this._IsEncounterComplete = value;
    }

    get Encounter(){
        return this._Encounter;
    }
    //#endregion 
    
    SetDifficultyLevelColour(){
        switch(this._DifficultyLevel){
            case 1:
                return "#D5DBDB";
            case 2:
                return "#F6DDCC";
            case 3:
                return "#F9E79F";
            case 4:
                return "#7DCEA0";
            case 5:
                return "#85C1E9";
            case 6:
                return "#C39BD3";
            default:
                return "#F7F9F9";
        }
    }

    SetEncounter(){
        let items;
        switch(this._EncounterType){
            case EncounterTypes.COMBAT:
                items = new ItemManager(this._DifficultyLevel,this._EncounterType);
                this._Encounter = new Combat(PointF,items.ItemList,"Combat Encounter!");
                break;
            case EncounterTypes.FRIENDLY:
                items = new ItemManager(this._DifficultyLevel,this._EncounterType);
                this._Encounter = new Friendly(PointF,"","Party heal");
                break;
            case EncounterTypes.INFORMATION:
                items = new ItemManager(this._DifficultyLevel,this._EncounterType);
                this._Encounter = new Encounter(PointF,"","Info not done");
                break;
            case EncounterTypes.TREASURE:
                items = new ItemManager(this._DifficultyLevel,this._EncounterType);
                this._Encounter = new Treasure(PointF,items.ItemList,"Your party found some items!");
                break;
            case EncounterTypes.TRAP:
                this._Encounter = new Trap(PointF,"","It's a trap!!");
                break;
            case EncounterTypes.GAINPARTYMEMBER:
                this._Encounter = new GainPartyMember(PointF,"","Your party expands!");
                break;
            case EncounterTypes.SPOTDAMAGE:
                this._Encounter = new SpotDamage(PointF,"","Encounter Type - Spot Damage.");
                break;    
            case EncounterTypes.REST:
                this._Encounter = new Rest(PointF,"","Encounter Type - Rest.");
                break;  
            case EncounterTypes.RESURRECTION:
                this._Encounter = new Ressurection(PointF,"","Encounter Type - Ressurection");
                break;
            default:
                this._Encounter = new Encounter(PointF,"","Default Encounter.");
        }
        this._Encounter.DifficultyLevel = this._DifficultyLevel;
    }
}
//#endregion
