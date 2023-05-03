import { Injectable } from '@angular/core';
import { AppInjector } from '../app.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor() { }
  http: HttpClient = AppInjector.get(HttpClient);

  baseUrl = environment.apiUrl;


   getPaginationResult<T>(params: HttpParams, url) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: "response", params }).pipe(map(x => {
      paginatedResult.result = x.body;
      if (x.headers.get('Pagination') != null)
        paginatedResult.pagination = JSON.parse(x.headers.get('Pagination'));

      return paginatedResult;
    }));
  }

 getParams(UserParams: UserParams) {
    let params = new HttpParams();
    params = params.append("pageNumber", UserParams.pageNumber);
    params = params.append("pageSize", UserParams.pageSize);
    params = params.append('minAge', UserParams.minAge);
    params = params.append('maxAge', UserParams.maxAge);
    params = params.append('gender', UserParams.gender);
    params = params.append('orderBy', UserParams.orderBy);
    return params;
  }
}
