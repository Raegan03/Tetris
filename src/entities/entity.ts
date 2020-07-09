import { Vector2 } from "../math/vector2";

export class Entity{

    constructor(
        public index: number,
        protected position: Vector2
    ){}

    DrawEntity(context: CanvasRenderingContext2D){}
}