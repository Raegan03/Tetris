import { Shape } from "../entities/shape";
import { ShapeType } from "../entities/shapeType";
import { MathHelper } from "../math/mathHelper";
import { Vector2 } from "../math/vector2";
import { Entity } from "../entities/entity";
import { Block } from "../entities/block";
import { MoveDirection } from "./moveDirection";
import { Physic } from "../math/physic";

export class ShapesManager{

    readonly blockSize = new Vector2(40, 40);

    readonly boardColumns = 10;
    readonly boardRows = 20;

    private nextShape: Shape;
    private currentShape: Shape;

    private boardMatrix: Entity[][];

    readonly scoreIncrease: (scoreChange: number) => void;
    readonly nextSelected: (nextEntities: Entity[]) => void;
    readonly gameOver: () => void;
    
    constructor(
        scoreIncrease: (scoreChange: number) => void,
        nextSelected: (nextEntities: Entity[]) => void,
        gameOver: () => void){

        this.boardMatrix = [];
        for(let col = 0; col < this.boardColumns; col++){
            this.boardMatrix[col] = [];
            for(let row = 0; row < this.boardRows; row++){
                this.boardMatrix[col][row] = null;
            }
        }

        this.scoreIncrease = scoreIncrease;
        this.nextSelected = nextSelected;
        this.gameOver = gameOver;
    }

    StartGenerating(){
        this.currentShape = new Shape(this.GetRandomPosition(), this.GetRandomShapeType());
        this.nextShape = new Shape(this.GetRandomPosition(), this.GetRandomShapeType());

        this.DrawNextShape();
        this.DrawShapeOnBoard();
    }

    ClearManager(){
        this.currentShape = null;
        this.nextShape = null;

        this.boardMatrix = [];
        for(let col = 0; col < this.boardColumns; col++){
            this.boardMatrix[col] = [];
            for(let row = 0; row < this.boardRows; row++){
                this.boardMatrix[col][row] = null;
            }
        }
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

        if(this.currentShape.GetPosition().y <= 0)
        {
            this.gameOver();
            return;
        }

        this.currentShape = this.nextShape;
        this.nextShape = new Shape(this.GetRandomPosition(), this.GetRandomShapeType());

        this.DrawNextShape();
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

        this.scoreIncrease(100);
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

    private DrawNextShape(){
        const size = this.nextShape.GetSize();
        const shape = this.nextShape.GetShape();

        const fillColour = this.nextShape.GetFillColour();
        const strokeColour = this.nextShape.GetStrokeColour();

        let entities = [];

        for(let col = 0; col < size.x; col++){
            for(let row = 0; row < size.y; row++){
                if(shape[col][row] == 0)
                    continue;

                    const position = new Vector2(col * this.blockSize.x, row * this.blockSize.y);
                    entities.push(new Block(position, this.blockSize, fillColour, strokeColour));
            }
        }
        this.nextSelected(entities);
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
        return new Vector2(MathHelper.RandomRange(0, 5), -3);
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