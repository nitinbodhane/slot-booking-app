// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import {
//     HttpEvent, HttpInterceptor, HttpHandler,
//     HttpRequest, HttpErrorResponse
//   } from '@angular/common/http';
// import { throwError, Observable, BehaviorSubject, of } from 'rxjs';

// @Injectable()
// export class AuthenticationInterceptor implements HttpInterceptor {
//     constructor(private router: Router) {}
//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         return next.handle(request).tap(event => {
//         }, error => {
//             if (error instanceof HttpErrorResponse && error.status === 401) {
//                 this.router.navigate([ '/login' ]);
//             }
//             return error;
//         });
//     }
// }