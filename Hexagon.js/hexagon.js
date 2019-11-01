"use strict"

//#region Enums
const EncounterTypes = {
    COMBAT: 'combat',
    TREASURE: 'treasure',
    REST: 'rest',
    FRIENDLY: 'friendly',
    INFORMATION: 'information',
    TRAP: 'trap',
    GAINPARTYMEMBER: 'gainpartymember',
    SPOTDAMAGE: 'spotdamage'
}
//#endregion 

//#region Global letiables
let c = document.getElementById("HexCanvas");
let ctx = c.getContext("2d");

let EventLogElement = document.getElementById("EventLog");
let NPCPartyElement = document.getElementById("NPCParty");
let EncounterHistoryElement = document.getElementById("EncounterHistory");
let CombatLogElement = document.getElementById('CombatLog');
let NPCInfoElement = document.getElementById("NPCInfo");
let PlayerInfoElement = document.getElementById("PlayerInfo");
let EndGameOverlayElement = document.getElementById("EndGameOverlay");

let PlayerParty = [];
let PlayerPartyItems = [];
let NPCParty = [];
let Hexes = [];

let bCombatIsOver = false;
//#endregion 

//#region Hex object
//represents a game board tile
class HexObject {
    constructor(image, PointF, index){
        //this._Image = image;
        this._IsSelected = false;
        this._PointF = PointF;
        this._IsVisible = false;
        //this._EncounterType = encType;
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
        return "#D6DBDF";
    }

    SetEncounter(){
        switch(this._EncounterType){
            case EncounterTypes.COMBAT:
                this._Encounter = new Combat(PointF,"","Combat Encounter!");
                break;
            case EncounterTypes.FRIENDLY:
                this._Encounter = new Friendly(PointF,"","Party heal");
                break;
            case EncounterTypes.INFORMATION:
                this._Encounter = new Encounter(PointF,"","Info not done");
                break;
            case EncounterTypes.TREASURE:
                this._Encounter = new Treasure(PointF,"","Treasure Not complete");
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
            default:
                this._Encounter = new Encounter(PointF,"","Default Encounter.");
        }
        this._Encounter.DifficultyLevel = this._DifficultyLevel;
    }
}
//#endregion

//#region Grid Cords
class PointF {
    constructor(x,y){
        this._Row = x;
        this._Col = y;
    }

    get Points(){
        return { row: this._Row, column: this._Col}
    }
    get Row(){
        return this._Row;
    }
    set Row(value){
        this._Row = value;
    }
    get Col(){
        return this._Col;
    }
    set Col(value) {
        this._Col = value;
    }
}
//#endregion

//#region Characters
class Character {
    constructor(str,health,dmg,tohit,level,name,index,evasion,armor){
        this._Strength = str;
        this._Health = health;
        this._Damage = dmg;
        this._ToHit = tohit;
        this._Level = level;
        this._CurrentHealth = health;
        this._Name = name;
        this._IsAlive = true;
        this._Initiative = Math.ceil(Math.random() * 20);
        this._Index = index;
        this._Evasion = evasion; 
        this._Armor = armor;
    }

    //#region Properties
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
            let ele = EventLogElement;
            ele.innerHTML += (`<br><span class='Damage'> ${this._Name} has died.</span>`);
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
}

class Player extends Character{
    constructor(str,health,dmg,tohit,level,exppoints,name,index,evasion,armor){
        super(str,health,dmg,tohit,level,name,index,evasion,armor);
        this._ExperiencePoints = exppoints;
    }
    get ExperiencePoints(){
        return this._ExperiencePoints;
    }
    set ExperiencePoints(value){
        return this._ExperiencePoints = value;
    }
}

class NPC extends Character{
    constructor(str,health,dmg,tohit,level,expvalue,name,index,evasion,armor){
        super(str,health,dmg,tohit,level,name,index,evasion,armor);
        this._ExperienceValue = expvalue;
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
        PlayerParty.forEach(function(element){element.RestoreHealth();});
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
            name = `NPC ${index}`;
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
        this._SpotDamage = 5;
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
        //TODO
    }
}
//#endregion

