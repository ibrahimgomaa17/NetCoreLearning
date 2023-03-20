import { User } from "./user";
import { AppInjector } from "../app.module";
import { AccountService } from "../_services/account.service";
import { PagiantionParams } from "./paginationParams";
export class UserParams extends PagiantionParams{
    gender:string;
    minAge =18;
    maxAge = 99;
    constructor(){
        super();
        const accountService = AppInjector.get(AccountService);
        accountService.currentUser$.subscribe(x=>{
            this.gender = x.gender === 'female'?'male':'female';
        })
       
    };
    orderBy = 'LastActive';
}