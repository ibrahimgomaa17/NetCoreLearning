import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private accountService:AccountService,private toastr: ToastrService, private fb:FormBuilder, private router:Router) { }
  @Output() cancelRegister = new EventEmitter();
  ngOnInit(): void {
    this.initiateForm();
  }
  initiateForm() {
    this.registerForm = this.fb.group({
      gender:['male',[]],
      username:['',[Validators.required, Validators.maxLength(10)]],
      knownAs:['',[Validators.required]],
      dateOfBirth:['',[Validators.required]],
      city:['',[Validators.required]],
      country:['',[Validators.required]],
      password:['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]],
      confirmPassword:['', this.matchValue('password')]
    });
  }
  matchValue(matchTo:any):ValidatorFn{
    return (control:AbstractControl)=>{
      return control?.value === (control?.parent?.controls as { [key: string]: AbstractControl })[matchTo].value?null:{matchingError:true}
    }
  }
  errorList = [];
  model:any = {};
  registerForm!:FormGroup;
  register(){
    this.accountService.register(this.registerForm.value).subscribe(s => {
      
      this.router.navigateByUrl("/members");

    },err=>{
      this.toastr.error(err);
      console.log(err);
      
      this.errorList = err.error.errors;
    });
    console.log(this.model);
  }

  cancel(){
    this.cancelRegister.emit(true);
  }
  
}


