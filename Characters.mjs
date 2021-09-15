'use strict'

import { EventLogElement, NPCPartyElement } from './Elements.mjs';
import { LevelBreakdown } from './Data.mjs';

//#region Characters
export class Character {
    constructor(str,health,dmg,toHit,level,name,index,evasion,armor){
        this._Strength = str;
        this._BaseStrength = str;
        this._Health = health;
        this._BaseHealth = health;
        this._Damage = dmg;
        this._BaseDamage = dmg;
        this._ToHit = toHit;
        this._BaseToHit = toHit;
        this._Level = level;
        this._CurrentHealth = health;
        this._Name = name;
        this._IsAlive = true;
        this._Initiative = Math.ceil(Math.random() * 20);
        this._BaseInitiative = this._Initiative
        this._Index = index;
        this._Evasion = evasion; 
        this._BaseEvasion = evasion; 
        this._Armor = armor;
        this._BaseArmor = armor;
        this._Inventory = [];
    }

    //#region Properties
    get BaseHealth(){
        return this._BaseHealth;
    }
    get BaseInitiative(){
        return this._BaseInitiative;
    }
    get BaseEvasion(){
        return this._BaseEvasion;
    }
    get BaseToHit(){
        return this._BaseToHit;
    }
    get BaseDamage(){
        return this._BaseDamage;
    }
    get Inventory(){
        return this._Inventory;
    }
    set Inventory(value){
        this._Inventory = value;
    }
    get Index(){
        return this._Index;
    }
    set Index(value){
        this._Index = value;
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
    get IsAlive(){
        return this._IsAlive;
    }
    set IsAlive(value){
        this._IsAlive = value;
    }
    get Name(){
        return this._Name;
    }
    set Name(value){
        this._Name = value;
    }
    get CurrentHealth(){
        return this._CurrentHealth;
    }
    set CurrentHealth(value){
        this._CurrentHealth = value;
        if (this._CurrentHealth < 1 && this._IsAlive){
            this._IsAlive = false;
            EventLogElement.innerHTML += (`<br><span class='Damage'> ${this._Name} has died.</span>`);
        }
    }
    get Strength(){
        return this._Strength;
    }
    set Strength(value){
        this._Strength = value;
    }
    get Health(){
        return this._Health;
    }
    set Health(value){
        this._Health = value;
    }
    get Damage(){
        return this._Damage;
    }
    set Damage(value){
        return this._Damage = value;
    }
    get ToHit(){
        return this._ToHit;
    }
    set ToHit(value){
        return this._ToHit = value;
    }
    get Level(){
        return this._Level;
    }
    set Level(value){
        return this._Level = value;
    }
    //#endregion 

    RestoreHealth(Amount){
        if (this._IsAlive){
            if (Amount != undefined){
                this._CurrentHealth += Amount;
            }else{
                this._CurrentHealth = this._Health;
            }
        }
    }

    ApplyItems(){
        for (let idx = 0; idx < this._Inventory.length; idx++){
            if (!this._Inventory[idx].IsApplied){
                this._Strength += this._Inventory[idx].Strength;
                this._Health += this._Inventory[idx].Health;
                this._Damage += this._Inventory[idx].DamageMod;
                this._ToHit += this._Inventory[idx].ToHit;
                this._Initiative += this._Inventory[idx].Initiative;
                this._Evasion += this._Inventory[idx].Evasion;
                this._Armor += this._Inventory[idx].Armor;
                this._Inventory[idx].IsApplied = true;
            }
        }
    }

    RemoveItem(item){
        const sItem = (Item) => Item.ItemName === item.ItemName;
        const itemIndex = this._Inventory.findIndex(sItem); 

        if (itemIndex > -1) {
            this._Inventory.splice(itemIndex,1);
            
            this._Strength -= item.Strength;
            this._Health -= item.Health;
            this._Damage -= item.DamageMod;
            this._ToHit -= item.ToHit;
            this._Initiative -= item.Initiative;
            this._Evasion -= item.Evasion;
            this._Armor -= item.Armor;
        }
    }

    AddItem(item){
        this._Inventory.push(item);
        this.ApplyItems();
    }
}

export class Player extends Character{
    constructor(str,health,dmg,toHit,level,expPoints,name,index,evasion,armor){
        super(str,health,dmg,toHit,level,name,index,evasion,armor);
        this._ExperiencePoints = expPoints;
    }
    get ExperiencePoints(){
        return this._ExperiencePoints;
    }
    set ExperiencePoints(value = 0){
        this._ExperiencePoints = value;
        this.ApplyExperience();
    }
    ApplyExperience(Amount = 0){
        this._ExperiencePoints += Amount; 
        this.CheckLevel();
    }

    LevelUp(level){
        this._Strength += level;
        this._Health += level;
        this._Damage += level;
        this._ToHit += level;
        this._Initiative += level;
        this._Evasion += level;
        this._Armor += level;
    }

    CheckLevel(){
        const expNextLevel = LevelBreakdown[this._Level-1][1];
        if (this._ExperiencePoints > expNextLevel){
            this._Level++;
            this.LevelUp(this._Level);
            this.CheckLevel();
        }
    }
}

export class NPC extends Character{
    constructor(str,health,dmg,toHit,level,expValue,name,index,evasion,armor){
        super(str,health,dmg,toHit,level,name,index,evasion,armor);
        this._ExperienceValue = expValue;
        NPCPartyElement.innerHTML += `<BR> Name:${name} | HP:${health}`;
    }
    get ExperienceValue(){
        return this._ExperienceValue;
    }
    set ExperienceValue(value){
        return this._ExperienceValue = value;
    }
}
//#endregion
