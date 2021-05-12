import { LevelLoader, levels } from "./levelLoader";
import { Card, CardList } from "./card";
import { RandomPool } from "./randomPool";


export class Game 
{
    private lvlLoad: LevelLoader;

    public back: createjs.MovieClip;

    public buff1:  createjs.MovieClip;


    public pillar_social: createjs.MovieClip;
    public pillar_natur: createjs.MovieClip;
    public pillar_dollar: createjs.MovieClip;

    public social_balken: createjs.MovieClip;
    public natur_balken: createjs.MovieClip;
    public dollar_balken: createjs.MovieClip;

    public social_dot: createjs.MovieClip;
    public natur_dot: createjs.MovieClip;
    public dollar_dot: createjs.MovieClip;

    public card_text: createjs.Text;
    public card_name: createjs.Text;


    public deck: createjs.MovieClip;
    public deck_content: createjs.MovieClip;
    public deck_content_text: createjs.Text;

    public card_background: createjs.MovieClip;
    public card_middle: createjs.MovieClip;
    public card_front: createjs.MovieClip;
    // president // activist // joe
    public current_player;

    public stage_game: createjs.MovieClip;

    public value_social = 0.5;
    public value_natur = 0.5;
    public value_dollar = 0.5;

    private right = false;
    private left = false;
    private out = false;

    public cardList: CardList;
    public currentCard: Card;
    public pauseCard:Card;
    //public cardIndex = 0;

    public fontS = 50;

    constructor(loader: LevelLoader) 
    { 

        this.lvlLoad = loader;

        this.stage_game = this.lvlLoad.stage_game;

        this.back = this.stage_game.getChildByName("back") as createjs.MovieClip;

        this.pillar_social = this.stage_game.getChildByName("pillar_social") as createjs.MovieClip;
        this.pillar_natur = this.stage_game.getChildByName("pillar_natur") as createjs.MovieClip;
        this.pillar_dollar = this.stage_game.getChildByName("pillar_dollar") as createjs.MovieClip;

        this.social_balken = this.pillar_social.getChildByName("balken") as createjs.MovieClip;
        this.natur_balken = this.pillar_natur.getChildByName("balken") as createjs.MovieClip;
        this.dollar_balken = this.pillar_dollar.getChildByName("balken") as createjs.MovieClip;

        this.social_dot = this.stage_game.getChildByName("social_dot") as createjs.MovieClip;
        this.natur_dot = this.stage_game.getChildByName("natur_dot") as createjs.MovieClip;
        this.dollar_dot = this.stage_game.getChildByName("dollar_dot") as createjs.MovieClip;


        this.card_text = this.stage_game.getChildByName("card_text") as createjs.Text;
        this.card_name = this.stage_game.getChildByName("card_name") as createjs.Text;

        this.deck = this.stage_game.getChildByName("deck") as createjs.MovieClip;
        this.deck_content = this.deck.getChildByName("content") as createjs.MovieClip;
        this.deck_content_text = this.deck.getChildByName("content_text") as createjs.Text;
        this.card_background = this.deck.getChildByName("card_background") as createjs.MovieClip;
        this.card_middle = this.deck.getChildByName("card_middle") as createjs.MovieClip;
        this.card_front = this.deck.getChildByName("card_front") as createjs.MovieClip;

        this.card_text.text = "";
        this.card_name.text = "";
        this.deck_content_text.text = "";


        this.card_text.text = "     ";
        this.card_name.text = "     ";

        this.deck_content_text.text = " ";

        this.stage_game.on("rollout", (): void => 
        {
            this.right = false;
            this.left = false;
            this.out = true;
            this.deck.gotoAndStop("ready");
            this.deck_content_text.text = " ";
        })

        this.stage_game.on("rollover", (): void => 
        {
            this.out = false;
        })

        this.handleButton(this.back);
        this.back.on("pressup",(): void =>
        {
            this.lvlLoad.load(levels.PAUSE);   
        })
        
        //this.stage_game.mouseChildren = false;
    }


