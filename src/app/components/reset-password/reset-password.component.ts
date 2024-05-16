import { Component, OnInit } from '@angular/core';
import {ResetPasswordDto} from "../../models/user-login.model";
import {LoginService} from "../../services/login.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  userReset: ResetPasswordDto = {};

  private token?: string;
  private email?: string;

  submitted!: boolean;

  constructor(private service: LoginService, private messageService: MessageService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.reset();
    this.submitted = false;

  }

  reset() {
    this.userReset = {}
  }


  onReset() {
    this.submitted = true;
    if(this.userReset.password && this.userReset.confirmPassword && (this.userReset.password == this.userReset.confirmPassword)){
      this.getInfoFromLink();
      this.userReset.token = this.token;
      this.userReset.email = this.email;
      this.service.resetPassword(this.userReset).subscribe({
        next: (_) => {
          this.messageService.add({severity:'warning', summary: 'Išsiųsta', detail: 'Jūsų slaptažodis sėkmingai pakeistas!', life: 3000});
          this.router.navigateByUrl('login');
        },
        error: (error : HttpErrorResponse) => {
          console.log(error.message);
          if(error.status === 404) {
            this.messageService.add({severity:'error', summary: 'Klaida', detail: error.message, life: 3000});
          }
        }
      });
      this.userReset = {}
      this.submitted = false;
    }

  }

  getInfoFromLink(){
    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'];
  }

}
