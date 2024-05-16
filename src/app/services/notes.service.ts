
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Categories } from '../models/category.model';
import { Notes } from '../models/notes.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotesService {


  readonly rootUrl = environment.apiUrl;
  readonly noteUrl = this.rootUrl + '/Note';
  readonly categoryUrl = this.rootUrl + '/Category';

  postId: any;
  token: string = '';
  constructor(private https: HttpClient) { }

  getAllNotes(isPrivate: boolean) {

    if(isPrivate){
      this.token = String(localStorage.getItem("token"));
    }
    else{
      this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6InB1YmxpY18wMTIzNDU2Nzg5OTg3NjU0MzIxMCJ9.rM7gN9_KB0pfpqiInDxT0WIEwJHNaeXXm-oPA1g8YHg';
    }
      let headers = new HttpHeaders({'Content-Type': 'application/json'});
      let options = {headers: headers};

      return this.https.post<any>(this.noteUrl+"/Get?jwt=" + this.token, options)

      .toPromise()
      .then(res => <Notes[]>res)
      .then(data => {
        return data;
      });
  }

  getCategory(isPrivate: boolean) {

    if(isPrivate){
      this.token = String(localStorage.getItem("token"));
    }
    else{
      this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6InB1YmxpY18wMTIzNDU2Nzg5OTg3NjU0MzIxMCJ9.rM7gN9_KB0pfpqiInDxT0WIEwJHNaeXXm-oPA1g8YHg';
    }

      let headers = new HttpHeaders({'Content-Type': 'application/json'});//options
      let options = {headers: headers};
      return this.https.post<any>(this.categoryUrl+"/Get?jwt=" + this.token, options)
      .toPromise()
      .then(res => <Categories[]>res)
      .then(data => {
        return data;
      });
  }

  addCategory(title: string, color: string, isPrivate: boolean) {
    if(isPrivate){
      this.token = String(localStorage.getItem("token"));
    }
    else{
      this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6InB1YmxpY18wMTIzNDU2Nzg5OTg3NjU0MzIxMCJ9.rM7gN9_KB0pfpqiInDxT0WIEwJHNaeXXm-oPA1g8YHg';
    }

    var re = /#/gi;
    var newstr = color.replace(re, '%23');
    return this.https.post(this.categoryUrl + '?title=' + title + '&jwt=' + this.token + '&color=' + newstr, '');
  }

  addNote(id: number, content: string, color: string, isPrivate: boolean){
    if(isPrivate){
      this.token = String(localStorage.getItem("token"));
    }
    else{
      this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6InB1YmxpY18wMTIzNDU2Nzg5OTg3NjU0MzIxMCJ9.rM7gN9_KB0pfpqiInDxT0WIEwJHNaeXXm-oPA1g8YHg';
    }
    var re = /#/gi;
    var newstr = color.replace(re, '%23');

   return this.https.post(this.noteUrl + '?content=' + content + '&categoryID=' + id + '&jwt=' + this.token + '&color=' + newstr, '');

  }

  updateCategory(id: number, title: string, color: string){
    var re = /#/gi;
    var newstr = color.replace(re, '%23');
    this.https.patch(this.categoryUrl + '/' + id +'?title=' +  title + '&color=' + newstr, '')
    .subscribe((res)=>{
      console.log(res);
    });
  }

  updateNote(id: number, note: Notes){
    this.https.patch(this.noteUrl + '/' + id, note)
    .subscribe((res)=>{
      console.log(res);
    });
  }

  deleteCategory(id: number){
    this.https.delete(this.categoryUrl + '/' + id)
    .subscribe((res)=>{
      console.log(res);
    });
  }

  deleteNote(id: number){
    this.https.delete(this.noteUrl + '/' + id)
    .subscribe((res)=>{
      console.log(res);
    });
  }
}
