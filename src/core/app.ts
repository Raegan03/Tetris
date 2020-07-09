import { Renderer } from "./renderer";
import { Block } from "../entities/block";
import { Vector2 } from "../math/vector2";
import { Shape } from "../entities/shape";

export class App {

    readonly renderer: Renderer;

    currentTime: number;
    currentShape: Shape;

    constructor() {

        this.renderer = new Renderer();

        this.StartGame();
    }

    StartGame(){
        window.requestAnimationFrame((t) => this.Update(t));
        window.setInterval(() => this.LogicUpdate(), 1000);
        this.currentShape = new Shape(0, new Vector2(0, 0), 'Bolt');
    }

    Update(t: number){
        this.renderer.ClearRenderer();

        this.renderer.RenderEntites([this.currentShape]);
        window.requestAnimationFrame((t) => this.Update(t));
    }

    LogicUpdate(){
        this.currentShape.DropPosition();
        console.log('Logic Update');
    }
}