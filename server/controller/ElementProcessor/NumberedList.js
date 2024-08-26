import { ElementHandler } from "./ElementHandler.js";

export class NumberedList extends ElementHandler{
    handle(child, parentId){
        console.log(child)
    }
}