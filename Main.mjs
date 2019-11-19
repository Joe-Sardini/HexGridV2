'use strict'



//#region helper functions 
function InitializeGameData(){
    for (let index = 0; index < Hexes.length;index++){
        Hexes[index].EncounterType = RandomEncounter();
    }
    
    PlayerParty.push(new Player(10,20,5,10,1,0,"CP1",PlayerParty.length,7,5));
    PlayerParty.push(new Player(8,20,5,10,1,0,"CP2",PlayerParty.length,5,3));
    PlayerParty.push(CreatePlayerCharacter("CP3"));
    DisplayParty();
}

function RandomEncounter(){
    let rnd = Math.ceil(Math.random() * 8);
    switch(rnd){
        case 1:
            return EncounterTypes.COMBAT;
        case 2:
            return EncounterTypes.FRIENDLY;
        case 3:
            return EncounterTypes.INFORMATION;
        case 4:
            return EncounterTypes.REST;
        case 5:
            return EncounterTypes.TREASURE;
        case 6:
            return EncounterTypes.TRAP;
        case 7:
            return EncounterTypes.GAINPARTYMEMBER;
        case 8:
            return EncounterTypes.SPOTDAMAGE;
        default:
            return EncounterTypes.REST;
    }
}

function CreateNPC(name,difficultyLevel,index){
    let strength = GenerateRandomNumberInRange(2,10);
    strength *= difficultyLevel;

    //health
    let health = GenerateRandomNumberInRange(10,22);
    health *= difficultyLevel;
    //dmg
    let damage = GenerateRandomNumberInRange(2,7);
    damage *= difficultyLevel;

    //tohit
    let tohit = GenerateRandomNumberInRange(4,8);
    tohit *= difficultyLevel;

    //Evasion
    let evasion = GenerateRandomNumberInRange(2,8);
    evasion *= difficultyLevel;

    //Armor
    let armor = GenerateRandomNumberInRange(1,6);
    armor *= difficultyLevel;

    return new NPC(strength,health,damage,tohit,difficultyLevel,100*difficultyLevel,name,index,evasion,armor);
}

function CreatePlayerCharacter(name){
    //strength
    let strength = GenerateRandomNumberInRange(4,16);
   
    //health
    let health = GenerateRandomNumberInRange(14,31);

    //dmg
    let damage = GenerateRandomNumberInRange(2,7);

    //tohit
    let tohit = GenerateRandomNumberInRange(6,12);

    //Evasion
    let evasion = GenerateRandomNumberInRange(2,8);

    //Armor
    let armor = GenerateRandomNumberInRange(1,3);

    return new Player(strength,health,damage,tohit,1,0,name,PlayerParty.length,PlayerParty.length,evasion,armor);
}

function DisplayNPCParty(){
    NPCInfoElement.innerHTML = "<thead><tr><Th class='InfoTableHeaders'>NPC Info</th></tr></thead>";
    let HealthIndicatorFont = "<span style='color:black';>";
    for (let i = 0; i < NPCParty.length; i++){
        if (NPCParty[i].IsAlive){
            if(NPCParty[i].CurrentHealth < NPCParty[i].Health){
                HealthIndicatorFont = "<span style='color:red';>";
                }else{
                    HealthIndicatorFont = "<span style='color:black';>";
            }
        }
        NPCInfoElement.innerHTML += `<tr><TD><div class='NPCDisplay' id='NPCSlot${i}' style='border:2px solid black; width:450px'> 
            Name: ${NPCParty[i].Name} 
            <BR/>Init: ${NPCParty[i].Initiative}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dmg: ${NPCParty[i].Damage} 
            <BR/>ToHit: ${NPCParty[i].ToHit}&nbsp;&nbsp;&nbsp;Ev: ${NPCParty[i].Evasion}
            <BR/>HP: ${HealthIndicatorFont + NPCParty[i].CurrentHealth}</span>/${NPCParty[i].Health} 
            </div></TD></tr>`;
    }
    UpdateNPCDisplay();
}

function DetermineStatColor(newValue,oldValue){
    if (newValue < oldValue){
        return "<span style='color:red';>";
    }
    if (newValue > oldValue){
        return "<span style='color:#49fb35';>";
    }
    return "<span style='color:black';>";
}

function DisplayParty(){
    PlayerInfoElement.innerHTML = "<thead><tr><Th>Character Info</th></tr></thead>";
    for (let i = 0; i < PlayerParty.length; i++){
        PlayerInfoElement.innerHTML += `<tr><TD><div class='PCDisplay' id='PCSlot${i}' style='border:2px solid black; width:150px'> 
        Name: ${PlayerParty[i].Name} 
        <BR/>Init: ${DetermineStatColor(PlayerParty[i].Initiative,PlayerParty[i].BaseInitiative) + PlayerParty[i].Initiative}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dmg: ${DetermineStatColor(PlayerParty[i].Damage,PlayerParty[i].BaseDamage) + PlayerParty[i].Damage}</span> 
        <BR/>ToHit: ${DetermineStatColor(PlayerParty[i].ToHit,PlayerParty[i].BaseToHit) + PlayerParty[i].ToHit}</span>&nbsp;&nbsp;&nbsp;Ev: ${DetermineStatColor(PlayerParty[i].Evasion,PlayerParty[i].BaseEvasion) + PlayerParty[i].Evasion}</span>
        <BR/>HP: ${DetermineStatColor(PlayerParty[i].CurrentHealth,PlayerParty[i].Health) + PlayerParty[i].CurrentHealth}</span>/${PlayerParty[i].Health} 
        </div></TD></tr>`;
    }
    UpdateDisplay();
}

