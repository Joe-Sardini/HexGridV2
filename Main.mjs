'use strict'

import { InitializeGameData } from './Init.mjs';
import { HexagonGrid } from './Hexagon.mjs';
import { create } from './canvas.mjs';

let myCanvas = create('HexCanvas','tdCanvas',1075,855);
let HG = new HexagonGrid(myCanvas,20);
InitializeGameData();

