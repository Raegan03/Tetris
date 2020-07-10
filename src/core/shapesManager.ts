import { Shape } from "../entities/shape";
import { ShapeType } from "../entities/shapeType";
import { MathHelper } from "../math/mathHelper";
import { Vector2 } from "../math/vector2";
import { Entity } from "../entities/entity";
import { Block } from "../entities/block";
import { MoveDirection } from "./moveDirection";
import { Physic } from "../math/physic";

export class ShapesManager{

    readonly minMaxCanvasX = new Vector2(0, 400);
    readonly minMaxCanvasY = new Vector2(0, 800);

    readonly blockSize = new Vector2(40, 40);

    readonly boardColumns = 10;
    readonly boardRows = 20;

    private nextShape: Shape;
    private currentShape: Shape;

    private boardMatrix: Entity[][];
    
    constructor(){
        this.boardMatrix = [];
        for(let col = 0; col < 10; col++){
            this.boardMatrix[col] = [];
            for(let row = 0; row < 20; row++){
                this.boardMatrix[col][row] = null;
            }
        }
    }

    StartGenerating(){
        this.currentShape = new Shape(this.GetRandomPosition(), this.GetRandomShapeType());
        this.nextShape = new Shape(this.GetRandomPosition(), this.GetRandomShapeType());

        this.DrawShapeOnBoard();
    }

    GetEntities(): Entity[]{
        let entites = [];
        for(let col = 0; col < this.boardMatrix.length; col++){
            for(let row = 0; row < this.boardMatrix[col].length; row++){
                if(this.boardMatrix[col][row] != null)
                    entites.push(this.boardMatrix[col][row]);
            }
        }
        return entites;
    }

    MoveShape(moveDirection: MoveDirection){
        if(!this.CheckShapeMove(moveDirection)) return;

        let moveOffset;
        switch(moveDirection){
            case 'Down':
                moveOffset = new Vector2(0, 1);
                break;
            case 'Right':
                moveOffset = new Vector2(1, 0);
                break;
            case 'Left':
                moveOffset = new Vector2(-1, 0);
                break;
        }

        this.EraseShapeFromBoard();
        this.currentShape.MoveShape(moveOffset);
        this.DrawShapeOnBoard();

        if(Physic.CheckCollisionDown(this.currentShape, this.boardMatrix)){
            this.PushNextShape();
        }
    }

    RotateShape(){
        if(!this.CheckRotate()) return;

        this.EraseShapeFromBoard();
        this.currentShape.RotateShape();
        this.DrawShapeOnBoard();
    }

    private PushNextShape(){
        this.CheckForScore();

        this.currentShape = this.nextShape;
        this.nextShape = new Shape(this.GetRandomPosition(), this.GetRandomShapeType());
    }

    private CheckForScore(){
        for(let row = 0; row < this.boardRows; row++){
            for(let col = 0; col < this.boardColumns; col++){
                if(this.boardMatrix[col][row] == null)
                    break;

                if(col + 1 == this.boardColumns){
                    this.EraseRow(row);
                    return;
                }
            }
        }
    }

    private EraseRow(eraseRowIndex: number){
        if(eraseRowIndex < 0) return;

        for(let col = 0; col < this.boardColumns; col++){
            this.boardMatrix[col][eraseRowIndex] = null;
        }

        for(let row = eraseRowIndex - 1; row >= 0; row--){
            for(let col = 0; col < this.boardColumns; col++){
                if(this.boardMatrix[col][row] == null)
                    continue;

                const temp = this.boardMatrix[col][row];
                this.boardMatrix[col][row + 1] = temp;

                const position = new Vector2(col * this.blockSize.x, (row + 1) * this.blockSize.y);
                (temp as Block).SetPositon(position);

                this.boardMatrix[col][row] = null;
            }
        }

        this.CheckForScore();
    }

    private EraseShapeFromBoard(){
        const position = this.currentShape.GetPosition();
        const size = this.currentShape.GetSize();
        const shape = this.currentShape.GetShape();

        const colStart = position.x;
        const rowStart = position.y;

        for(let col = colStart; col < colStart + size.x; col++){
            if(col < 0 || col >= this.boardMatrix.length)
                continue;

            for(let row = rowStart; row < Math.min(rowStart + size.y, 20); row++){
                if(row < 0 || row >= this.boardMatrix[col].length ||
                    shape[col - colStart][row - rowStart] == 0)
                    continue;
                
                this.boardMatrix[col][row] = null;
            }
        }
    }

    private DrawShapeOnBoard(){
        const position = this.currentShape.GetPosition();
        const size = this.currentShape.GetSize();
        const shape = this.currentShape.GetShape();

        const fillColour = this.currentShape.GetFillColour();
        const strokeColour = this.currentShape.GetStrokeColour();

        const colStart = position.x;
        const rowStart = position.y;

        for(let col = colStart; col < colStart + size.x; col++){
            if(col < 0 || col >= this.boardMatrix.length)
                continue;

            for(let row = rowStart; row < rowStart + size.y; row++){
                if((row < 0 || row >= this.boardMatrix[col].length) ||
                    shape[col - colStart][row - rowStart] == 0)
                    continue;

                const position = new Vector2(col * this.blockSize.x, row * this.blockSize.y);
                this.boardMatrix[col][row] = new Block(position, this.blockSize, fillColour, strokeColour);
            }
        }
    }

    private CheckShapeMove(moveDirection: MoveDirection): boolean{
        switch(moveDirection){
            case 'Down':
                return !Physic.CheckCollisionDown(this.currentShape, this.boardMatrix);
            case 'Right':
                return !Physic.CheckCollisionRight(this.currentShape, this.boardMatrix);
            case 'Left':
                return !Physic.CheckCollisionLeft(this.currentShape, this.boardMatrix);
        }
    }

    private CheckRotate(): boolean{
        const position = this.currentShape.GetPosition();
        const size = this.currentShape.GetSize();

        if(position.x < 0 || position.x + size.x > this.boardColumns) return false;
        if(position.y + size.y >= this.boardRows) return false;

        return true;
    }

    private GetRandomPosition(): Vector2{
        return new Vector2(MathHelper.RandomRange(3, 5), -3);
    }

    private GetRandomShapeType(): ShapeType{
        const randomValue = MathHelper.RandomRange(1, 5);

        switch(randomValue){
            case 1:
                return 'I';
            case 2:
                return 'L';
            case 3:
                return 'Bolt';
            case 4:
                return 'Podium';
            case 5:
                return 'Cube';
        }

        return 'I';
    }
}