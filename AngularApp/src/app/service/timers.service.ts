import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eleve } from '../model/eleve';


@Injectable({
  providedIn: 'root'
})
export class TimersService {
  private url:string = "http://localhost:3000/timer/";
  constructor(private http:HttpClient) { }

  getTimer():Observable<Eleve>{
    return this.http.get<Eleve>(this.url, {withCredentials: true});
  }
  createTimer(eleve:Eleve):Observable<Eleve>{
    return this.http.post<Eleve>(this.url, eleve, {withCredentials: true});
  }
  updateProduct(eleve: Eleve): Observable<Eleve> {
    return this.http.put<Eleve>(this.url + eleve._id, eleve, { withCredentials: true });
  }

  deleteTimer(eleve:Eleve):Observable<Eleve>{
    return this.http.delete<Eleve>(this.url + eleve._id, {withCredentials: true});
  }

  getTimerCookieName():Observable<any>{
    return this.http.get(this.url+"session", {withCredentials: true});
  }
  getById(id:string):Observable<Eleve>{
    return this.http.get<Eleve>(this.url + id, {withCredentials: true});
  }
}
