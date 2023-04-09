import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BYPASS_LOG } from '../_interceptors/loading.interceptor';
import { Message } from '../_models/message';
const headerDict = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const requestOptions = {                                                                                                                                                                                 
  headers: new Headers(headerDict), 
};
@Injectable({
  providedIn: 'root'
})

export class MessageService {
  
  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl;
  messageMember = new Subject();
  messageMember$ = this.messageMember.asObservable();
  getMessages(id){

    return this.http.get<Message[]>(this.baseUrl + 'Message/'+ id, { context: new HttpContext().set(BYPASS_LOG, true) });
  }
  sendMessages(id, message, username){
    let data = {
      message: message,
      recieverId: id,
      recieverName:username
    }
  return  this.http.post(this.baseUrl + 'Message/send',data, { context: new HttpContext().set(BYPASS_LOG, true) });
  }
}
