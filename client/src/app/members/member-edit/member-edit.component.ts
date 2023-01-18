import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') form!: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotifications($event: any) {
    if (this.form.dirty)
      $event.returnValue = true;
  }
  private _user: User | any;
  public get user(): User | any {
    return this._user;
  }
  public set user(value: User | any) {
    this._user = value;
  }
  member!: Member;
  constructor(private accountService: AccountService, private memberService: MembersService, private toaster: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(x => this.user = x);
  }

  ngOnInit(): void {
    this.loadMember();
  }
  loadMember() {
    this.memberService.getMember(this.user.username).pipe(take(1)).subscribe(x => this.member = x);
  }
  updateMember() {
    console.log(this.member);
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toaster.success("profile updated successfully");
      this.form.reset(this.member);
    });

  }
}
