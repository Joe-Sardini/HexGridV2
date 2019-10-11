//#region Enums
const ModeTypes = {
    PLACEMENT: 'placement',
    SELECTION: 'selection',
    MOVEMENT: 'movement',
    COMBAT: 'combat',
    DEFAULT: 'default',
    INSPECT: 'inspect'
}

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

//#region Object definitions

//#region Hex object
//represents a game board tile
class HexObject {
    constructor(image, PointF, encType){
        //this._Image = image;
        this._IsSelected = false;
        this._PointF = PointF;
        this._IsVisible = false;
        this._EncounterType = encType;
        this._IsEncounterComplete = false;
    }
    //#region Properties
    
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

    SetEncounter(){
        switch(this._EncounterType){
            case EncounterTypes.COMBAT:
                this._Encounter = new Combat(PointF,"","Combat Encounter, you take damage!");
                break;
            case EncounterTypes.FRIENDLY:
                this._Encounter = new Friendly(PointF,"","Hey, how ya doing?");
                break;
            case EncounterTypes.INFORMATION:
                this._Encounter = new Encounter(PointF,"","Info not done");
                break;
            case EncounterTypes.TREASURE:
                this._Encounter = new Encounter(PointF,"","Treasure Not complete");
                break;
            case EncounterTypes.TRAP:
                this._Encounter = new Trap(PointF,"","It's a trap!!");
                break;
            case EncounterTypes.GAINPARTYMEMBER:
                this._Encounter = new GainPartyMember(PointF,"","Your party expands!");
                break;
            case EncounterTypes.SPOTDAMAGE:
                this._Encounter = new SpotDamage(PointF,"","A bit oh damage.");
                break;    
            case EncounterTypes.REST:
                this._Encounter = new Encounter(PointF,"","Rest Not done");
                break;    
            default:
                console.log(this._EncounterType);
                this._Encounter = new Encounter(PointF,"","Default Encounter.");
        }
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
    constructor(str,health,dmg,tohit,level,name){
        this._Strength = str;
        this._Health = health;
        this._Damage = dmg;
        this._ToHit = tohit;
        this._Level = level;
        this._CurrentHealth = health;
        this._Name = name;
        this._IsAlive = true;
    }

    //#region Properties
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
        if (this._CurrentHealth < -1){
            this._IsAlive = false;
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
    
    RestoreHealth(){
        this._CurrentHealth = this._Health;
    }
}

class Player extends Character{
    constructor(str,health,dmg,tohit,level,exppoints,name){
        super(str,health,dmg,tohit,level,name);
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
    constructor(str,health,dmg,tohit,level,expvalue,name){
        super(str,health,dmg,tohit,level,name);
        this._ExperienceValue = expvalue;
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
    RunEncounter(){
        console.log(this._Description);
    }
}

class GainPartyMember extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
    }
    
    RunEncounter(){
        console.log(this.Description);
        PlayerParty.push(new Character(8,24,6,9,1,"New PC ".concat(PlayerParty.length-2)));
        DisplayParty();
    }
}

class Friendly extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
    }

    RunEncounter(){
        console.log("Your party is fully healed.");
        PlayerParty.forEach(function(element){element.RestoreHealth();});
        DisplayParty();
    }
}

class Combat extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
    }
    
    RunEncounter(){
        console.log(this.Description);
        PlayerParty.forEach(function(element){if (element.IsAlive) {element.CurrentHealth = element.CurrentHealth -3;}});
        DisplayParty();
    }
}

class Trap extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
    }

    RunEncounter(){
        console.log("Trap Damage - 1 health to all party memebers.");
        PlayerParty.forEach(function(element){if (element.IsAlive) {element.CurrentHealth = element.CurrentHealth -1;}});
        DisplayParty();
    }
}

class SpotDamage extends Encounter{
    constructor(location,items,description){
        super(location,items,description);
    }

    RunEncounter(){
        console.log("A few of your party members take damage...")
        this.SprinkleDamage();
        DisplayParty();
    }

