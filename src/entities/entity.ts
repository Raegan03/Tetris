import { Vector2 } from "../math/vector2";

export class Entity{

    constructor(
        protected position: Vector2
    ){}

    DrawEntity(context: CanvasRenderingContext2D){}
}