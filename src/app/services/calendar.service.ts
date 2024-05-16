import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Calendar } from "../models/calendar.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  readonly rootUrl = environment.apiUrl + '/Calendar/getCandidates';
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  options = { headers: this.headers };

  constructor(private http: HttpClient) { }

  getCandidates(date: string) {
    return this.http.get<Calendar[]>(`${this.rootUrl}/${date}`, this.options);
  }

}
