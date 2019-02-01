import {Piece} from './piece';
export class Appointment{
    constructor(public type:string,public start:Date,public end:Date,public program:Piece[], public comment:string){

    }
}