'use strict'

import { EncounterTypes, RarityModifiers, ItemTypes, Rarity } from './Enums.mjs';
import { GenerateRandomNumberInRange } from './Utilities.mjs';
import { Item } from './Item.mjs?v=1';


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
            case EncounterTypes.GAIN_PARTY_MEMBER:
                break;
            case EncounterTypes.SPOT_DAMAGE:
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
        const numberOfItems = 2 * this._DifficultyLevel;
        const modifier = RarityModifiers.TREASURE + this._DifficultyLevel;
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
                case ItemTypes.JEWELRY:
                    this._ItemList.push(this.CreateJewelryItem(this.DetermineRarity(modifier)));                                            
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
            return Rarity.ULTRA_RARE;
        }else if(rnd > 95 && rnd < 100){
            return Rarity.LEGENDARY;
        }else if(rnd > 99){
            return Rarity.UNIQUE;
        }
        return Rarity.COMMON;
    }

    DetermineType(){
        const rnd = Math.ceil(Math.random() * 10);
        if (rnd < 4){
            return ItemTypes.ARMOR;
        }else if (rnd > 3 && rnd < 7) {
            return ItemTypes.WEAPON;
        }else if (rnd > 6 && rnd < 9) {
            return ItemTypes.JEWELRY;
        }else if (rnd > 9) {
            return ItemTypes.MAGIC;
        }
        return ItemTypes.ARMOR;
    }

    CreateItemName(){
        const generator = window.NameGen.compile("!BsV!i");
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
            case Rarity.ULTRA_RARE:
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
        const rarity = this.RarityLevel(itemRarity);
        const itemName = this.CreateItemName(); 
        const damageMod = 0;
        const str = GenerateRandomNumberInRange(1+rarity,3+rarity);
        const health = GenerateRandomNumberInRange(2+rarity,4+rarity);
        const dmg = 0;
        const toHit = GenerateRandomNumberInRange(-4+rarity,4+rarity);
        const level = this._DifficultyLevel;
        const initiative = GenerateRandomNumberInRange(-4+rarity,4+rarity);
        const evasion = GenerateRandomNumberInRange(-4+rarity,4+rarity);
        const armor = GenerateRandomNumberInRange(2+rarity,6+rarity);
        const itemType = ItemTypes.ARMOR;

        return new Item(itemName,damageMod,str,health,dmg,toHit,level,evasion,armor,initiative,itemType,itemRarity);
    }

    CreateWeaponItem(itemRarity){
        const rarity = this.RarityLevel(itemRarity);
        const itemName = this.CreateItemName(); 
        const damageMod = GenerateRandomNumberInRange(2+rarity,6+rarity);
        const str = GenerateRandomNumberInRange(1+rarity,2+rarity);
        const health = 0;
        const dmg = GenerateRandomNumberInRange(2+rarity,4+rarity);
        const toHit = GenerateRandomNumberInRange(1+rarity,3+rarity);
        const level = this._DifficultyLevel;
        const initiative = GenerateRandomNumberInRange(1+rarity,3+rarity);
        const evasion = 0;
        const armor = 0;
        const itemType = ItemTypes.WEAPON;

        return new Item(itemName,damageMod,str,health,dmg,toHit,level,evasion,armor,initiative,itemType,rarity);
    }

    CreateJewelryItem(itemRarity){
        const rarity = this.RarityLevel(itemRarity);
        const itemName = this.CreateItemName(); 
        const damageMod = GenerateRandomNumberInRange(0+rarity,1+rarity);
        const str = GenerateRandomNumberInRange(2+rarity,4+rarity);
        const health = GenerateRandomNumberInRange(10+rarity,20+rarity);
        const dmg = GenerateRandomNumberInRange(1+rarity,3+rarity);
        const toHit = GenerateRandomNumberInRange(1+rarity,5+rarity);
        const level = this._DifficultyLevel;
        const initiative = GenerateRandomNumberInRange(5+rarity,10+rarity);
        const evasion = GenerateRandomNumberInRange(5+rarity,10+rarity);
        const armor = GenerateRandomNumberInRange(0+rarity,1+rarity);
        const itemType = ItemTypes.JEWELRY;

        return new Item(itemName,damageMod,str,health,dmg,toHit,level,evasion,armor,initiative,itemType,rarity);
    }

    CreateMagicItem(itemRarity){
        const rarity = this.RarityLevel(itemRarity);
        const itemName = this.CreateItemName(); 
        const damageMod = GenerateRandomNumberInRange(2+rarity,2*rarity);
        const str = GenerateRandomNumberInRange(2+rarity,4*rarity);
        const health = GenerateRandomNumberInRange(2+rarity,20*rarity);
        const dmg = GenerateRandomNumberInRange(2+rarity,3*rarity);
        const toHit = GenerateRandomNumberInRange(2+rarity,5*rarity);
        const level = this._DifficultyLevel;
        const initiative = GenerateRandomNumberInRange(2+rarity,10*rarity);
        const evasion = GenerateRandomNumberInRange(2+rarity,10*rarity);
        const armor = GenerateRandomNumberInRange(2+rarity,5*rarity);
        const itemType = ItemTypes.MAGIC;

        return new Item(itemName,damageMod,str,health,dmg,toHit,level,evasion,armor,initiative,itemType,rarity);
    }

    CreateItem(itemRarity){
        return this.CreateArmorItem(itemRarity);
    }
}
//#endregion 