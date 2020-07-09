import { Vector2 } from "../math/vector2";
import { Entity } from "./entity";
import { ShapeType } from "./shapeType";
import { Block } from "./block";
import { EmptyBlock } from "./emptyBlock";

export class Shape extends Entity{

    blocks: Entity[][];

    constructor(
        index: number,
        position: Vector2,
        private shapeType: ShapeType
    ){
        super(index, position);

        const shapeMatrix = this.GetShapeMatrix();
        this.blocks = [];

        let blockIndex = 0;
        for(let i = 0; i < shapeMatrix.length; i++){
            const shapeArray = shapeMatrix[i];

            let array: Entity[] = [];
            this.blocks.push(array);

            for (let k = 0; k < shapeArray.length; k++){
                const shapeValue = shapeArray[k];

                const position = new Vector2(this.position.x + k * 40, this.position.y + i * 40);

                if(shapeValue == 1){
                    array.push(new Block(blockIndex, position, new Vector2(40, 40), "#000", "#FFF"));
                }
                else{
                    array.push(new EmptyBlock(blockIndex, position));
                }
                blockIndex++;
            }
        }
    }

    DropPosition(){
        this.position.y += 40;

        for(let i = 0; i < this.blocks.length; i++){
            for (let k = 0; k < this.blocks[i].length; k++){
                var block = this.blocks[i][k] as Block;
                if(block instanceof Block){
                    const position = new Vector2(this.position.x + k * 40, this.position.y + i * 40);
                    block.UpdatePositon(position);
                }
            }
        }
    }

    DrawEntity(context: CanvasRenderingContext2D){
        for(let i = 0; i < this.blocks.length; i++){
            for (let k = 0; k < this.blocks[i].length; k++){
                this.blocks[i][k].DrawEntity(context);
            }
        }
    }

    private GetShapeMatrix(): number[][]{
        switch(this.shapeType){
            case 'I':
                return [
                    [0, 1, 0],
                    [0, 1, 0],
                    [0, 1, 0],
                ];
            case 'L':
                return [
                    [0, 1, 0],
                    [0, 1, 0],
                    [0, 1, 1],
                ];
            case 'Bolt':
                return [
                    [1, 0, 0],
                    [1, 1, 0],
                    [0, 1, 0],
                ];
            case 'Podium':
                return [
                    [0, 0, 0],
                    [0, 1, 0],
                    [1, 1, 1],
                ];
            case 'Cube':
                return [
                    [1, 1],
                    [1, 1],
                ];
        }
    }
}