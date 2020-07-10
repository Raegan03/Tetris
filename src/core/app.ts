import { Renderer } from "./renderer";
import { ShapesManager } from "./shapesManager";
import { MoveDirection } from "./moveDirection";

export class App {

    readonly renderer: Renderer;
    readonly shapesManager: ShapesManager;

    private updateInterval: NodeJS.Timeout;

    constructor() {

        this.renderer = new Renderer();
        this.shapesManager = new ShapesManager();

        window.addEventListener('keydown', (e) => this.KeysHandling(e));

        this.StartGame();
    }

    StartGame(){
        this.shapesManager.StartGenerating();
        this.updateInterval = setInterval(() => this.LogicUpdate(), 1000);

        this.RenderBlocks();
    }

    LogicUpdate(){
        this.shapesManager.MoveShape('Down');
        console.log('Logic Update');

        this.RenderBlocks();
    }

    private MoveCurrentShape(moveDirection: MoveDirection){
        console.log("Direction " + moveDirection);

        this.shapesManager.MoveShape(moveDirection);
        this.RenderBlocks();

        if(moveDirection == 'Down')
            this.ResetInterval();
    }

    private KeysHandling(e: KeyboardEvent){
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
        this.updateInterval = setInterval(() => this.LogicUpdate(), 1000);
    }

    private RenderBlocks(){
        this.renderer.ClearRenderer();
        this.renderer.RenderEntites(this.shapesManager.GetEntities());
    }
}