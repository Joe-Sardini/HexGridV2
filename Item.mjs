'use strict'

//#region Items
export class Item {
    constructor(itemName,damagemod,str,health,dmg,tohit,level,evasion,armor,initiative,itemType,rarity){
        this._ItemName = itemName; 
        this._DamageMod = damagemod;
        this._Strength = str;
        this._Health = health;
        this._Damage = dmg;
        this._ToHit = tohit;
        this._Level = level;
        this._Initiative = initiative;
        this._Evasion = evasion; 
        this._Armor = armor;
        this._ItemType = itemType;
        this._ItemRarity = rarity;
        this._IsApplied = false;
    }

    get IsApplied(){
        return this._IsApplied;
    }
    set IsApplied(value){
        this._IsApplied = value;
    }
    get ToHit(){
        return this._ToHit;
    }
    set ToHit(value){
        this._ToHit = value;
    }
    get Health(){
        return this._Health;
    }
    set Health(value){
        this._Health = value;
    }
    get Strength(){
        return this._Strength;
    }
    set Strength(value){
        this._Strength = value;
    }
    get ItemRarity(){
        return this._ItemRarity;
    }
    set ItemRarity(value){
        this._ItemRarity = value;
    }
    get ItemType(){
        return this._ItemType;
    }
    set ItemType(value){
        this._ItemType = value;
    }
    get ItemName(){
        return this._ItemName;
    }
    set ItemName(value){
        this._ItemName = value;
    }
    get DamageMod(){
        return this._DamageMod;
    }
    set DamageMod(value){
        this._DamageMod = value;
    }
    get Owner(){
        return this._Owner;
    }
    set Owner(value){
        this._Owner = value;
    }
    get Armor(){
        return this._Armor;
    }
    set Armor(value){
        this._Armor = value;
    }
    get Evasion(){
        return this._Evasion;
    }
    set Evasion(value){
        this._Evasion = value;
    }
    get Initiative(){
        return this._Initiative;
    }
    set Initiative(value){
        this._Initiative = value;
    }
}
//#endregion


