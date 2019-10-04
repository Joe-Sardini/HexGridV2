// Hex math defined here: http://blog.ruslans.com/2011/02/hexagonal-grid-math.html

//#region Object definitions
class HexObject {
    constructor(image, PointF, encType){
        this._Image = image;
        this._IsSelected = false;
        this._PointF = PointF;
        this._IsVisible = false;
        this._EncounterType = encType;
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
    }
    //#endregion 
}

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

class PlayerCharacter {
    constructor(str,health,dmg,tohit){
        this._Strength = str;
        this._Health = health;
        this._Damage = dmg;
        this._ToHit = tohit;
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
}
//#endregion 

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
    INFORMATION: 'information'
}
//#endregion 

//#region Global Variables
var PlayerParty = [];
var c = document.getElementById("HexCanvas");
var ctx = c.getContext("2d");
var HexObjects = [];
let CurrentModeType = ModeTypes.DEFAULT;
SelectedHex = new PointF;
var Hexes = [];
//#endregion 

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

//#region HexagonGrid
HexagonGrid.prototype.drawHexGrid = function (rows, cols, originX, originY, isDebug) {
    this.canvasOriginX = originX;
    this.canvasOriginY = originY;
    
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

            this.drawHex(currentHexX, currentHexY, "#ddd", debugText);
        }
        offsetColumn = !offsetColumn;
    }
}

HexagonGrid.prototype.drawHexAtColRow = function(column, row, color, image) {
    var drawy = column % 2 == 0 ? (row * this.height) + this.canvasOriginY : (row * this.height) + this.canvasOriginY + (this.height / 2);
    var drawx = (column * this.side) + this.canvasOriginX;
    this.drawHex(drawx, drawy, color, "", image);
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
    Hexes.push(new HexObject(image,this.getSelectedTile(x0,y0)));
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

HexagonGrid.prototype.clickEvent = function (e) {
    var mouseX = e.pageX;
    var mouseY = e.pageY;

    var localX = mouseX - this.canvasOriginX;
    var localY = mouseY - this.canvasOriginY;

    var tile = this.getSelectedTile(localX, localY);
    alert(tile.column);
    /*
    if (this.IdentifyHexContents(localX,localY)){
        var unitIndex = this.GetUnitIndexAtSelection(localX,localY);
        console.log(unitIndex);
        console.log(CurrentModeType);
        if (CurrentModeType == ModeTypes.SELECTION){
            if (unitIndex != "Not Found"){
                HexObjects[unitIndex].IsSelected = true;
                CurrentModeType = ModeTypes.MOVEMENT;
            }
        }
        if (CurrentModeType == ModeTypes.MOVEMENT){
            HexObjects[unitIndex].PointF = tile;
        }
    }
    */

    if (tile.column >= 0 && tile.row >= 0) {
        var drawy = tile.column % 2 == 0 ? (tile.row * this.height) + this.canvasOriginY + 6 : (tile.row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
        var drawx = (tile.column * this.side) + this.canvasOriginX;

        //this.drawHex(drawx, drawy - 6, "rgba(110,110,70,0.3)", "");
        //this.drawHex(drawx, drawy - 6,"","","");
    } 
}

HexagonGrid.prototype.GetUnitIndexAtSelection = function(mouseX, mouseY){
    var tile = this.getSelectedTile(mouseX, mouseY);
    for (index = 0; index < HexObjects.length;index++){
        if (_.isEqual(tile,HexObjects[index].PointF.Points)){
            return index;
            break;
        }
    }
    return "Not Found";
}

HexagonGrid.prototype.DetermineEncounter = function(mouseX, mouseY){
    var tile = this.getSelectedTile(mouseX, mouseY);
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
    /*
    var image = new Image(20,20);
    image.src = 'images/1.png';
    var HexObj = new HexObject(image,new PointF(0,0),EncounterTypes.COMBAT);
    HexObj.IsVisible = true;
    HexObjects.push(HexObj);
    image = new Image(20,20);
    image.src = 'images/2.png';
    HexObjects.push(new HexObject(image,new PointF(0,1),EncounterTypes.TREASURE));
    image = new Image(20,20);
    image.src = 'images/3.png';
    HexObjects.push(new HexObject(image,new PointF(0,2),EncounterTypes.REST));
    image = new Image(20,20);
    image.src = 'images/4.png';
    HexObjects.push(new HexObject(image,new PointF(0,3),EncounterTypes.FRIENDLY));
    */

    for (index = 0; index < Hexes.length;index++){
        Hexes[index].EncounterType = RandomEncounter();
    }
    PlayerParty.push(new PlayerCharacter(10,20,5,10));
}

function RandomEncounter(){
    rnd = Math.ceil(Math.random() * 5);
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
        default:
            return EncounterTypes.COMBAT;
    }
}

//#region Button functions
function LoadBoard(HexagonGrid){
    for (index = 0; index < HexObjects.length;index++){
        if (HexObjects[index].IsVisible){
            HexagonGrid.drawHexAtColRow(HexObjects[index].PointF.Col,HexObjects[index].PointF.Row,"",HexObjects[index].Image);
        }
    }

    console.log(Hexes.length);
    console.log(Hexes[0].PointF);
    console.log(Hexes[0].EncounterType);
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
