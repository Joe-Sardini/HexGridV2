'use strict'

export function create(id,parent,width,height){
    let canvasElem = document.createElement('canvas');

    parent.appendChild(canvasElem);
    canvasElem.width = width;
    canvasElem.height = height;

    let ctx = canvasElem.getContext('2d');

    return {
        ctx: ctx,
        id: id
    };
}