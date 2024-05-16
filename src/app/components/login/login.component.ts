import { Component, OnInit } from '@angular/core';
import {UserLogin} from "../../models/user-login.model";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  rememberMe? : boolean;

  user: UserLogin = new UserLogin();

  constructor(private loginService: LoginService, private router: Router) { }

  email : any = '';
  password : any = '';

  ngOnInit(): void {
    this.rememberMe = false;
    this.resetLogin();
    if(localStorage.getItem('token') != null){
      this.router.navigateByUrl('/entry/home');
    }
    this.AutoLogin();
  }

  resetLogin(){
    this.user = {
      email: ' ',
      password: ' ',
    }
    this.email = '';
    this.password = '';
  }

  onLogin(){
    this.user ={
      email: this.email,
      password: this.password,
    }
    var tempMail = this.user.email;
    var tempPass = this.user.password;
    this.loginService.login(this.user).subscribe((res:any) => {
      const token = res.message;
      localStorage.setItem('token', token);
      if (this.rememberMe) {
        localStorage.setItem('rememberMe', 'yes');
      }
      this.router.navigateByUrl('/entry/home');
    },
      (error) => {
    });
    this.resetLogin();
  }

  AutoLogin(){
    const accessTokenObj = localStorage.getItem("token");
    // Retrieve rememberMe value from local storage
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe == 'yes') {
    }
  }

}
