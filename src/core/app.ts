import { Renderer } from "./renderer";
import { ShapesManager } from "./shapesManager";
import { MoveDirection } from "./moveDirection";
import { Entity } from "../entities/entity";
import { ScoreManager } from "./scoreManager";

export class App {

    readonly mainRenderer: Renderer;
    readonly nextRenderer: Renderer;

    readonly scoreManager: ScoreManager;
    readonly shapesManager: ShapesManager;

    readonly pausedContainer = document.getElementById("PausedContainer") as HTMLDivElement;
    readonly gameOverContainer = document.getElementById("GameOverContainer") as HTMLDivElement;

    private updateInterval: NodeJS.Timeout;
    private gamePaused: boolean;
    private gameInProgress: boolean;

    private intervalTime: number;

    constructor() {

        this.mainRenderer = new Renderer("GameCanvas");
        this.nextRenderer = new Renderer("NextCanvas");

        this.scoreManager = new ScoreManager();
        this.shapesManager = new ShapesManager(
            (score) => this.ChangeScore(score),
            (entites) => this.RenderNext(entites),
            () => this.GameOver());
            

        window.addEventListener('keydown', (e) => this.KeysHandling(e));
        this.StartGame();
    }

    StartGame(){
        this.gamePaused = false;
        this.pausedContainer.style.display = 'None';
        this.gameOverContainer.style.display = 'None';

        this.gameInProgress = true;

        this.intervalTime = 1000;
        this.updateInterval = setInterval(() => this.LogicUpdate(), this.intervalTime);

        this.shapesManager.StartGenerating();
        this.RenderBlocks();
    }

    LogicUpdate(){
        if(!this.gameInProgress){
            clearInterval(this.updateInterval);
            return;
        }

        this.shapesManager.MoveShape('Down');
        this.RenderBlocks();
    }

    private MoveCurrentShape(moveDirection: MoveDirection){
        this.shapesManager.MoveShape(moveDirection);
        this.RenderBlocks();

        if(moveDirection == 'Down')
            this.ResetInterval();
    }

    private KeysHandling(e: KeyboardEvent){
        if(!this.gameInProgress){
            if(e.keyCode == 82){
                this.StartGame();
            }
            return;
        }

        if(e.keyCode == 80){
            this.TogglePause();
            return;
        }

        if(this.gamePaused) return;

        switch(e.keyCode){
            case 82:
                this.shapesManager.RotateShape();
            case 40:
            case 83:
                this.MoveCurrentShape('Down');
                break;
            case 39:
            case 68:
                this.MoveCurrentShape('Right');
                break;
            case 37:
            case 65:
                this.MoveCurrentShape('Left');
                break;
        }
    }

    private ResetInterval(){
        clearInterval(this.updateInterval);
        this.updateInterval = setInterval(() => this.LogicUpdate(), this.intervalTime);
    }

    private RenderBlocks(){
        this.mainRenderer.ClearRenderer();
        this.mainRenderer.RenderEntites(this.shapesManager.GetEntities());
    }

    private RenderNext(entites: Entity[]){
        this.nextRenderer.ClearRenderer();
        this.nextRenderer.RenderEntites(entites);
    }

    private ChangeScore(scoreChange: number){
        this.scoreManager.UpdateScore(scoreChange);

        this.intervalTime = Math.max(1000 - (Math.floor(this.scoreManager.GetScore() / 10)), 100);
    }

    private GameOver(){
        this.gameInProgress = false;
        this.scoreManager.GameEnd();

        this.shapesManager.ClearManager();
        this.gameOverContainer.style.display = 'Flex';
    }

    private TogglePause(){
        if(this.gamePaused){
            this.gamePaused = false;
            this.pausedContainer.style.display = 'None';

            this.updateInterval = setInterval(() => this.LogicUpdate(), this.intervalTime);
        }
        else{
            this.gamePaused = true;
            this.pausedContainer.style.display = 'Flex';

            clearInterval(this.updateInterval);
        }
    }
}