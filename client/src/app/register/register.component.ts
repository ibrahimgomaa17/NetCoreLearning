import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
model:any = {};
  constructor(private accountService:AccountService) { }
  @Output() cancelRegister = new EventEmitter();
  ngOnInit(): void {
  }
  register(){
    this.accountService.register(this.model).subscribe(s=> console.log(s));
    console.log(this.model);
  }

  cancel(){
    this.cancelRegister.emit(true);
  }
  
}
