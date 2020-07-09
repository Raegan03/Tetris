import { Entity } from "../entities/entity";
import { Vector2 } from "../math/vector2";

export class Renderer{

    readonly rendererCanvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
    readonly rendererContext = this.rendererCanvas.getContext("2d") as CanvasRenderingContext2D;

    constructor(){
    }

    GetCanvasSize(): Vector2{
        return new Vector2(this.rendererCanvas.width, this.rendererCanvas.height);
    }

    RenderEntites(entites: Entity[]){
        for (let i = 0; i < entites.length; i++){
            entites[i].DrawEntity(this.rendererContext);
        }
    }

    ClearRenderer(){
        this.rendererContext.clearRect(0, 0, this.rendererCanvas.width, this.rendererCanvas.height);

        this.rendererContext.fillStyle = "#333";
        this.rendererContext.fillRect(0, 0, this.rendererCanvas.width, this.rendererCanvas.height);
        this.rendererContext.fill();

        for (let col = 0; col < 11; col++){
            this.rendererContext.beginPath();
            this.rendererContext.moveTo(40 * col, 0);
            this.rendererContext.lineTo(40 * col, 800);
            this.rendererContext.strokeStyle = "#AAA";
            this.rendererContext.stroke();
        }

        for (let row = 0; row < 21; row++){
            this.rendererContext.beginPath();
            this.rendererContext.moveTo(0, 40 * row);
            this.rendererContext.lineTo(400, 40 * row);
            this.rendererContext.stroke();
        }
    }
}