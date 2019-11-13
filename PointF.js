
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
