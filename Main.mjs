'use strict'

import { InitializeGameData } from './Init.mjs?v=1';
import { HexagonGrid } from './Hexagon.mjs';

const HG = new HexagonGrid('HexCanvas',20);
HG.DrawHexGrid(24, 35, 5, 5, true);
InitializeGameData();