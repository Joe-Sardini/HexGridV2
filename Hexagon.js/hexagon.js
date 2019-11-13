"use strict"

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
HexagonGrid.prototype.isPointInTriangle = function(pt, v1, v2, v3) {
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
    surroudingHexGridCords = this.CalculateSurroundingHexesV3(Hexes[HexIndex].PointF.Row,Hexes[HexIndex].PointF.Col,2);
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

HexagonGrid.prototype.CalculateSurroundingHexesV3 = function(cordX,cordY,range){
    let Hexes = [];
    let iterations = range+1;
    let yIterator = range - range - range;
    let xIterator = range;
    let totalIterations = range+range+1;

    for (let y = yIterator; y < iterations; y++){
        for (let x = -1; x < xIterator; x++){
            Hexes.push(new PointF(cordX+x,cordY+y));
        }
    }
    return Hexes;
}

HexagonGrid.prototype.CalculateSurroundingHexesV2 = function(cordX,cordY,range){
    let Hexes = [];

    if (cordY % 2 == 0){
        for (let y = 0; y < range+2; y++){
            for (let x = 0; x < range+1; x++){
                if (cordX === (cordX-(range-x)) && cordY === (cordY-(range-y))){ //identify and skip selected hex
                    Hexes.push(new PointF(cordX+range,cordY));
                }else{
                    Hexes.push(new PointF(cordX-(range-x),cordY-(range-y)));
                }
            }
        }
    }else{
        for (let y = 0; y < range+2; y++){
            for (let x = 1; x < range+2; x++){
                if (cordX === (cordX-(range-x)) && cordY === (cordY-(range-y))){ //identify and skip selected hex
                    Hexes.push(new PointF(cordX-range,cordY));
                }else{
                    Hexes.push(new PointF(cordX-(range-x),cordY-(range-y)));
                }
                console.log(cordX-(range-x),cordY-(range-y));
            }
        }
    }

    return Hexes;
}

//TODO make an algo to replace this.
//Returns a list of hex grid coordinates that surround the selected location
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
    let nPointF = new PointF(tile.row,tile.column);
    let obj = Hexes.find(HexObject => _.isEqual(HexObject.PointF,nPointF));

    return obj.HexIndex;
}

HexagonGrid.prototype.DetermineEncounter = function(mouseX, mouseY){
    let tile = this.getSelectedTile(mouseX, mouseY);
    return tile;
}
//#endregion
