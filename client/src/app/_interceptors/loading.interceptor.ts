import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken
} from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BusyService } from '../_services/busy.service';
export const BYPASS_LOG = new HttpContextToken(() => false);

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busyService: BusyService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.context.get(BYPASS_LOG) === false)
      this.busyService.busy();
    return next.handle(request).pipe(delay(1000), finalize(() => {
      this.busyService.idle();
    }));
  }
}
