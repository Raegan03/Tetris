import { Entity } from "./entity";
import { Vector2 } from "../math/vector2";

export class EmptyBlock extends Entity{
    constructor(
        index: number,
        position: Vector2      
    ){
        super(index, position);
    }
}