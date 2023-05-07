import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { map, Observable, sample } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit {
  constructor(private memberService: MembersService, private route: ActivatedRoute, private messageService: MessageService) { }
  @ViewChild('messageForm') messageForm:NgForm;
  galleryOptions: NgxGalleryOptions[] | any;
  galleryImages: NgxGalleryImage[] | any;
  member$: Observable<Member> | undefined
  member: Member | any;
  messageThread$;
  message:string | undefined;
  messages:Message[];
  ngOnInit(): void {
    this.loadMember();

  }
  loadMember() {
    let username = this.route.snapshot.paramMap.get("username");
    this.messageThread$ = this.messageService.getMessageThread(username);

    const newLocal = this;
    if (username) {
      this.member$ = newLocal.memberService.getMember(username);
      this.member$.subscribe(x => { this.member = x; this.galleryImages = x?.photos.map(n => ({ small: n.url, medium: n.url, big: n.url })) });
      this.galleryOptions = [
        {
          width: '600px',
          height: '400px',
          thumbnailsColumns: 4,
          arrowPrevIcon: 'fa fa-chevron-left',
          arrowNextIcon: 'fa fa-chevron-right',
          imageAnimation: NgxGalleryAnimation.Slide
        },
        // max-width 800
        {
          breakpoint: 800,
          width: '100%',
          height: '600px',
          imagePercent: 80,
          thumbnailsPercent: 20,
          thumbnailsMargin: 20,
          thumbnailMargin: 20
        },
        // max-width 400
        {
          breakpoint: 400,
          preview: false
        }
      ];
      this.fetchMessages(username);
    }
  }

  sendMessage() {
    this.messageForm;
    this.messageService.sendMessage({
      recipientUsername: this.member.username,
      content: this.message
    }).subscribe(s => {
      this.messages.push(s);
      this.messageForm.reset();
    })
  }
  fetchMessages(username){
    this.messageService.getMessageThread(username).subscribe(x => {
      this.messages = x;
    })
  }


}
