import { JwtHelperService } from '@auth0/angular-jwt';

export class DecryptToken {

  constructor(private jwtHelper : JwtHelperService) {}

  getUserProfileEmail(res:any) {
    var token = JSON.stringify(localStorage.getItem('token'));
    console.log(token);
    console.log(this.jwtHelper.decodeToken(token));
    const tokendec = this.jwtHelper.decodeToken(token);
    const email = tokendec['Email'];
    res = email;
    return res;
  }

  getUserProfileName(res:any) {
    var token = JSON.stringify(localStorage.getItem('token'));
    console.log(this.jwtHelper.decodeToken(token));
    const tokendec = this.jwtHelper.decodeToken(token);
    const email = tokendec['Email'];
    res = email.split('@');
    return res[0];
  }

  getUserProfileRole(res:any) {
    var token = JSON.stringify(localStorage.getItem('token'));
    console.log(this.jwtHelper.decodeToken(token));
    const tokendec = this.jwtHelper.decodeToken(token);
    res = tokendec['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return res;
  }

}



