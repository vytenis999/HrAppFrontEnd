import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {JwtHelperService} from "@auth0/angular-jwt";
import {environment} from "../../environments/environment";
import {ForgotPassword, ResetPasswordDto, UserLogin} from "../models/user-login.model";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  readonly rootUrl = environment.apiUrl;
  headers = new HttpHeaders({'Content-Type': 'application/json'});
  options = {headers: this.headers};

  constructor(private https: HttpClient, private jwtHelper: JwtHelperService) { }

  login(user: UserLogin){
    return this.https.post(this.rootUrl + '/Auth/Login', user, this.options);
  }

  ForgotPassword(body : ForgotPassword){
    return this.https.post(this.rootUrl + '/Auth/ForgotPassword', body, this.options);
  }

  resetPassword (body : ResetPasswordDto){
    return this.https.post(this.rootUrl + '/Auth/ResetPassword', body, this.options);
  }

}
