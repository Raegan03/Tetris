import { Vector2 } from "../math/vector2";
import { ShapeType } from "./shapeType";

export class Shape{

    private shapeBlocks: number[][];
    private fillColour: string;
    private strokeColour: string;

    constructor(
        private position: Vector2,
        private shapeType: ShapeType
    ){
        this.shapeBlocks = this.GetShapeMatrix();
        this.fillColour = this.SelectFillColour();
        this.strokeColour = "#FFF";
    }

    GetFillColour(): string{
        return this.fillColour;
    }

    GetStrokeColour(): string{
        return this.strokeColour;
    }

    GetShape(): number[][]{
        return this.shapeBlocks;
    }

    GetSize(): Vector2{
        return new Vector2(this.shapeBlocks.length, this.shapeBlocks.length);
    }

    GetPosition(): Vector2{
        return this.position;
    }

    SetPosition(position: Vector2){
        this.position = position;
    }

    MoveShape(move: Vector2){
        this.position.y += move.y;
        this.position.x += move.x;
    }

    RotateShape(){
        const n = this.shapeBlocks.length;
        for (let x = 0; x < n / 2; x++) { 
            for (let y = x; y < n - x - 1; y++) { 
                let temp = this.shapeBlocks[x][y]; 
  
                this.shapeBlocks[x][y] = this.shapeBlocks[y][n-1-x]; 
                this.shapeBlocks[y][n-1-x] = this.shapeBlocks[n - 1 - x][n - 1 - y]; 
  
                this.shapeBlocks[n - 1 - x][n - 1 - y] =
                this.shapeBlocks[n - 1 - y][x]; 
  
                this.shapeBlocks[n - 1 - y][x] = temp; 
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

    private SelectFillColour(): string{
        switch(this.shapeType){
            case 'I':
                return "#00CED1";
            case 'L':
                return "#D2691E";
            case 'Bolt': 
                return "#DC143C";
            case 'Podium': 
                return "#EE82EE";
            case 'Cube':
                return "#A0522D";
        }
    }
}