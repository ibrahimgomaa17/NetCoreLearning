import { User } from "./user";
import { AppInjector } from "../app.module";
import { AccountService } from "../_services/account.service";
export class UserParams{
    gender:string;
    minAge =18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 5;
    constructor(){
        const accountService = AppInjector.get(AccountService);
        accountService.currentUser$.subscribe(x=>{
            this.gender = x.gender === 'female'?'male':'female';
        })
       
    };
    orderBy = 'LastActive';
}