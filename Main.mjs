'use strict'

import { InitializeGameData } from './Init.mjs';
import { HexagonGrid } from './Hexagon.mjs';

let HG = new HexagonGrid('HexCanvas',20);
HG.DrawHexGrid(24, 35, 5, 5, true);
InitializeGameData();

HG.addEventListener('TransferItem',HG.TransferItem(e),false);

