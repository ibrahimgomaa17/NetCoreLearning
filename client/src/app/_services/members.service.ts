import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();
  constructor(private http: HttpClient) { }
  getMembers(pageNumber?: number, itemsPerPage?: number) {
    let params = new HttpParams();
    if (pageNumber && itemsPerPage) {
     params = params.append("pageNumber", pageNumber);
     params = params.append("pageSize", itemsPerPage);
    }
    return this.http.get<Member[]>(this.baseUrl + 'users', { observe: "response", params }).pipe(map(x => {
      this.paginatedResult.result = x.body;
      if (x.headers.get('Pagination') != null)
        this.paginatedResult.pagination = JSON.parse(x.headers.get('Pagination'));

      return this.paginatedResult;
    }))
  }
  getMember(user: string) {
    let member = this.members.find(x => x.username == user);
    if (member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + user);
  }
  updateMember(member: Member) {
    console.log(this.members);

    return this.http.put(this.baseUrl + 'users', member);
  }
  setMainPhoto(id: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + id, id);
  }
  deletePhoto(id: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + id);
  }
}
