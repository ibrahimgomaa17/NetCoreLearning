import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  constructor(private memberService: MembersService) { }
  ngOnInit(): void {
    //  this.members$ = this.memberService.getMembers();
    this.loadMembers(this.pageNumber, this.pageSize);
  }
  members: Member[];
  pageNumber: number = 1;
  pageSize: number = 5;
  pagination: Pagination;
  loadMembers(pageNumber, itemsPerPage) {
    this.memberService.getMembers(pageNumber, itemsPerPage).pipe(take(1)).subscribe(s => {
      this.members = s.result;
      this.pagination = s.pagination;
    });
  }
  handlePageEvent(e:PageEvent){
    this.loadMembers(e.pageIndex+1, e.pageSize);
  }
}
