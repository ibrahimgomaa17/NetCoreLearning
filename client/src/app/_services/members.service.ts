import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LikeParams } from '../_models/likeParams';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  userParams:UserParams = new UserParams();
  constructor(private http: HttpClient) { }
  getUserParams(){
    return this.userParams;
  }
  setUserParams(userParams:UserParams){
    this.userParams = userParams;
  }
  getMembers(UserParams: UserParams) {
    this.userParams = this.userParams;
    let key = Object.values(this.userParams).join('_');
    if (this.memberCache.get(key))
      return of(this.memberCache.get(key));
    let params = this.getParams(this.userParams);
    return this.getPaginationResult<Member[]>(params, this.baseUrl + 'users').pipe(map(x => {
      let nkey = Object.values(this.userParams).join('_');
      this.memberCache.set(nkey, x);
      return x;
    }));
  }
  addLike(username:string){
   return this.http.post(this.baseUrl + 'likes/'+ username, {});
  }
  getLikes(likeParams:LikeParams){
    let params = new HttpParams();
    params = params.append("pageNumber", likeParams.pageNumber);
    params = params.append("pageSize", likeParams.pageSize);
    params = params.append("predicate", likeParams.predicate);
    return this.getPaginationResult<Partial<Member[]>>(params, this.baseUrl + 'likes');
  }

  private getPaginationResult<T>(params: HttpParams, url) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: "response", params }).pipe(map(x => {
      paginatedResult.result = x.body;
      if (x.headers.get('Pagination') != null)
        paginatedResult.pagination = JSON.parse(x.headers.get('Pagination'));

      return paginatedResult;
    }));
  }

  private getParams(UserParams: UserParams) {
    let params = new HttpParams();
    params = params.append("pageNumber", UserParams.pageNumber);
    params = params.append("pageSize", UserParams.pageSize);
    params = params.append('minAge', UserParams.minAge);
    params = params.append('maxAge', UserParams.maxAge);
    params = params.append('gender', UserParams.gender);
    params = params.append('orderBy', UserParams.orderBy);
    return params;
  }

  getMember(user: string) {
    let member = [...this.memberCache.values()].reduce((x, y) => x.concat(y.result), [])?.find((x: Member) => x.username == user);
    if (member)
      return of(member);
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
