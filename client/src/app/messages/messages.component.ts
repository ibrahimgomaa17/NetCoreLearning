import { Component, OnInit } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { MessageParams } from '../_models/messageParams';
import { Message } from '../_models/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageParams = new MessageParams();
   
    this.fetchContainer("Unread");
  }
  messageParams: MessageParams;
  messages: Message[] = [];
  fetchContainer(container: string): void {
    this.messageParams.container = container;
    this.messageService.getMessages(this.messageParams).subscribe(data => {
      console.log(data);
      this.messages = data.result;
    })
  }
}
