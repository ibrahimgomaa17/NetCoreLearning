import { PagiantionParams } from "./paginationParams";
export class LikeParams extends PagiantionParams{
    constructor(){
        super();
    };
    predicate = 'liked';
}