import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { Message } from '../_models/message';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { MessageService } from '../_services/message.service';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor(private messageService: MessageService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.messageService.messageMember$.subscribe((x: Member) => {
      this.otherMember = x;
      this.open = true;
      this.getMessages(this.otherMember.id);
    });
    this.accountService.currentUser$.subscribe(x => {
      this.user = x;
      console.log(this.user );
    })

    const connection = new signalR.HubConnectionBuilder()  
      .configureLogging(signalR.LogLevel.Information)  
      .withUrl('https://localhost:5001/message')  
      .build();  
  
    connection.start().then(function () {  
      console.log('SignalR Connected!');  
    }).catch(function (err) {  
      return console.error(err.toString());  
    });  
  
    connection.on("SendMessage", () => {  
      this.getMessages(this.otherMember.id);
    });  

  }
  open: boolean = false;
  otherMember: Member;
  user: User;
  messages:Message[] = [];
  message;

  sendMessage() {
    this.messageService.sendMessages(this.otherMember.id, this.message, this.otherMember.username).subscribe((x:Message) => {
       this.messages.push(x);
       this.message = '';
    })
  }
  getMessages(id) {
    this.messageService.getMessages(id).subscribe((x) => {
      this.messages = x;
    });
  }

}
