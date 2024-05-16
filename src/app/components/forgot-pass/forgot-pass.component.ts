import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/login.service";
import {MessageService} from "primeng/api";
import {ForgotPassword} from "../../models/user-login.model";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {

  errormess : any;
  issuccess : boolean = false;
  isfailure : boolean = false;
  forgotPassword : ForgotPassword = {};
  email! : string;
  submitted? : boolean;

  constructor(private service : LoginService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.submitted = false;
    this.forgotPassword.email = "";
    this.reset();
  }

  reset(){
    this.forgotPassword = {}
    this.issuccess = false;
    this.isfailure = false;
  }

  onReset(){
    this.submitted = true;
    this.issuccess = false;
    this.isfailure = false;
    if(this.forgotPassword.email){

      //this.forgotPassword.email = this.email;
      this.forgotPassword.clientURI = `${location.origin}/reset-password`;

      this.service.ForgotPassword(this.forgotPassword).subscribe({
        next: (_) => {
          this.issuccess = true;
        },
        error: (error) => {
          this.issuccess = false;
          this.isfailure = true;
          this.errormess = "Blogas El.paštas formatas arba tokio El.pašto nėra!";
        }
      });
      this.forgotPassword = {}
      this.submitted = false;
    }
  }

}
