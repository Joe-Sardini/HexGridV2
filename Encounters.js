
//#region Encounters
class Encounter {
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

class Rest extends Encounter{
    constructor(location,items,description){
        super(location,items,description);    
    }

    RunEncounter(){
        console.log("Your party is partially healed.");
        EncounterHistoryElement.innerHTML += "<BR>Your party is partially healed.";
        this.PartialPartyHealing();
        DisplayParty();
    }

    PartialPartyHealing(){
        let healingAmount = Math.ceil(Math.random() * 3)*this._DifficultyLevel;
        for (let idx = 0;idx < PlayerParty.length;idx++){
            if ((PlayerParty[idx].CurrentHealth + healingAmount) > PlayerParty[idx].Health){
                PlayerParty[idx].CurrentHealth = PlayerParty[idx].Health;
            }else{
                PlayerParty[idx].CurrentHealth += healingAmount;
            }
        }
    }
}

class GainPartyMember extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
    }
    
    RunEncounter(){
        this._EncounterLogElement.innerHTML += `<BR> ${this._Description}`;
        PlayerParty.push(CreatePlayerCharacter("New PC ".concat(PlayerParty.length-2)));
        DisplayParty();
    }
}

class Friendly extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
    }

    RunEncounter(){
        console.log("Your party is fully healed.");
        this._EncounterLogElement.innerHTML += "<BR>Your party is fully healed.";
        PlayerParty.forEach(function(player){player.RestoreHealth();});
        DisplayParty();
    }
}

class Combat extends Encounter{
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
        NPCParty = party;
        DisplayNPCParty();
        return party;
    }

    RunEncounter(){
        this._EncounterLogElement.innerHTML += `<BR> ${this.Description}`;
        // Should probably have a global combat engine so I'm not making a new one everytime
        let combatEncounter = new CombatEngine(PlayerParty,this.ConstructEnemyParty());
        let idx = 0;
        do{
            combatEncounter.RandomTargetCombat();
            if (idx > 50){ //50 rounds max
                bCombatIsOver = true;
            }
            idx++;
        }while(!bCombatIsOver);

        bCombatIsOver = false;
        DisplayNPCParty();
        DisplayParty();
    }
}

class Trap extends Encounter{
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
        console.log(`Trap Damage - ${this._TrapDamage*this._DifficultyLevel} damage to all party memebers.`);
        for (let idx = 0; idx < PlayerParty.length; idx++){
            if (PlayerParty[idx].IsAlive){
                PlayerParty[idx].CurrentHealth = (PlayerParty[idx].CurrentHealth - (this._TrapDamage * this._DifficultyLevel));
            }
        }
        DisplayParty();
    }
}

class SpotDamage extends Encounter{
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
        console.log("A few of your party members take damage...")
        this._EncounterLogElement.innerHTML += "<BR>A few of your party members take damage...";
        this.SprinkleDamage();
        DisplayParty();
    }

    SprinkleDamage(){
        let numberOfVictims = Math.ceil(Math.random() * (PlayerParty.length+1)/2)+1;
        for (let i = 0; i < numberOfVictims; i++){
            let playerIndex = Math.ceil(Math.random() * PlayerParty.length-1);
            let damageTaken = Math.ceil(Math.random() * this._SpotDamage+1)*this._DifficultyLevel;
            if (PlayerParty[playerIndex].IsAlive){
                PlayerParty[playerIndex].CurrentHealth -= damageTaken;

            }
        }
    }
}

class Treasure extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
    }

    RunEncounter(){
        this._Items.forEach(function(e){console.log(e);});
        for (let idx = 0; idx < this._Items.length; idx++){
            PlayerParty[RandomPartyMemberIndex(PlayerParty)].Inventory.push(this._Items[idx]);
        }
        ApplyPartyItems();
    }
}
//#endregion
