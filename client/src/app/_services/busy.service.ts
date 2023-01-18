import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount: number = 0;
  constructor(private spinnerservice: NgxSpinnerService) { }
  busy() {
    this.busyRequestCount++;
    this.spinnerservice.show(undefined,{
      type:'line-scale',
      bdColor:'rgba(255,255,255, 1)',
      color:'#000',
    });
  }
  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0
      this.spinnerservice.hide();
    }
  }
}
