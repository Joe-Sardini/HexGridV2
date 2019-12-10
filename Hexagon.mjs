"use strict"

import { PointF } from './PointF.mjs';
import { HexObject } from './HexObject.mjs';
import { EventLogElement } from './Elements.mjs';

export class HexagonGrid {
    constructor(canvas, radius){
        this._radius = radius;

        this._height = Math.sqrt(3) * radius;
        this._width = 2 * radius;
        this._side = (3 / 2) * radius;

        this._canvas = document.getElementById(canvas);
        this._context = this._canvas.getContext('2d');

        this._canvasOriginX = 0;
        this._canvasOriginY = 0;
        
        this._canvas.addEventListener("mousedown", this.ClickEvent.bind(this), false);
    }

    DrawHexGrid(rows, cols, originX, originY, isDebug){
        this._canvasOriginX = originX;
        this._canvasOriginY = originY;
        this._hexCount = rows*cols;
        this._rows = rows;
        this._cols = cols;

        let currentHexX;
        let currentHexY;
        let debugText = "";
    
        let offsetColumn = false;
    
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
    
                if (!offsetColumn) {
                    currentHexX = (col * this._side) + originX;
                    currentHexY = (row * this._height) + originY;
                } else {
                    currentHexX = col * this._side + originX;
                    currentHexY = (row * this._height) + originY + (this._height * 0.5);
                }
    
                if (isDebug) {
                    debugText = row + "," + col;
                }
                
                if (window.Hexes.length < this._hexCount+1){ //Add all hexes to the hex list
                    window.Hexes.push(new HexObject("",new PointF(row,col),window.Hexes.length));
                }
    
                this.DrawHex(currentHexX, currentHexY, "#ddd", debugText);
            }
            offsetColumn = !offsetColumn;
        }
    }

    DrawHexAtColRow(column, row, color, image, debugText, hexText){
        let drawy = column % 2 == 0 ? (row * this._height) + this._canvasOriginY : (row * this._height) + this._canvasOriginY + (this._height / 2);
        let drawx = (column * this._side) + this._canvasOriginX;
        this.DrawHex(drawx, drawy, color, debugText, image, hexText);
    }

    DrawHex(x0, y0, fillColor, debugText,image, hexText){
        this._context.strokeStyle = "#000";
        this._context.beginPath();
        this._context.moveTo(x0 + this._width - this._side, y0);
        this._context.lineTo(x0 + this._side, y0);
        this._context.lineTo(x0 + this._width, y0 + (this._height / 2));
        this._context.lineTo(x0 + this._side, y0 + this._height);
        this._context.lineTo(x0 + this._width - this._side, y0 + this._height);
        this._context.lineTo(x0, y0 + (this._height / 2));
    
        if (fillColor){
            this._context.fillStyle = fillColor;
            this._context.fill();
        }
    
        this._context.closePath();
        this._context.stroke();
    
        if (image){
            this._context.drawImage(image,x0 + (this._width / 2) - (this._width/4),y0 + this._height-30,20,20);
        }
    
        if (debugText){
            this._context.font = "8px";
            this._context.fillStyle = "#000";
            this._context.fillText(debugText, x0 + (this._width / 2) - (this._width/4), y0 + (this._height - 5));
        }
    
        if (hexText){
            this._context.font = "10px";
            this._context.fillStyle = "#000";
            this._context.fillText(hexText, x0 + (this._width / 2) - (this._width/4) + 10, y0 + (this._height - 14));
        }
    
        this._context.globalAlpha = 0.4;
    }

    GetRelativeCanvasOffset(){
        let x = 0, y = 0;
        let layoutElement = this._canvas;
        if (layoutElement.offsetParent) {
            do {
                x += layoutElement.offsetLeft;
                y += layoutElement.offsetTop;
            } while (layoutElement == layoutElement.offsetParent);
        }
        return { x: x, y: y };
    }

    GetSelectedTile(mouseX, mouseY){
        let offSet = this.GetRelativeCanvasOffset();

        mouseX -= offSet.x;
        mouseY -= offSet.y;
    
        let column = Math.floor((mouseX) / this._side);
        let row = Math.floor(
            column % 2 == 0
                ? Math.floor((mouseY) / this._height)
                : Math.floor(((mouseY + (this._height * 0.5)) / this._height)) - 1);
    
    
        //Test if on left side of frame            
        if (mouseX > (column * this._side) && mouseX < (column * this._side) + this._width - this._side) {
    
    
            //Now test which of the two triangles we are in 
            //Top left triangle points
            let p1 = new Object();
            p1.x = column * this._side;
            p1.y = column % 2 == 0
                ? row * this._height
                : (row * this._height) + (this._height / 2);
    
            let p2 = new Object();
            p2.x = p1.x;
            p2.y = p1.y + (this._height / 2);
    
            let p3 = new Object();
            p3.x = p1.x + this._width - this._side;
            p3.y = p1.y;
    
            let mousePoint = new Object();
            mousePoint.x = mouseX;
            mousePoint.y = mouseY;
    
            if (this.IsPointInTriangle(mousePoint, p1, p2, p3)) {
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
            p5.y = p4.y + (this._height / 2);
    
            let p6 = new Object();
            p6.x = p5.x + (this._width - this._side);
            p6.y = p5.y;
    
            if (this.IsPointInTriangle(mousePoint, p4, p5, p6)) {
                column--;
    
                if (column % 2 == 0) {
                    row++;
                }
            }
        }
        return  { row: row, column: column };
    }

    Sign(p1, p2, p3){
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }

    IsPointInTriangle(pt, v1, v2, v3){
        let b1, b2, b3;

        b1 = this.Sign(pt, v1, v2) < 0.0;
        b2 = this.Sign(pt, v2, v3) < 0.0;
        b3 = this.Sign(pt, v3, v1) < 0.0;
    
        return ((b1 == b2) && (b2 == b3));
    }

    ClickEvent(e){
        let mouseX = e.pageX;
        let mouseY = e.pageY;
        let localX = mouseX - this._canvasOriginX;
        let localY = mouseY - this._canvasOriginY;
        let HexIndex = this.GetUnitIndexAtSelection(localX,localY);
        let HexContents = window.Hexes[HexIndex];
    
        if (HexContents != undefined){
            if (!HexContents.IsEncounterComplete){
                EventLogElement.innerHTML += (`<br><span class='Damage'> ${HexContents.Encounter.Description} </span>`);
                HexContents.Encounter.RunEncounter();
                window.Hexes[HexIndex].IsEncounterComplete = true;
                this.DrawHexAtColRow(HexContents.PointF.Col,HexContents.PointF.Row,"#FF0000","","Done!");
                this.RevealSurroundingHexes(HexIndex);
            }
        }
    }

    RevealSurroundingHexes(HexIndex){
        let surroudingHexGridCords = [];
        surroudingHexGridCords = this.CalculateSurroundingHexesV2(window.Hexes[HexIndex].PointF.Row,window.Hexes[HexIndex].PointF.Col,1);
        for (let idx = 0;idx < surroudingHexGridCords.length; idx++){
            let Hex = this.GetHexAtCords(surroudingHexGridCords[idx].Row,surroudingHexGridCords[idx].Col);
            if (!Hex.IsEncounterComplete){
                this.DrawHexAtColRow(surroudingHexGridCords[idx].Col,surroudingHexGridCords[idx].Row,Hex.DifficultyLevelColour,"","",Hex.DifficultyLevel);
            }
        }
    }

    IsValidHex(cordX,cordY){
        if (cordX > -1 && cordX < this._rows && cordY > -1 && cordY < this._cols){
            return true;
        }else{
            return false;
        }
    }

    //TODO: this is incomplete
    CalculateSurroundingHexesV3(cordX,cordY,range){
        let Hexes = [];
        let iterations = range+1;
        let yIterator = range - range - range;
        let xIterator = range;
    
        for (let y = yIterator; y < iterations; y++){
            for (let x = -1; x < xIterator; x++){
                Hexes.push(new PointF(cordX+x,cordY+y));
            }
        }
        return Hexes;
    }

    CalculateSurroundingHexesV2(cordX,cordY,range){
        let SurroundingHexes = [];

        if (cordY % 2 == 0){
            for (let y = 0; y < range+2; y++){
                for (let x = 0; x < range+1; x++){
                    if (cordX === (cordX-(range-x)) && cordY === (cordY-(range-y))){ //identify and skip selected hex
                        if (this.IsValidHex(cordX+range,cordY)) {
                            SurroundingHexes.push(new PointF(cordX+range,cordY));
                        }
                    }else{
                        if (this.IsValidHex(cordX-(range-x),cordY-(range-y))){
                            SurroundingHexes.push(new PointF(cordX-(range-x),cordY-(range-y)));
                        }
                    }
                }
            }
        }else{
            for (let y = 0; y < range+2; y++){
                for (let x = 1; x < range+2; x++){
                    if (cordX === (cordX-(range-x)) && cordY === (cordY-(range-y))){ //identify and skip selected hex
                        if (this.IsValidHex(cordX-range,cordY)) {
                            SurroundingHexes.push(new PointF(cordX-range,cordY));
                        }
                    }else{
                        if (this.IsValidHex(cordX-(range-x),cordY-(range-y))){
                            SurroundingHexes.push(new PointF(cordX-(range-x),cordY-(range-y)));
                        }
                    }
                }
            }
        }
        return SurroundingHexes;
    }

    CalculateSurroundingHexes(cordX,cordY){
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
                    break;
                case 2:
                    if (this.IsValidHex(cordX-1,cordY)){
                        sHexes.push(new PointF(cordX-1,cordY));
                    }
                    break;
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
                    break;
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
                    break;
                case 5:
                    if (this.IsValidHex(cordX+1,cordY)){
                        sHexes.push(new PointF(cordX+1,cordY));
                    }
                    break;
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
                    break;
                default:
                    break;
            }
        }
        return sHexes;
    }

    GetHexAtCords(cordX,cordY){
        let tile = new PointF(cordX,cordY);
        for (let index = 0; index < window.Hexes.length;index++){
            if (window._.isEqual(tile.Points,window.Hexes[index].PointF.Points)){
                return window.Hexes[index];
            }
        }
        return undefined;
    }

    GetUnitIndexAtSelection(mouseX, mouseY){
        let tile = this.GetSelectedTile(mouseX, mouseY);
        let nPointF = new PointF(tile.row,tile.column);
        let obj = window.Hexes.find(HexObject => window._.isEqual(HexObject.PointF,nPointF));
    
        return obj.HexIndex;
    }

    DetermineEncounter(mouseX, mouseY){
        let tile = this.GetSelectedTile(mouseX, mouseY);
        return tile;
    }

    TransferItem(e){
        console.log(e.from);
    }
}
//#endregion
