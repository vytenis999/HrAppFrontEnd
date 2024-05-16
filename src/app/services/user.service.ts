import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User, UserCreate} from "../models/user.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly rootUrl = environment.apiUrl;
  headers = new HttpHeaders({'Content-Type': 'application/json'});
  options = {headers: this.headers};


  constructor(private http: HttpClient) { }

  getUsers(){
      return this.http.get<User[]>(this.rootUrl + '/Auth', this.options);
  }

  postUser(userCreate : UserCreate){
    return this.http.post(this.rootUrl + '/Auth/Register', userCreate, this.options);
  }

  deleteUsers(users : any, token :string){
    return this.http.post(this.rootUrl + `/Auth/RemoveList/${token}`, users, this.options);
  }

  deleteUser(email : any, token : string){
    return this.http.delete(this.rootUrl + `/Auth/Remove/${email}/${token}`);
  }

  updateUser(email : any, userUpdates : any, token : string){
    return this.http.put(this.rootUrl + `/Auth/Update/${email}/${token}`, userUpdates, this.options);
  }

  changeUserMail(email : any, userUpdatedMail : any, password : string){
    let request:any = {};
    request.email = userUpdatedMail;
    request.password = password;
    return this.http.put(this.rootUrl + `/Auth/ChangeMailUser/${email}`, request, this.options);
  }

  changePassword(email : any, pass : string, token : string){
    console.log(pass);
    console.log(typeof pass);
    console.log(email)
    let request:any = {};
    request.email = email;
    request.password = pass;
    return this.http.post(this.rootUrl + `/Auth/ChangePasswordUser/${token}`, request, this.options);
  }

  changePasswordProfile(email : any, pass : string, oldpass : string){
    console.log(pass);
    console.log(typeof pass);
    console.log(email)
    let request:any = {};
    request.email = email;
    request.confirmPassword = pass;
    request.oldPassword = oldpass;
    return this.http.post(this.rootUrl + `/Auth/ChangePassword`, request, this.options);
  }
}
