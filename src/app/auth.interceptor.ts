import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (localStorage.getItem('token') != null) {
      const clonedReq = req.clone({
        headers: req.headers.set(
          'Authorization',
          'Bearer ' + localStorage.getItem('token')
        ),
      });
      return next.handle(clonedReq).pipe(
        tap({
            next: (_) => {},
            error: (error : HttpErrorResponse) => {
              if (error.status == 401) {localStorage.removeItem('token');
                this.router.navigateByUrl('/login');
              } else {
                return error.error ? error.error : error.message;
              }
            }
        }
        )
      )
    } else return next.handle(req.clone());
  }
}
