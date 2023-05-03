import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { MessageParams } from '../_models/messageParams';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends BaseService{

  constructor() {
    super();
  }

  getMessages(messageParams:MessageParams) {
    let params = new HttpParams();
    params = params.append("pageNumber", messageParams.pageNumber);
    params = params.append("pageSize", messageParams.pageSize);
    params = params.append("container", messageParams.container);
    return this.getPaginationResult<Partial<Message[]>>(params, this.baseUrl + 'messages');
  }


}
