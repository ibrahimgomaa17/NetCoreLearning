import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { LikeParams } from '../_models/likeParams';
import { Member } from '../_models/member';
import { Pagination } from '../_models/pagination';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  members: Partial<Member>[];
  pagination: Pagination;
  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.fetchMembers(this.likeParams);
  }
  likeParams = new LikeParams();
  fetchMembers(likeParams) {
    this.memberService.getLikes(likeParams).subscribe((x) => {
      this.members = x.result;
      this.pagination = x.pagination;
    });
  }
  handlePageEvent(e:PageEvent){
    this.likeParams.pageNumber = e.pageIndex+1;
    this.fetchMembers(this.likeParams);
  }
  toggleClick(predicate){
    this.likeParams = new LikeParams()
    this.likeParams.predicate = predicate;
    this.fetchMembers(this.likeParams);
  }

}
