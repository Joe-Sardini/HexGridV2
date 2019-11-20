'use strict'

export function create(id,parentId,width,height){
    let canvasElem = document.createElement('canvas');
    let parent = document.getElementById(parentId);

    parent.appendChild(canvasElem);
    canvasElem.width = width;
    canvasElem.height = height;

    let ctx = canvasElem.getContext('2d');

    return {
        ctx: ctx,
        id: id
    };
}