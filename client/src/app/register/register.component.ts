import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
model:any = {};
  constructor(private accountService:AccountService,private toastr: ToastrService) { }
  @Output() cancelRegister = new EventEmitter();
  ngOnInit(): void {
  }
  register(){
    this.accountService.register(this.model).subscribe(s => console.log(s),err=>{
      this.toastr.error(err);
    });
    console.log(this.model);
  }

  cancel(){
    this.cancelRegister.emit(true);
  }
  
}