    public startGame(): void 
    {

        this.deck.gotoAndPlay("draw");

        this.card_text.text = this.currentCard.card_text;
        this.card_name.text = this.currentCard.card_name;

        (this.lvlLoad.lib as any).content = this.currentCard.card_id;
        this.deck_content.gotoAndStop(this.currentCard.card_id);
        this.deck_content_text.text = this.currentCard.text_mitte;

        createjs.Ticker.on("tick", (): void => 
        {
            
            const mouseX = this.stage_game.globalToLocal(this.lvlLoad.stage.mouseX, this.lvlLoad.stage.mouseY).x;
            (this.lvlLoad.lib as any).content = this.currentCard.card_id;

            if (this.deck.currentLabel == "ready" && !this.out) 
            {

                this.card_text.text = this.currentCard.card_text;
                this.card_name.text = this.currentCard.card_name;


                while (this.card_text.getBounds().height > 300)
                    this.card_text.font = --this.fontS + "px 'OCR A Extended'";


                //Swipen nach Rechts oder Links
                if (mouseX > 560 && !this.right) 
                {
                    this.deck.gotoAndPlay("move_right");
                    this.right = true;
                    this.setDisplayCard(this.currentCard);
                }
                if (mouseX < 190 && !this.left) 
                {
                    this.deck.gotoAndPlay("move_left");
                    this.left = true;
                    this.setDisplayCard(this.currentCard);
                }
            }


            // In die Mitte wieder
            if (mouseX > 191 && mouseX < 559 && this.deck.paused && !this.out) 
            {
                this.resetContent();
                this.deck_content_text.text = this.currentCard.text_mitte;
            }
            this.checkValues();


        });

        // Karte los lassen 
        this.stage_game.on("pressup", (): void => 
        {

            //Touch Reset
            this.lvlLoad.stage.mouseX = this.stage_game.localToGlobal(this.lvlLoad.stage.getBounds().width / 2,this.lvlLoad.stage.getBounds().height / 2).x;
        

            if (this.right) 
            {
                this.deck.gotoAndPlay("discard_right");
                this.deck_content_text.text = " ";
                this.card_text.text = " ";
                this.card_name.text = " ";
                this.setValues(this.currentCard.value_social_rechts, this.currentCard.value_natur_rechts, this.currentCard.value_dollar_rechts);
                this.right = false;
                this.card_text.font = "50px 'OCR A Extended'";
                this.fontS = 50;


                if (this.currentCard instanceof Card) 
                {
                    this.currentCard = this.currentCard.next_rechts as Card;
                    (this.lvlLoad.lib as any).content = this.currentCard.card_id;
                    this.currentCard.visited = true;
                }
                if (this.currentCard instanceof RandomPool) 
                {
                    if (this.currentCard.index < this.currentCard.count) 
                    {
                        const randomCard = this.currentCard.pool[this.currentCard.index];
                        this.currentCard.index++;
                        this.currentCard = randomCard as Card;
                        this.setDisplayCard(this.currentCard);
                    }
                    else 
                    {
                        this.currentCard.index = 0;
                        this.currentCard = this.currentCard.next as Card;
                    }
                }
                if(this.value_social <= 0 || this.value_dollar <= 0 || this.value_natur <= 0 || this.value_social >= 1 || this.value_natur >= 1 || this.value_dollar >= 1)
                    this.lvlLoad.load(levels.LOSE);

            }

            if (this.left) 
            {
                this.deck.gotoAndPlay("discard_left");
                this.deck_content_text.text = " ";
                this.card_text.text = " ";
                this.card_name.text = " ";
                this.setValues(this.currentCard.value_social_links, this.currentCard.value_natur_links, this.currentCard.value_dollar_links);
                this.left = false;
                this.card_text.font = "50px 'OCR A Extended'";
                this.fontS = 50;


                if (this.currentCard instanceof Card) 
                {
                    this.currentCard = this.currentCard.next_links as Card;
                    (this.lvlLoad.lib as any).content = this.currentCard.card_id;
                    this.currentCard.visited = true;
                }
                if (this.currentCard instanceof RandomPool) 
                {
                    if (this.currentCard.index < this.currentCard.count) 
                    {
                        const randomCard = this.currentCard.pool[this.currentCard.index];
                        this.currentCard.index++;
                        this.currentCard = randomCard as Card;
                    }
                    else 
                    {
                        this.currentCard.index = 0;
                        this.currentCard = this.currentCard.next as Card;
                    }
                }
                if(this.value_social <= 0 || this.value_dollar <= 0 || this.value_natur <= 0 || this.value_social >= 1 || this.value_natur >= 1 || this.value_dollar >= 1)
                    this.lvlLoad.load(levels.LOSE);
            }


        });

    }

