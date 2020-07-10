export module MathHelper{
    export function RandomRange(min: number, max: number): number{
        return Math.floor(Math.random() * max) + min;
    }
}