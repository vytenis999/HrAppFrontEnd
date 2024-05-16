import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {DecryptToken} from "../../decrypt-token";
import {JwtHelperService} from "@auth0/angular-jwt";
import {SidebarModule} from 'primeng/sidebar';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  display : boolean = false;
  name? : string;
  nameLetter? : string;
  role? : string;

  constructor(private router: Router,private decryptionToken : DecryptToken,private jwtHelper: JwtHelperService) {
  }

  items = [
    {
      label:'Pagrindinis',
      icon:'pi pi-home',
      routerLink: ['home'],
    },
    {
      label:'Kandidatai',
      icon:'pi pi-users',
      items:[
        {
          routerLink: ['candidate-table'],
          label:'Lentelė',
          icon:'pi pi-table'
        },
        {
          routerLink: ['add-candidate'],
          label:'Pridėti naują',
          icon:'pi pi-plus-circle'
        },
      ]
    },
    {
      routerLink: ['calendar'],
      label:'Kalendorius',
      icon:'pi pi-fw pi-calendar',
    },
    {
      routerLink: ['clients'],
      label:'Klientai',
      icon:'pi pi-briefcase'
    },
    {
      routerLink: ['tax'],
      label: 'Atlyginimo skaičiuoklė',
      icon: 'pi pi-euro'
    }
  ];

  ngOnInit() {
    this.decrypt();
  }

  decrypt(){
    let decryptCl = new DecryptToken(this.jwtHelper);
    this.name = decryptCl.getUserProfileName(this.name).charAt(0).toUpperCase() + decryptCl.getUserProfileName(this.name).slice(1).toLowerCase();
    this.nameLetter = decryptCl.getUserProfileName(this.name).charAt(0).toUpperCase();
    this.role = decryptCl.getUserProfileRole(this.role);
  }

  onLogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
