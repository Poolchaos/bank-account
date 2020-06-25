import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const mockUser = { id: 1, username: 'test', password: 'test1234', firstName: 'Flaap', lastName: 'Jan' };

    // wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(() => {

      // authenticate
      if (request.url.endsWith('/login') && request.method === 'POST') {
        if (request.body.username === mockUser.username && request.body.password === mockUser.password) {
          // if login details are valid return 200 OK with a fake jwt token
          return of(new HttpResponse({ status: 200, body: {
            token: 'fake-jwt-token',
            firstName: 'flaap',
            surname: 'jan',
            username: 'test'
          } }));
        } else {
          return throwError('Not Found');
        }
      }

      // register user
      if ((request.url.endsWith('/register') && request.method === 'PUT')) {
        const isValid = Object.values(request.body).every(x => (x !== null || x !== ''));
        if (isValid) {
          return of(new HttpResponse({ status: 200, body: request.body }));
        } else {
          return throwError('Bad Request');
        }
      }

      // update user
      if ((request.url.endsWith('/update') && request.method === 'POST')) {
        const isValid = Object.values(request.body).every(x => (x !== null || x !== ''));
        if (isValid) {
          return of(new HttpResponse({ status: 201, body: request.body }));
        } else {
          return throwError('Bad Request');
        }
      }

      // pass through any requests not handled above
      return next.handle(request);

    }))

    // tslint:disable-next-line:max-line-length
    // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
    .pipe(materialize())
    .pipe(delay(500))
    .pipe(dematerialize());
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
