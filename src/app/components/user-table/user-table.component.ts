import { Component, OnInit, Input} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {User, UserCreate, UserDelete, UserChangePass} from "../../models/user.model";
import {UserService} from "../../services/user.service";


@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {

  emailOrigin? : string;
  emailOrigin1? : string;

  roleOrigin? : string;

  tempPass? : string;
  tempPassConfirm? : string;

  userDialog!: boolean;
  userDialogEdit!: boolean;
  userDialogChangePass!: boolean;

  users: User[]=[];

  user!: User;

  selectedUsers: User[] = [];

  deleteUsers: UserDelete[] = [];

  userChangePass!: UserChangePass;

  submitted!: boolean;
  submittedEdit!: boolean;
  submittedPass!: boolean;

  userCreate!: UserCreate;

  token! : string;

  constructor(private service: UserService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.service.getUsers().subscribe(data => {this.users = data, console.log(this.users)});
    this.token = this.getToken();
  }

  getToken(){
    this.token = JSON.stringify(localStorage.getItem('token'));
    return this.token;
  }

  openNew() {
    this.userCreate = {};
    this.submitted = false;
    this.userDialog = true;
  }

  openNewEdit() {
    this.userCreate = {};
    this.submittedEdit = false;
    this.userDialogEdit = true;
  }

  openNewChangePass(user: User) {
    this.emailOrigin = this.user.email;
    this.emailOrigin1 = this.user.email;
    this.userDialogEdit = false;
    this.submittedPass = false;
    this.userDialogChangePass = true;
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Ar tikrai norite ištrinti šiuos vartotojus?',
      header: 'Patvirtinti',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedUsers.forEach(x => {
          this.deleteUsers.push({
            "email": x.email,
          });
        });
        // console.log(this.deleteUsers);

        this.service.deleteUsers(this.deleteUsers, this.token).subscribe({
          next: () => {
            this.users = this.users.filter(val => !this.selectedUsers.includes(val));
            this.selectedUsers = [];
            this.deleteUsers = [];
            this.messageService.add({severity:'success', summary: 'Įvykdyta sėkmingai', detail: 'Vartotojai ištrinti', life: 3000});
          },
          error: (error) => {
            this.messageService.add({severity:'error', summary: 'Klaida', detail: error.error, life: 3000});
          }
        });

      }
    });
  }

  editUser(user: User) {
    this.user = {...user};
    this.emailOrigin = user.email;
    this.roleOrigin = user.role;
    this.userDialogEdit = true;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Ar tikrai norite ištrinti ' + user.email + '?',
      header: 'Patvirtinti',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.deleteUser(user.email, this.token).subscribe({
          next: () =>{
            this.users = this.users.filter(val => val.email !== user.email);
            this.user = {};
            this.messageService.add({severity:'success', summary: 'Įvykdyta sėkmingai', detail: 'Vartotojas ištrintas', life: 3000});
          },
          error: (error) => {
            this.messageService.add({severity:'error', summary: 'Klaida', detail: error.error, life: 3000});
          }
        });

      }
    });
  }

  hideDialog() {
    this.userDialog= false;
    this.submitted = false;
  }

  hideDialogEdit() {
    this.userDialogEdit= false;
    this.submittedEdit = false;
  }

  hideDialogChangePass() {
    this.userDialogChangePass = false;
    this.submittedPass = false;
  }

  saveUserEdit(){
    this.submittedEdit = true;

    if(this.user.email != this.emailOrigin || this.user.role != this.roleOrigin){
      this.service.updateUser(this.emailOrigin, this.user, this.token).subscribe({
        next: () => {
          this.users.forEach((element) => { if (element.email == this.emailOrigin){
            element.email = this.user.email;
            element.role = this.user.role;
          } });
          this.userDialogEdit = false;
          this.user = {};
          this.messageService.add({severity:'success', summary: 'Įvykdyta sėkmingai', detail: 'Vartotojo duomenys pakeisti!', life: 3000});
          this.emailOrigin = "";
          this.roleOrigin = "";
      },
      error: (error) => {
        this.messageService.add({severity:'error', summary: 'Klaida', detail: error.error, life: 3000});
      }
      });
    }
  }

  savePasswordChange(){
    this.submittedPass = true;

    if(this.tempPass && this.tempPassConfirm && (this.tempPass == this.tempPassConfirm)){
      this.service.changePassword(this.emailOrigin1, this.tempPass, this.token).subscribe({
        next: () => {
          this.emailOrigin1 = "";
          this.tempPass = "";
          this.tempPassConfirm = "";
          this.userDialogChangePass = false;
          this.messageService.add({severity:'success', summary: 'Įvykdyta sėkmingai', detail: 'Vartotojo slaptažodis pakeistas!', life: 3000});
        },
        error: (error) => {
          this.messageService.add({severity:'error', summary: 'Klaida', detail: error.error, life: 3000});
        }
      });
    }
  }

  saveUser() {
    this.submitted = true;

    if(this.userCreate.email && this.userCreate.password && this.userCreate.confirmPassword){
        this.service.postUser(this.userCreate).subscribe({
          next: () => {
            this.users.push({email:this.userCreate.email, role:this.userCreate.role});
            this.userDialog = false;
            this.userCreate = {};
            this.messageService.add({severity:'success', summary: 'Įvykdyta sėkmingai', detail: 'Vartotojas pridėtas', life: 3000});
          },
          error: (error) => {
            this.messageService.add({severity:'error', summary: 'Klaida', detail: error.error, life: 3000});
          }
        });
    }
  }
}
