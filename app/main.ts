﻿/// <reference path="../_build/@types/Animate.d.ts" />
import "./styles/main.scss";
import { Choose } from "./choose";
import { initAnimate } from "./initAnimate";
import { LevelLoader } from "./levelLoader";
import { levels } from "./levelLoader";
import { Menu } from "./menu";
import { Panorama } from "./panorama";
import { Game } from "./game";
import { loadXML } from "./xmlLoader";
import { Lose } from "./lose";

let stage: createjs.Stage;

let levelLoad: LevelLoader;

async function start(lib: AnimateLib, stage: createjs.Stage): Promise<void>
{ 
    stage.enableMouseOver(10);
    createjs.Touch.enable(stage);
    stage.mouseMoveOutside = true;
    stage.snapToPixel = true;

    const decks = Object.fromEntries(await Promise.all(["president"].map(async (deck)=> [deck,await loadXML(`/xml/question_${deck}.graphml`)])));

    levelLoad  = new LevelLoader(lib, stage, decks); 
    //Main-Menu
    levelLoad.load(levels.MENU);

    const menu = new Menu(levelLoad);
    new Choose(levelLoad);
    new Panorama(levelLoad);
    const game = new Game(levelLoad);
    const lose = new Lose(levelLoad);

    levelLoad.game = game;
    levelLoad.menu = menu;
    levelLoad.lose = lose;

    //createjs.Ticker.framerate = 30;
    //createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
}

export function init(): void 
{
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    stage = new createjs.Stage(canvas);
    stage.setBounds(0,0,720,1280);


    initAnimate(stage).then((lib: AnimateLib)=>start(lib,stage).then(()=>
    {
        console.info("finish loading");
    }));
    
}

init();