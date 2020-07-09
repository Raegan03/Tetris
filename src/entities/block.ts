import { Entity } from "./entity";
import { Vector2 } from "../math/vector2";

export class Block extends Entity{
    constructor(
        index: number,
        position: Vector2,
        private size: Vector2,
        private fillColour: string,
        private strokeColour: string
    ){
        super(index, position);
    }

    UpdatePositon(positon: Vector2){
        this.position = positon;
    }

    DrawEntity(context: CanvasRenderingContext2D){
        context.beginPath();
        context.rect(this.position.x, this.position.y, this.size.x, this.size.y);
        context.fillStyle = this.fillColour;
        context.fill();
        context.closePath();

        context.beginPath();
        context.moveTo(this.position.x, this.position.y);
        context.lineTo(this.position.x + this.size.x, this.position.y);

        context.moveTo(this.position.x + this.size.x, this.position.y);
        context.lineTo(this.position.x + this.size.x, this.position.y + this.size.y);

        context.moveTo(this.position.x + this.size.x, this.position.y + this.size.y);
        context.lineTo(this.position.x, this.position.y + this.size.y);

        context.moveTo(this.position.x, this.position.y + this.size.y);
        context.lineTo(this.position.x, this.position.y);

        context.strokeStyle = this.strokeColour;
        context.stroke();
    }
}