'use strict'

import { EncounterTypes, RarityModifiers, ItemTypes, Rarity } from './Encounters.mjs';

//#region Item Manager
export class ItemManager {
    constructor(level,encounterType){
        this._DifficultyLevel = level;
        this._ItemList = [];
        switch(encounterType){
            case EncounterTypes.COMBAT:
                break;
            case EncounterTypes.FRIENDLY:
                break;
            case EncounterTypes.INFORMATION:
                break;
            case EncounterTypes.TREASURE:
                this.GenerateTreasure();
                break;
            case EncounterTypes.TRAP:
                break;
            case EncounterTypes.GAINPARTYMEMBER:
                break;
            case EncounterTypes.SPOTDAMAGE:
                break;    
            case EncounterTypes.REST:
                break;    
            default:
                break;
        }
    }

    get ItemList(){
        return this._ItemList;
    }
    set ItemList(value){
        this._ItemList = value;
    }

    GenerateTreasure(){
        let numberOfItems = 2 * this._DifficultyLevel;
        let modifier = RarityModifiers.TREASURE + this._DifficultyLevel;
        this.RandomItems(numberOfItems,modifier);
    }

    RandomItems(numberOfItems,modifier){
        for (let idx = 0; idx <= numberOfItems; idx++){
            switch(this.DetermineType()){
                case ItemTypes.ARMOR:
                    this._ItemList.push(this.CreateArmorItem(this.DetermineRarity(modifier)));
                    break;
                case ItemTypes.WEAPON:
                    this._ItemList.push(this.CreateWeaponItem(this.DetermineRarity(modifier)));
                    break;
                case ItemTypes.JEWLERY:
                    this._ItemList.push(this.CreateJewleryItem(this.DetermineRarity(modifier)));                                            
                    break;
                case ItemTypes.MAGIC:
                    this._ItemList.push(this.CreateMagicItem(this.DetermineRarity(modifier)));
                    break;
                default:
                    this._ItemList.push(this.CreateItem(this.DetermineRarity(modifier)));
                    break;
            }
        }
    }

    DetermineRarity(modifier){
        let rnd = Math.ceil(Math.random() * 100);
        rnd += modifier;
        if (rnd < 50){
            return Rarity.COMMON;
        }else if(rnd > 49 && rnd < 80){
            return Rarity.UNCOMMON;
        }else if(rnd > 79 && rnd < 90){
            return Rarity.RARE;
        }else if(rnd > 89 && rnd < 96){
            return Rarity.ULTRARARE;
        }else if(rnd > 95 && rnd < 100){
            return Rarity.LEGENDARY;
        }else if(rnd > 99){
            return Rarity.UNIQUE;
        }
        return Rarity.COMMON;
    }

    DetermineType(){
        let rnd = Math.ceil(Math.random() * 10);
        if (rnd < 4){
            return ItemTypes.ARMOR;
        }else if (rnd > 3 && rnd < 7) {
            return ItemTypes.WEAPON;
        }else if (rnd > 6 && rnd < 9) {
            return ItemTypes.JEWLERY;
        }else if (rnd > 9) {
            return ItemTypes.MAGIC;
        }
        return ItemTypes.ARMOR;
    }

    CreateItemName(){
        let generator = NameGen.compile("!BsV!i");
        return generator.toString();
    }

    RarityLevel(itemRarity){
        switch (itemRarity){
            case Rarity.COMMON:
                return 1;
            case Rarity.UNCOMMON:
                return 2;
            case Rarity.RARE:
                return 3;
            case Rarity.ULTRARARE:
                return 4;
            case Rarity.LEGENDARY:
                return 5;
            case Rarity.UNIQUE:
                return 6;
            default:
                return 1;
        }
    }

    CreateArmorItem(itemRarity){
        let rarity = this.RarityLevel(itemRarity);
        let itemName = this.CreateItemName(); 
        let damagemod = 0;
        let str = GenerateRandomNumberInRange(1+rarity,3+rarity);
        let health = GenerateRandomNumberInRange(2+rarity,4+rarity);
        let dmg = 0;
        let tohit = GenerateRandomNumberInRange(-4+rarity,4+rarity);
        let level = this._DifficultyLevel;
        let initiative = GenerateRandomNumberInRange(-4+rarity,4+rarity);
        let evasion = GenerateRandomNumberInRange(-4+rarity,4+rarity);
        let armor = GenerateRandomNumberInRange(2+rarity,6+rarity);
        let itemType = ItemTypes.ARMOR;

        return new Item(itemName,damagemod,str,health,dmg,tohit,level,evasion,armor,initiative,itemType,itemRarity);
    }

    CreateWeaponItem(itemRarity){
        let rarity = this.RarityLevel(itemRarity);
        let itemName = this.CreateItemName(); 
        let damagemod = GenerateRandomNumberInRange(2+rarity,6+rarity);;
        let str = GenerateRandomNumberInRange(1+rarity,2+rarity);
        let health = 0;
        let dmg = GenerateRandomNumberInRange(2+rarity,4+rarity);;
        let tohit = GenerateRandomNumberInRange(1+rarity,3+rarity);
        let level = this._DifficultyLevel;
        let initiative = GenerateRandomNumberInRange(1+rarity,3+rarity);
        let evasion = 0;
        let armor = 0;
        let itemType = ItemTypes.WEAPON;

        return new Item(itemName,damagemod,str,health,dmg,tohit,level,evasion,armor,initiative,itemType,rarity);
    }

    CreateJewleryItem(itemRarity){
        let rarity = this.RarityLevel(itemRarity);
        let itemName = this.CreateItemName(); 
        let damagemod = GenerateRandomNumberInRange(0+rarity,1+rarity);;
        let str = GenerateRandomNumberInRange(2+rarity,4+rarity);
        let health = GenerateRandomNumberInRange(10+rarity,20+rarity);
        let dmg = GenerateRandomNumberInRange(1+rarity,3+rarity);;
        let tohit = GenerateRandomNumberInRange(1+rarity,5+rarity);
        let level = this._DifficultyLevel;
        let initiative = GenerateRandomNumberInRange(5+rarity,10+rarity);
        let evasion = GenerateRandomNumberInRange(5+rarity,10+rarity);
        let armor = GenerateRandomNumberInRange(0+rarity,1+rarity);;
        let itemType = ItemTypes.JEWLERY;

        return new Item(itemName,damagemod,str,health,dmg,tohit,level,evasion,armor,initiative,itemType,rarity);
    }

    CreateMagicItem(itemRarity){
        let rarity = this.RarityLevel(itemRarity);
        let itemName = this.CreateItemName(); 
        let damagemod = GenerateRandomNumberInRange(2+rarity,2*rarity);;
        let str = GenerateRandomNumberInRange(2+rarity,4*rarity);
        let health = GenerateRandomNumberInRange(2+rarity,20*rarity);
        let dmg = GenerateRandomNumberInRange(2+rarity,3*rarity);;
        let tohit = GenerateRandomNumberInRange(2+rarity,5*rarity);
        let level = this._DifficultyLevel;
        let initiative = GenerateRandomNumberInRange(2+rarity,10*rarity);
        let evasion = GenerateRandomNumberInRange(2+rarity,10*rarity);
        let armor = GenerateRandomNumberInRange(2+rarity,5*rarity);;
        let itemType = ItemTypes.MAGIC;

        return new Item(itemName,damagemod,str,health,dmg,tohit,level,evasion,armor,initiative,itemType,rarity);
    }

    CreateItem(itemRarity){
        return this.CreateArmorItem(itemRarity);
    }
}
//#endregion 