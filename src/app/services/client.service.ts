import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Client, Page } from '../models/client.model';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  readonly rootUrl = `${environment.apiUrl}/client`;
  headers = new HttpHeaders({'Content-Type': 'application/json'});
  options = {headers: this.headers};

  constructor(private http: HttpClient) { }

  get(url: string):Observable<Page> {
    return this.http.get<Page>(this.rootUrl + url, this.options);
  }

  update(clientId?:number,client?: Client):Observable<Client> {
    return this.http.patch<Client>(`${this.rootUrl}/${clientId}`, client, this.options);
  }

  create(client: Client):Observable<Client> {
    return this.http.post<Client>(this.rootUrl, client,this.options);
  }

  delete(clientId?:number) {
    return this.http.delete<Client>(`${this.rootUrl}/${clientId}`, this.options);
  }

  deleteClientCandidate(clientId?:number, clientCandidateId?:number) {
    return this.http.delete<Client>(`${this.rootUrl}/${clientId}/${clientCandidateId}`, this.options);
  }

  deleteMany(clientsId?: any) {
    return this.http.post(`${this.rootUrl}/delete/clients`, clientsId,this.options);
  }

}