function UpdateNPCDisplay(){
    for (let i = 0; i < NPCParty.length; i++){
        if (!NPCParty[i].IsAlive){
            let divID = `NPCSlot${i}`;
            document.getElementById(divID).style.backgroundColor = "grey";
        }
    }
    if (window.CheckIfNPCPartyIsAllDead()){
        //Do something!
    }
}

function UpdateDisplay(){
    for (let i = 0; i < PlayerParty.length; i++){
        if (!PlayerParty[i].IsAlive){
            let divID = `PCSlot${i}`;
            document.getElementById(divID).style.backgroundColor = "grey";
        }
    }
    if (window.CheckIfPartyIsAllDead()){
        console.log("The party is all dead, game over!");
        EndGameOverlayElement.innerText = "The party is all dead, game over!";
        EndGameOverlayElement.style.display = "block";
    }
    ConfigurePartyDisplay();
}

function ConfigurePartyDisplay(){
    for (let i = 0; i < PlayerParty.length; i++){
        let divID = `PCSlot${i}`;
        if (PlayerParty[i].IsAlive){
            document.getElementById(divID).addEventListener("click",function(){HandlePartyDisplayClick(i);},false);
        }else{
            document.getElementById(divID).addEventListener("click",HandleDeadPartyDisplayClick);
        }
    }
}

function HandlePartyDisplayClick(partyMemberIndex){
    modal.style.display = "block";
    let invenTableHTML = "<table class='steelBlueCols'><thead><tr><th colspan=4>Inventory</th></tr></thead><tbody><tr>";
    
    for (let idx = 0; idx < PlayerParty[partyMemberIndex].Inventory.length; idx++){
        if (idx == 4 || idx == 8 || idx == 12){
            invenTableHTML += "<tr>";
        }
        let tooltipdata = PlayerParty[partyMemberIndex].Inventory[idx].ItemName + "\n" + StringOfEnum(ItemTypes,PlayerParty[partyMemberIndex].Inventory[idx].ItemType) + "\n" + StringOfEnum(Rarity,PlayerParty[partyMemberIndex].Inventory[idx].ItemRarity);
        invenTableHTML += "<td><a class='test' href='#' data-toggle='tooltip' data-html=true data-placement='bottom' title='" + tooltipdata + "'>" + PlayerParty[partyMemberIndex].Inventory[idx].ItemName + "</a></td>"
        if (idx == 4 || idx == 8 || idx == 12){
            invenTableHTML += "</tr>";
        }

    }
    invenTableHTML += "</tr></table>";

    inventoryListElement.innerHTML = invenTableHTML;
}

function HandleDeadPartyDisplayClick(){
    //TODO 
    console.log("This character is dead.");
}

function CompareInitiative(a,b){
    if (a.Initiative < b.Initiative){
        return -1;
    }
    if (a.Initiative > b.Initiative){
        return 1;
    }
    return 0;
}

function GenerateRandomNumberInRange(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function CreatNPCName(seed){
    let generator = NameGen.compile(seed);
    return generator.toString();
}

function RandomPartyMemberIndex(Party){
    let rnd = Math.ceil(Math.random() * Party.length-1);
    if (!Party[rnd].IsAlive){
        SelectTarget(Party);
    }
    return rnd;
}

function SelectTarget(Party){
    let rnd = Math.ceil(Math.random() * Party.length-1);
    if (!Party[rnd].IsAlive){
        SelectTarget(Party);
    }
    return Party[rnd];
}

function ApplyPartyItems(){
    PlayerParty.forEach(function(e){e.ApplyItems();});
    DisplayParty();
}

function StringOfEnum(enumObj,value){
    for (let k in enumObj) if (enumObj[k] == value) return k;
    return null;
}

span.onclick = function(){
    modal.style.display = "none";
}

window.onclick = function(event){
    if (event.target == modal) {
      modal.style.display = "none";
    }
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

window.CheckIfPartyIsAllDead = function(){
    for(let idx = 0; idx < PlayerParty.length;idx++){
        if (PlayerParty[idx].IsAlive){
            return false;
        }
    }
    return true;
}

window.CheckIfNPCPartyIsAllDead = function(){
    for(let idx = 0; idx < NPCParty.length;idx++){
        if (NPCParty[idx].IsAlive){
            return false;
        }
    }
    return true;
}

//#endregion 