    SprinkleDamage(){
        var numberOfVictims = Math.ceil(Math.random() * (PlayerParty.length+1)/2);
        for (var i = 0; i < numberOfVictims; i++){
            var playerIndex = Math.ceil(Math.random() * PlayerParty.length-1);
            var damageTaken = Math.ceil(Math.random() * 5+1);
            if (PlayerParty[playerIndex].IsAlive){
                PlayerParty[playerIndex].CurrentHealth -= damageTaken;
            }
        }
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
//#endregion 

//#region Global Variables
var PlayerParty = [];
var PlayerPartyItems = [];
var c = document.getElementById("HexCanvas");
var ctx = c.getContext("2d");
var HexObjects = [];
let CurrentModeType = ModeTypes.DEFAULT;
SelectedHex = new PointF;
var Hexes = [];
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

    var currentHexX;
    var currentHexY;
    var debugText = "";

    var offsetColumn = false;

    for (var col = 0; col < cols; col++) {
        for (var row = 0; row < rows; row++) {

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
            
            if (Hexes.length < this.hexCount+1){ 
            Hexes.push(new HexObject("",new PointF(row,col)));
            }

            this.drawHex(currentHexX, currentHexY, "#ddd", debugText);
        }
        offsetColumn = !offsetColumn;
    }
}

HexagonGrid.prototype.drawHexAtColRow = function(column, row, color, image, debugText) {
    var drawy = column % 2 == 0 ? (row * this.height) + this.canvasOriginY : (row * this.height) + this.canvasOriginY + (this.height / 2);
    var drawx = (column * this.side) + this.canvasOriginX;
    this.drawHex(drawx, drawy, color, debugText, image);
}

HexagonGrid.prototype.drawHex = function(x0, y0, fillColor, debugText,image) {
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
}

//Recusivly step up to the body to calculate canvas offset.
HexagonGrid.prototype.getRelativeCanvasOffset = function() {
	var x = 0, y = 0;
	var layoutElement = this.canvas;
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

	var offSet = this.getRelativeCanvasOffset();

    mouseX -= offSet.x;
    mouseY -= offSet.y;

    var column = Math.floor((mouseX) / this.side);
    var row = Math.floor(
        column % 2 == 0
            ? Math.floor((mouseY) / this.height)
            : Math.floor(((mouseY + (this.height * 0.5)) / this.height)) - 1);


    //Test if on left side of frame            
    if (mouseX > (column * this.side) && mouseX < (column * this.side) + this.width - this.side) {


        //Now test which of the two triangles we are in 
        //Top left triangle points
        var p1 = new Object();
        p1.x = column * this.side;
        p1.y = column % 2 == 0
            ? row * this.height
            : (row * this.height) + (this.height / 2);

        var p2 = new Object();
        p2.x = p1.x;
        p2.y = p1.y + (this.height / 2);

        var p3 = new Object();
        p3.x = p1.x + this.width - this.side;
        p3.y = p1.y;

        var mousePoint = new Object();
        mousePoint.x = mouseX;
        mousePoint.y = mouseY;

        if (this.isPointInTriangle(mousePoint, p1, p2, p3)) {
            column--;

            if (column % 2 != 0) {
                row--;
            }
        }

        //Bottom left triangle points
        var p4 = new Object();
        p4 = p2;

        var p5 = new Object();
        p5.x = p4.x;
        p5.y = p4.y + (this.height / 2);

        var p6 = new Object();
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

HexagonGrid.prototype.IdentifyHexContents = function(mouseX, mouseY){
    var tile = this.getSelectedTile(mouseX, mouseY);
    return ContainsUnit(tile);
}

HexagonGrid.prototype.sign = function(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

//TODO: Replace with optimized barycentric coordinate method
HexagonGrid.prototype.isPointInTriangle = function isPointInTriangle(pt, v1, v2, v3) {
    var b1, b2, b3;

    b1 = this.sign(pt, v1, v2) < 0.0;
    b2 = this.sign(pt, v2, v3) < 0.0;
    b3 = this.sign(pt, v3, v1) < 0.0;

    return ((b1 == b2) && (b2 == b3));
}

HexagonGrid.prototype.clickEvent = function(e) {
    var mouseX = e.pageX;
    var mouseY = e.pageY;

    var localX = mouseX - this.canvasOriginX;
    var localY = mouseY - this.canvasOriginY;

    var HexIndex = this.GetUnitIndexAtSelection(localX,localY);
    var HexContents = Hexes[HexIndex];

    if (HexContents != undefined){
        if (!HexContents.IsEncounterComplete) {
            HexContents.Encounter.RunEncounter();
            Hexes[HexIndex].IsEncounterComplete = true;
            this.drawHexAtColRow(HexContents.PointF.Col,HexContents.PointF.Row,"#FF0000","","Done!");
        }
    }
}

HexagonGrid.prototype.getHexAtCords = function(cordX,cordY) {
    var tile = new PointF(cordX,cordY);
    for (index = 0; index < Hexes.length;index++){
        if (_.isEqual(tile.Points,Hexes[index].PointF.Points)){
            return Hexes[index];
        }
    }
    return undefined;
}

HexagonGrid.prototype.GetUnitIndexAtSelection = function(mouseX, mouseY){
    var tile = this.getSelectedTile(mouseX, mouseY);
    for (index = 0; index < Hexes.length;index++){
        if (_.isEqual(tile,Hexes[index].PointF.Points)){
            return index;
        }
    }
    return -1;
}

HexagonGrid.prototype.DetermineEncounter = function(mouseX, mouseY){
    var tile = this.getSelectedTile(mouseX, mouseY);
    return tile;
}
//#endregion


function ContainsUnit(pointF){
    for (index = 0; index < HexObjects.length;index++){
        if (_.isEqual(pointF,HexObjects[index].PointF.Points)){
            return true;
        }
    }
    return false;
}

function InitializeGameData(){
    for (index = 0; index < Hexes.length;index++){
        Hexes[index].EncounterType = RandomEncounter();
    }
    PlayerParty.push(new Player(10,20,5,10,1,0,"Sargoth"));
    PlayerParty.push(new Player(8,20,5,10,1,0,"Torvak"));
    PlayerParty.push(new Player(8,20,5,10,1,0,"Ralaa"));
    DisplayParty();
    ConfigurePartyDisplay();
}

function RandomEncounter(){
    rnd = Math.ceil(Math.random() * 8);
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

//#region Button functions
function LoadBoard(HexagonGrid){
    for (index = 0; index < HexObjects.length;index++){
        if (HexObjects[index].IsVisible){
            HexagonGrid.drawHexAtColRow(HexObjects[index].PointF.Col,HexObjects[index].PointF.Row,"",HexObjects[index].Image);
        }
    }
}

function ClearBoard(HexagonGrid){
    HexObjects = [];
    HexagonGrid.drawHexGrid(18, 37, 50, 50, true);
}

function SetSelectionMode(Mode){
    if (!Mode){
        throw new Error('ModeType not defined');
    }

    switch(Mode){
        case ModeTypes.DEFAULT:
            CurrentModeType = ModeTypes.DEFAULT;
            break;
        case ModeTypes.INSPECT:
            CurrentModeType = ModeTypes.INSPECT;
            break;
        case ModeTypes.MOVEMENT:
            CurrentModeType = ModeTypes.MOVEMENT;
            break;
        case ModeTypes.PLACEMENT:
            CurrentModeType = ModeTypes.PLACEMENT;
            break;
        case ModeTypes.SELECTION:
            CurrentModeType = ModeTypes.SELECTION;
            break;
        default:
            CurrentModeType = ModeTypes.DEFAULT;
    }
}
//#endregion

function DisplayParty(){
    document.getElementById("PlayerInfo").innerHTML = "<tr><TD>Character Info";
    var HealthIndicatorFont = "<span style='color:black';>";
    for (var i = 0; i < PlayerParty.length; i++){
        if (PlayerParty[i].IsAlive){
            if(PlayerParty[i].CurrentHealth < PlayerParty[i].Health){
                HealthIndicatorFont = "<span style='color:red';>";
                ;}else{
                    HealthIndicatorFont = "<span style='color:black';>";
            }
        }
        document.getElementById("PlayerInfo").innerHTML += "<TD><div class='PCDisplay' id='PCSlot".concat(i) + "' style='border:2px solid black; width:150px'>" 
            + "Name:" + PlayerParty[i].Name 
            + "<BR/>Dmg:" + PlayerParty[i].Damage 
            + "<br/>ToHit:" + PlayerParty[i].ToHit 
            + "<br/>HP:" + HealthIndicatorFont + PlayerParty[i].CurrentHealth + "</span>"
            + "</div></TD>";
    }
    document.getElementById("PlayerInfo").innerHTML += "</TD></tr>";
    UpdateDisplay();
}

function UpdateDisplay(){
    for (var i = 0; i < PlayerParty.length; i++){
        if (!PlayerParty[i].IsAlive){
            var divID = "PCSlot".concat(i);
            document.getElementById(divID).style.backgroundColor = "grey";
        }
    }
}

function ConfigurePartyDisplay(){
    for (var i = 0; i < PlayerParty.length; i++){
        var divID = "PCSlot".concat(i);
        if (PlayerParty[i].IsAlive){
            document.getElementById(divID).addEventListener("click",HandlePartyDisplayClick);
        }else{
            document.getElementById(divID).addEventListener("click",HandleDeadPartyDisplayClick);
        }
    }
}

function HandlePartyDisplayClick(){
    //TODO: What do I want here...
}

function HandleDeadPartyDisplayClick(){
    //TODO 
    console.log("This character is dead.");
}

