import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  constructor(private memberService: MembersService, private accountService:AccountService) { }
  ngOnInit(): void {
    this.loadMembers();
  }
  members: Member[];
  pageNumber: number = 1;
  pageSize: number = 5;
  pagination: Pagination;
  userParams:UserParams = new UserParams();
  loadMembers() {
    this.userParams = this.memberService.getUserParams();
    this.memberService.getMembers(this.userParams).pipe(take(1)).subscribe(s => {
      this.members = s.result;
      this.pagination = s.pagination;
    });
  }
  handlePageEvent(e:PageEvent){
    this.userParams.pageNumber = e.pageIndex+1;
    this.loadMembers();
  }
  filter(){
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }
  resetFilter(){
    this.userParams = new UserParams();
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }
}
