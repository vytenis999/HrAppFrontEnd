import { Component, OnInit } from '@angular/core';
import {DecryptToken} from "../../decrypt-token";
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserService} from "../../services/user.service";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  name? : string;
  nameLetter? : string;
  email1? : string;
  role? : string;

  tempMail? : string;

  tempOldPassword1? : string;
  tempPass1? : string;
  tempPassConfirm1? : string;

  userDialogChangePass!: boolean;
  submittedPass!: boolean;

  userDialogChangeEmail!: boolean;
  submittedEmail!: boolean;

  constructor(private decryptionToken : DecryptToken, private jwtHelper: JwtHelperService,private service: UserService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.decrypt();
  }

  decrypt(){
    let decryptCl = new DecryptToken(this.jwtHelper);
    this.name = decryptCl.getUserProfileName(this.name).charAt(0).toUpperCase() + decryptCl.getUserProfileName(this.name).slice(1).toLowerCase();
    this.nameLetter = decryptCl.getUserProfileName(this.name).charAt(0).toUpperCase();
    this.email1 = decryptCl.getUserProfileEmail(this.email1);
    this.role = decryptCl.getUserProfileRole(this.role);
  }

  openNewChangeEmail() {
    this.tempMail = this.email1;
    this.submittedEmail = false;
    this.userDialogChangeEmail = true;
  }

  openNewChangePass() {
    this.submittedPass = false;
    this.userDialogChangePass = true;
  }

  hideDialogChangeEmail() {
    this.userDialogChangeEmail = false;
    this.submittedEmail = false;
  }

  hideDialogChangePass() {
    this.userDialogChangePass = false;
    this.submittedPass = false;
  }

  errorMessage(error:any) {
    this.messageService.add({severity:'error', summary: `Klaida`, detail: error.error, life: 3000});
  }

  savePasswordChange1(){
    this.submittedPass = true;
    if(this.tempPass1 && this.tempPassConfirm1 && this.tempOldPassword1 && (this.tempPass1 == this.tempPassConfirm1)){
      this.service.changePasswordProfile(this.email1, this.tempPass1, this.tempOldPassword1).subscribe({
        next: () =>{
          this.tempOldPassword1 = "";
          this.tempPass1 = "";
          this.tempPassConfirm1 = "";
          this.userDialogChangePass = false;
          this.messageService.add({severity:'success', summary: 'Įvykdyta sėkmingai', detail: 'Vartotojo slaptažodis pakeistas!', life: 3000});
        },
        error: (error) => {
          this.errorMessage(error);
        }
      });
    }
  }

  saveEmailChange(){
    this.submittedEmail = true;
    if(this.email1 && this.tempOldPassword1){
      this.service.changeUserMail(this.email1, this.tempMail, this.tempOldPassword1).subscribe({
        next: () => {
          this.tempMail = "";
          this.tempOldPassword1 = "";
          this.userDialogChangeEmail = false;
          this.messageService.add({severity:'success', summary: 'Įvykdyta sėkmingai', detail: 'Vartotojo el.paštas pakeistas!', life: 3000});
        },
        error: (error) => {
          this.errorMessage(error);
        }
      });
    }
  }

}
