import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent implements OnInit {

  constructor(private memberService:MembersService, private toaster:ToastrService, private messageService:MessageService) { }
  @Input() member:Member | undefined
  ngOnInit(): void {
  }

  addLike(member:Member){
    this.memberService.addLike(member.username).subscribe(x=>{
      this.toaster.success("you have liked "+ member.knownAs);
    }, error=>{
      this.toaster.error(error.error);
      
    });
  }
  messageMember(){
    this.messageService.messageMember.next(this.member);
  }
}