//#region CombatEngine
class CombatEngine{
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
        let max = 24;
        let min = 10;
        let P1Roll = Math.floor(Math.random() * (max - min + 1)) + min;
        P1Roll = P1Roll-player2.Evasion;
        this._CombatLogElement.innerHTML += `<BR>${player1.Name} makes an attack and `;
        if (P1Roll > player1.ToHit){ //Hit scored
            damage = (player1.Damage*2) - player2.Armor;
            if (damage > 0) {
                this._CombatLogElement.innerHTML += `hits ${player2.Name} for ${damage} damage!`;
                if (isPC){
                    this._EnemyParty[player2.Index].CurrentHealth -= damage;
                }else{
                    this._PlayerParty[player2.Index].CurrentHealth -= damage;    
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
                bCombatIsOver = true;
                EventLogElement.innerHTML += `<BR> Enemy party destroyed!`;
                break;
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
        let rnd = Math.ceil(Math.random() * Party.length-1);
        if (!Party[rnd].IsAlive){
            this.SelectTarget(Party);
        }
        return Party[rnd];
    }
}
//#endregion

//#region Items
class Item {
    constructor(itemName,damagemod){
        this._ItemName = itemName; 
        this._DamageMod = damagemod;
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
}
//#endregion

//#region Global Functions
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

//#region HexagonGrid
function HexagonGrid(canvasId, radius) {
    this.radius = radius;

    this.height = Math.sqrt(3) * radius;
    this.width = 2 * radius;
    this.side = (3 / 2) * radius;

    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.canvasOriginX = 0;
    this.canvasOriginY = 0;
    
    this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);
}

HexagonGrid.prototype.drawHexGrid = function (rows, cols, originX, originY, isDebug) {
    this.canvasOriginX = originX;
    this.canvasOriginY = originY;
    this.hexCount = rows*cols;
    this._rows = rows;
    this._cols = cols;

    let currentHexX;
    let currentHexY;
    let debugText = "";

    let offsetColumn = false;

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {

            if (!offsetColumn) {
                currentHexX = (col * this.side) + originX;
                currentHexY = (row * this.height) + originY;
            } else {
                currentHexX = col * this.side + originX;
                currentHexY = (row * this.height) + originY + (this.height * 0.5);
            }

            if (isDebug) {
                debugText = row + "," + col;
            }
            
            if (Hexes.length < this.hexCount+1){ //Add all hexes to the hex list
                Hexes.push(new HexObject("",new PointF(row,col),Hexes.length));
            }

            this.drawHex(currentHexX, currentHexY, "#ddd", debugText);
        }
        offsetColumn = !offsetColumn;
    }
}

HexagonGrid.prototype.drawHexAtColRow = function(column, row, color, image, debugText, hexText) {
    let drawy = column % 2 == 0 ? (row * this.height) + this.canvasOriginY : (row * this.height) + this.canvasOriginY + (this.height / 2);
    let drawx = (column * this.side) + this.canvasOriginX;
    this.drawHex(drawx, drawy, color, debugText, image, hexText);
}

HexagonGrid.prototype.drawHex = function(x0, y0, fillColor, debugText,image, hexText) {
    this.context.strokeStyle = "#000";
    this.context.beginPath();
    this.context.moveTo(x0 + this.width - this.side, y0);
    this.context.lineTo(x0 + this.side, y0);
    this.context.lineTo(x0 + this.width, y0 + (this.height / 2));
    this.context.lineTo(x0 + this.side, y0 + this.height);
    this.context.lineTo(x0 + this.width - this.side, y0 + this.height);
    this.context.lineTo(x0, y0 + (this.height / 2));

    if (fillColor) {
        this.context.fillStyle = fillColor;
        this.context.fill();
    }

    this.context.closePath();
    this.context.stroke();

    if (image){
        this.context.drawImage(image,x0 + (this.width / 2) - (this.width/4),y0 + this.height-30,20,20);
    }

    if (debugText) {
        this.context.font = "8px";
        this.context.fillStyle = "#000";
        this.context.fillText(debugText, x0 + (this.width / 2) - (this.width/4), y0 + (this.height - 5));
    }

    if (hexText) {
        this.context.font = "10px";
        this.context.fillStyle = "#000";
        this.context.fillText(hexText, x0 + (this.width / 2) - (this.width/4) + 10, y0 + (this.height - 14));
    }

    this.context.globalAlpha = 0.4;
}

//Recusivly step up to the body to calculate canvas offset.
HexagonGrid.prototype.getRelativeCanvasOffset = function() {
	let x = 0, y = 0;
	let layoutElement = this.canvas;
    if (layoutElement.offsetParent) {
        do {
            x += layoutElement.offsetLeft;
            y += layoutElement.offsetTop;
        } while (layoutElement = layoutElement.offsetParent);
        
        return { x: x, y: y };
    }
}

//Uses a grid overlay algorithm to determine hexagon location
//Left edge of grid has a test to acuratly determin correct hex
HexagonGrid.prototype.getSelectedTile = function(mouseX, mouseY) {

	let offSet = this.getRelativeCanvasOffset();

    mouseX -= offSet.x;
    mouseY -= offSet.y;

    let column = Math.floor((mouseX) / this.side);
    let row = Math.floor(
        column % 2 == 0
            ? Math.floor((mouseY) / this.height)
            : Math.floor(((mouseY + (this.height * 0.5)) / this.height)) - 1);


    //Test if on left side of frame            
    if (mouseX > (column * this.side) && mouseX < (column * this.side) + this.width - this.side) {


        //Now test which of the two triangles we are in 
        //Top left triangle points
        let p1 = new Object();
        p1.x = column * this.side;
        p1.y = column % 2 == 0
            ? row * this.height
            : (row * this.height) + (this.height / 2);

        let p2 = new Object();
        p2.x = p1.x;
        p2.y = p1.y + (this.height / 2);

        let p3 = new Object();
        p3.x = p1.x + this.width - this.side;
        p3.y = p1.y;

        let mousePoint = new Object();
        mousePoint.x = mouseX;
        mousePoint.y = mouseY;

        if (this.isPointInTriangle(mousePoint, p1, p2, p3)) {
            column--;

            if (column % 2 != 0) {
                row--;
            }
        }

        //Bottom left triangle points
        let p4 = new Object();
        p4 = p2;

        let p5 = new Object();
        p5.x = p4.x;
        p5.y = p4.y + (this.height / 2);

        let p6 = new Object();
        p6.x = p5.x + (this.width - this.side);
        p6.y = p5.y;

        if (this.isPointInTriangle(mousePoint, p4, p5, p6)) {
            column--;

            if (column % 2 == 0) {
                row++;
            }
        }
    }

    return  { row: row, column: column };
}

HexagonGrid.prototype.sign = function(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

//TODO: Replace with optimized barycentric coordinate method
HexagonGrid.prototype.isPointInTriangle = function isPointInTriangle(pt, v1, v2, v3) {
    let b1, b2, b3;

    b1 = this.sign(pt, v1, v2) < 0.0;
    b2 = this.sign(pt, v2, v3) < 0.0;
    b3 = this.sign(pt, v3, v1) < 0.0;

    return ((b1 == b2) && (b2 == b3));
}

HexagonGrid.prototype.clickEvent = function(e) {
    let mouseX = e.pageX;
    let mouseY = e.pageY;

    let localX = mouseX - this.canvasOriginX;
    let localY = mouseY - this.canvasOriginY;

    let HexIndex = this.GetUnitIndexAtSelection(localX,localY);
    let HexContents = Hexes[HexIndex];

    if (HexContents != undefined){
        if (!HexContents.IsEncounterComplete) {
            EventLogElement.innerHTML += (`<br><span class='Damage'> ${HexContents.Encounter.Description} </span>`);
            HexContents.Encounter.RunEncounter();
            Hexes[HexIndex].IsEncounterComplete = true;
            this.drawHexAtColRow(HexContents.PointF.Col,HexContents.PointF.Row,"#FF0000","","Done!");
            this.RevealSurroundingHexes(HexIndex);
        }
    }
}

HexagonGrid.prototype.RevealSurroundingHexes = function(HexIndex){
    let surroudingHexGridCords = [];
    surroudingHexGridCords = this.CalculateSurroundingHexes(Hexes[HexIndex].PointF.Row,Hexes[HexIndex].PointF.Col);
    for (let idx = 0;idx < surroudingHexGridCords.length; idx++){
        let Hex = this.getHexAtCords(surroudingHexGridCords[idx].Row,surroudingHexGridCords[idx].Col);
        if (!Hex.IsEncounterComplete){
            this.drawHexAtColRow(surroudingHexGridCords[idx].Col,surroudingHexGridCords[idx].Row,Hex.DifficultyLevelColour,"","",Hex.DifficultyLevel);
        }
    }
}

HexagonGrid.prototype.IsValidHex = function(cordX,cordY){
    if (cordX > -1 && cordX < this._rows && cordY > -1 && cordY < this._cols){
        return true;
    }else{
        return false;
    }
}

//TODO make an algo to replace this.
HexagonGrid.prototype.CalculateSurroundingHexes = function(cordX,cordY){
    let sHexes = [];
    
    for (let idx = 1;idx < 7;idx++){
        switch(idx){
            case 1:
                if (cordY % 2 != 0){
                    if (this.IsValidHex(cordX,cordY-1)){
                        sHexes.push(new PointF(cordX,cordY-1));
                    }
                }else{
                    if (this.IsValidHex(cordX-1,cordY-1)){
                        sHexes.push(new PointF(cordX-1,cordY-1));
                    }
                }
            case 2:
                if (this.IsValidHex(cordX-1,cordY)){
                    sHexes.push(new PointF(cordX-1,cordY));
                }
            case 3:
                if (cordY % 2 != 0){
                    if (this.IsValidHex(cordX,cordY+1)){
                        sHexes.push(new PointF(cordX,cordY+1));
                    }
                }else{
                    if (this.IsValidHex(cordX-1,cordY+1)){
                        sHexes.push(new PointF(cordX-1,cordY+1));
                    }
                }
            case 4:
                if (cordY % 2 != 0){
                    if (this.IsValidHex(cordX+1,cordY+1)){
                        sHexes.push(new PointF(cordX+1,cordY+1));
                    }
                }else{
                    if (this.IsValidHex(cordX,cordY+1)){
                        sHexes.push(new PointF(cordX,cordY+1));
                    }
                }
            case 5:
                if (this.IsValidHex(cordX+1,cordY)){
                    sHexes.push(new PointF(cordX+1,cordY));
                }
            case 6:
                if (cordY % 2 != 0){
                    if (this.IsValidHex(cordX+1,cordY-1)){
                        sHexes.push(new PointF(cordX+1,cordY-1));
                    }
                }else{
                    if (this.IsValidHex(cordX,cordY-1)){
                        sHexes.push(new PointF(cordX,cordY-1));
                    }
                }
            default:
                break;
        }
    }
    return sHexes;
}

HexagonGrid.prototype.getHexAtCords = function(cordX,cordY) {
    let tile = new PointF(cordX,cordY);
    for (let index = 0; index < Hexes.length;index++){
        if (_.isEqual(tile.Points,Hexes[index].PointF.Points)){
            return Hexes[index];
        }
    }
    return undefined;
}

HexagonGrid.prototype.GetUnitIndexAtSelection = function(mouseX, mouseY){
    let tile = this.getSelectedTile(mouseX, mouseY);
    for (let index = 0; index < Hexes.length;index++){
        if (_.isEqual(tile,Hexes[index].PointF.Points)){
            return index;
        }
    }
    return -1;
}

HexagonGrid.prototype.DetermineEncounter = function(mouseX, mouseY){
    let tile = this.getSelectedTile(mouseX, mouseY);
    return tile;
}
//#endregion

//#region Unsorted functions 
function InitializeGameData(){
    for (let index = 0; index < Hexes.length;index++){
        Hexes[index].EncounterType = EncounterTypes.COMBAT;// RandomEncounter();
    }
    PlayerParty.push(new Player(10,20,5,10,1,0,"Sargoth",PlayerParty.length,7,5));
    PlayerParty.push(new Player(8,20,5,10,1,0,"Torvak",PlayerParty.length,5,3));
    PlayerParty.push(CreatePlayerCharacter("Ralaa"));
    DisplayParty();
}

function RandomEncounter(){
    let rnd = Math.ceil(Math.random() * 8);
    switch(rnd){
        case 1:
            return EncounterTypes.COMBAT;
            break;
        case 2:
            return EncounterTypes.FRIENDLY;
            break;
        case 3:
            return EncounterTypes.INFORMATION;
            break;
        case 4:
            return EncounterTypes.REST;
            break;
        case 5:
            return EncounterTypes.TREASURE;
            break;
        case 6:
            return EncounterTypes.TRAP;
            break;
        case 7:
            return EncounterTypes.GAINPARTYMEMBER;
            break;
        case 8:
            return EncounterTypes.SPOTDAMAGE;
            break;
        default:
            return EncounterTypes.REST;
    }
}

function CreateNPC(name,difficultyLevel,index){
    let max = 10;
    let min = 2;
    let strength = Math.floor(Math.random() * (max - min + 1)) + min;
    strength *= difficultyLevel;
    //health
    max = 22;
    min = 10;
    let health = Math.floor(Math.random() * (max - min + 1)) + min;
    health *= difficultyLevel;
    //dmg
    max = 7;
    min = 2;
    let damage = Math.floor(Math.random() * (max - min + 1)) + min;
    damage *= difficultyLevel;

    //tohit
    max = 8;
    min = 4;
    let tohit = Math.floor(Math.random() * (max - min + 1)) + min;
    tohit *= difficultyLevel;

    //Evasion
    max = 8;
    min = 2;
    let evasion = Math.floor(Math.random() * (max - min + 1)) + min;
    evasion *= difficultyLevel;

    //Armor
    max = 6;
    min = 1;
    let armor = Math.floor(Math.random() * (max - min + 1)) + min;
    armor *= difficultyLevel;

    return new NPC(strength,health,damage,tohit,difficultyLevel,100*difficultyLevel,name,index,evasion,armor);
}

function CreatePlayerCharacter(name){
    //strength
    let max = 16;
    let min = 4;
    let strength = Math.floor(Math.random() * (max - min + 1)) + min;
   
    //health
    max = 31;
    min = 14;
    let health = Math.floor(Math.random() * (max - min + 1)) + min;

    //dmg
    max = 7;
    min = 2;
    let damage = Math.floor(Math.random() * (max - min + 1)) + min;

    //tohit
    max = 16;
    min = 9;
    let tohit = Math.floor(Math.random() * (max - min + 1)) + min;

    //Evasion
    max = 8;
    min = 2;
    let evasion = Math.floor(Math.random() * (max - min + 1)) + min;

    //Armor
    max = 3;
    min = 1;
    let armor = Math.floor(Math.random() * (max - min + 1)) + min;

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
        NPCInfoElement.innerHTML += `<tr><TD><div class='NPCDisplay' id='NPCSlot${i}' style='border:2px solid black; width:150px'> 
            Name: ${NPCParty[i].Name} 
            <BR/>Init: ${NPCParty[i].Initiative}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dmg: ${NPCParty[i].Damage} 
            <BR/>ToHit: ${NPCParty[i].ToHit}&nbsp;&nbsp;&nbsp;Ev: ${NPCParty[i].Evasion}
            <BR/>HP: ${HealthIndicatorFont + NPCParty[i].CurrentHealth}</span>/${NPCParty[i].Health} 
            </div></TD></tr>`;
    }
    UpdateNPCDisplay();
}

function DisplayParty(){
    PlayerInfoElement.innerHTML = "<thead><tr><Th>Character Info</th></tr></thead>";
    let HealthIndicatorFont = "<span style='color:black';>";
    for (let i = 0; i < PlayerParty.length; i++){
        if (PlayerParty[i].IsAlive){
            if(PlayerParty[i].CurrentHealth < PlayerParty[i].Health){
                HealthIndicatorFont = "<span style='color:red';>";
                }else{
                    HealthIndicatorFont = "<span style='color:black';>";
            }
        }
        PlayerInfoElement.innerHTML += `<tr><TD><div class='PCDisplay' id='PCSlot${i}' style='border:2px solid black; width:150px'> 
            Name: ${PlayerParty[i].Name} 
            <BR/>Init: ${PlayerParty[i].Initiative}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dmg: ${PlayerParty[i].Damage} 
            <BR/>ToHit: ${PlayerParty[i].ToHit}&nbsp;&nbsp;&nbsp;Ev: ${PlayerParty[i].Evasion}
            <BR/>HP: ${HealthIndicatorFont + PlayerParty[i].CurrentHealth}</span>/${PlayerParty[i].Health} 
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
            document.getElementById(divID).addEventListener("click",HandlePartyDisplayClick);
        }else{
            document.getElementById(divID).addEventListener("click",HandleDeadPartyDisplayClick);
        }
    }
}

function HandlePartyDisplayClick(){
    //TODO: What do I want here...
    console.log("You clicked on a character");
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
//#endregion 

