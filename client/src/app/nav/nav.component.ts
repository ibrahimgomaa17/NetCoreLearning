import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  model: any = {}
  showNav: boolean = false;
  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }


  login() {
    this.accountService.login(this.model).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigateByUrl('/members');
        this.showNav = false;
      },
      error: (err) => {
        console.log(err)
        this.toastr.error(err.error);
      },
      complete() {
        console.log('completed');
      },
    })
  }
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.showNav = false;
  }
  logData(x:any){
    console.log(x); 
    
  }

}