    public setDisplayCard(karte: Card): void 
    {

        this.card_text.text = karte.card_text;

        this.card_text.text = this.currentCard.card_text;

        while(this.card_text.getBounds().height > 300)
            this.card_text.font = --this.fontS + "px 'OCR A Extended'";


        this.card_name.text = karte.card_name;
        (this.lvlLoad.lib as any).content = karte.card_id;
        this.deck_content.gotoAndStop(karte.card_id);
        this.card_middle

        if (this.left) 
        {
            this.deck_content_text.text = karte.text_links;
            this.showDot(karte.value_social_links, this.social_dot);
            this.showDot(karte.value_natur_links, this.natur_dot);
            this.showDot(karte.value_dollar_links, this.dollar_dot);

        }
        if (this.right) 
        {
            this.deck_content_text.text = karte.text_rechts;
            this.showDot(karte.value_social_rechts, this.social_dot);
            this.showDot(karte.value_natur_rechts, this.natur_dot);
            this.showDot(karte.value_dollar_rechts, this.dollar_dot);
        }


    }

    public showDot(value: number, dot: createjs.MovieClip): void 
    {

        //Skala 0 -> 0.01 -> 0.03 -> 0.05 -> 0.1
        value = Math.abs(value);

        if (value <= 0.1)
            dot.gotoAndStop("big");
        if (value <= 0.05)
            dot.gotoAndStop("middle");
        if (value <= 0.03)
            dot.gotoAndStop("small");
        if (value <= 0.01)
            dot.gotoAndStop("mini");
        if (value <= 0)
            dot.gotoAndStop("default");
    }

    public resetDot(): void 
    {
        this.social_dot.gotoAndStop("default");
        this.natur_dot.gotoAndStop("default");
        this.dollar_dot.gotoAndStop("default");
    }

    public resetContent(): void 
    {
        if (this.right)
            this.deck.gotoAndPlay("move_right_back");

        if (this.left)
            this.deck.gotoAndPlay("move_left_back");

        this.deck_content_text.text = "";
        this.resetDot();

        this.left = false;
        this.right = false;
    }

    public setValues(vs: number, vn: number, vd: number): void 
    {
        const fakeFaktor = 5;
        this.value_social += vs*fakeFaktor;
        this.value_natur += vn*fakeFaktor;
        this.value_dollar += vd*fakeFaktor;
    }

    public checkValues(): void 
    {

        const unter = 0.2;
        const ober = 0.8;

        this.social_balken.scaleY = this.value_social;
        this.natur_balken.scaleY = this.value_natur;
        this.dollar_balken.scaleY = this.value_dollar;

        this.colorBalken(this.social_balken, this.value_social, unter, ober);
        this.colorBalken(this.natur_balken, this.value_natur, unter, ober);
        this.colorBalken(this.dollar_balken, this.value_dollar, unter, ober);

      
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public colorBalken(balken: any, value: number, untere: number, obere: number): void 
    {

        balken.shape.graphics._fill.style = "#00CB32";

        if (value > obere)
            balken.shape.graphics._fill.style = "#FFFFFF";
        if (value < untere)
            balken.shape.graphics._fill.style = "#FF0000";
    }

    public shuffleAnimation(): void 
    {

        // these are equivalent, 1000ms / 40fps = 25ms
        //createjs.Ticker.interval = 1000;
        createjs.Ticker.framerate = 20;

        let i = 1;
        let count = 0;
        const anzahl = 3;

        createjs.Ticker.on("tick", (): void => 
        {
            i = (i + 1) % 6;
            if (i == 0 && count <= anzahl) 
            {
                count++;
                const ani = new this.lvlLoad.lib.shuffle_ani();

                (ani as any).card_back.gotoAndStop(this.current_player);
                this.stage_game.addChild(ani);
                ani.x = this.deck.x - 200;
                ani.y = this.deck.y - 270;
            }

            if (count == anzahl) 
            {
                count = anzahl + 1;
                this.startGame();
            }

        }); 
    }

    private handleButton(button: createjs.MovieClip): void
    {
        button.mouseChildren = false;

        button.on("mouseleave",(): void =>
        {
            button.gotoAndStop("default");
        })
        button.on("mousedown",(): void =>
        {
            button.gotoAndStop("hover");
            
            this.pauseCard = this.currentCard;
            console.log(this.pauseCard);

        })
        button.on("rollout",(): void =>
        {
            button.gotoAndStop("default");
        })
    }

}