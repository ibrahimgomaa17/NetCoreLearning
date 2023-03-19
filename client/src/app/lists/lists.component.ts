import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  members: Partial<Member>[];
  predicate = 'liked'
  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.fetchMembers(this.predicate);
  }
  fetchMembers(predicate: string) {
    this.predicate = predicate;
    this.memberService.getLikes(predicate).subscribe((x) => {
      this.members = x;
    });
  }

}
