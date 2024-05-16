import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable} from 'rxjs';
import { Tax } from '../models/tax.model';
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class TaxServiceService {

  headers = new HttpHeaders({'Content-Type': 'application/json'});
  options = {headers: this.headers};
  private test?: Tax;
  readonly rootUrl = environment.apiUrl;




  private _url:string = this.rootUrl + '/Tax';
  constructor(private http: HttpClient) { }



  getSalary(test: any) {



    return this.http.post<Tax>(this._url, test, this.options)
  }
}
