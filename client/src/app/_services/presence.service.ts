import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection : HubConnection;
  constructor(private toastr:ToastrService) { }
  createHubConnection(user:User){
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + 'presence', {accessTokenFactory:() => user.token}).withAutomaticReconnect().build();
    this.hubConnection.start().catch(error=> console.log(error));
    this.hubConnection.on('UserIsOnline', username =>{
      this.toastr.info(username + 'has connnecteed');
    });
    this.hubConnection.on('UserIsOffLine', username =>{
      this.toastr.warning(username + 'has disconnnecteed');
    })
  }
  stopHubConnection(){
    this.hubConnection.stop().catch(err=> console.log(err));
  }
}