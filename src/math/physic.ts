import { Vector2 } from "./vector2";
import { Shape } from "../entities/shape";
import { Entity } from "../entities/entity";

export module Physic{
    export function CheckCollisionDown(checkShape: Shape, boardMatrix: Entity[][]){
        const position = checkShape.GetPosition();
        const size = checkShape.GetSize();
        const shape = checkShape.GetShape();

        let downPositions = [];
        for(let col = 0; col < size.x; col++){
            for(let row = size.y - 1; row >= 0; row--){
                if(shape[col][row] != 0){
                    downPositions.push(new Vector2(col, row));
                    break;
                }
            }
        }

        for(let i = 0; i < downPositions.length; i++){
            var downPosition = downPositions[i];

            var row = downPosition.y + position.y;
            var col = downPosition.x + position.x;

            if(row + 1 == boardMatrix[0].length) return true;
            if(row < 0) return false;

            if(boardMatrix[col][row + 1] != null && 
                shape[downPosition.x][downPosition.y] != 0)
                return true;
        }

        return false;
    }

    export function CheckCollisionRight(checkShape: Shape, boardMatrix: Entity[][]){
        const position = checkShape.GetPosition();
        const size = checkShape.GetSize();
        const shape = checkShape.GetShape();

        let sideCol = 0;
        for(let col = size.x - 1; col >= 0; col--){
            for(let row = 0; row < size.y; row ++){
                if(shape[col][row] != 0){
                    sideCol = col;
                    break;
                }
            }

            if(sideCol == col)
                break;
        }

        sideCol += position.x;
        if(sideCol + 1 == boardMatrix.length) return true;

        const rowStart = position.y;

        const rightCol = boardMatrix[sideCol + 1];
        for (let row = rowStart; row < rowStart + size.y; row++){
            if(rightCol[row] != null && shape[sideCol - position.x][row - rowStart] != 0)
                return true;
        }

        return false;
    }

    export function CheckCollisionLeft(checkShape: Shape, boardMatrix: Entity[][]){
        const position = checkShape.GetPosition();
        const size = checkShape.GetSize();
        const shape = checkShape.GetShape();

        let sideCol = size.x;
        for(let col = 0; col < size.x; col++){
            for(let row = 0; row < size.y; row ++){
                if(shape[col][row] != 0){
                    sideCol = col;
                    break;
                }
            }

            if(sideCol == col)
                break;
        }

        sideCol += position.x;
        if(sideCol == 0) return true;

        const rowStart = position.y;

        const leftCol = boardMatrix[sideCol - 1];
        for (let row = rowStart; row < rowStart + size.y; row++){
            if(leftCol[row] != null && shape[sideCol - position.x][row - rowStart] != 0)
                return true;
        }

        return false;
    }
}