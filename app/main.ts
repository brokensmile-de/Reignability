﻿/// <reference path="../_build/@types/Animate.d.ts" />
import "./styles/main.scss";
import { Choose } from "./choose";
import { initAnimate } from "./initAnimate";
import { LevelLoader } from "./levelLoader";
import { levels } from "./levelLoader";
import { Menu } from "./menu";
import { Panorama } from "./panorama";
import { Game } from "./game";
import { XmlLoader } from "./xmlLoader";

let stage: createjs.Stage;

let levelLoad: LevelLoader;
let xmlP: XmlLoader; //President XML Fragen
let xmlA: XmlLoader; //Activist XML Fragen
let xmlJ: XmlLoader; //Joe XML Fragen

let menu: Menu; //Verwalter von Menu
let choose: Choose;
let panorama: Panorama;
let game: Game;


function start(lib: AnimateLib, stage: createjs.Stage): void{

  
    stage.enableMouseOver(10);
    createjs.Touch.enable(stage);
    stage.mouseMoveOutside = true;

    
    xmlP = new XmlLoader("xml/question_president.graphml");
    levelLoad  = new LevelLoader(lib, stage, xmlP); 
    //Main-Menu
    levelLoad.load(levels.MENU);

    menu = new Menu(levelLoad);
    choose = new Choose(levelLoad);
    panorama = new Panorama(levelLoad);
    game = new Game(levelLoad);

    levelLoad.game = game;
    
}



export function init(): void {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    stage = new createjs.Stage(canvas);
    stage.setBounds(0,0,720,1280);

    initAnimate(stage).then((lib: AnimateLib)=>start(lib,stage));
    
    
    
}

init();