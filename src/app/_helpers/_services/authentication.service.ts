import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<any>('http://localhost:8081/login', { username, password })
      .pipe(map((res: any) => {
        // todo: login successful if there's a jwt token in the response
        if (res) { // && res.token
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(res));
        }
      }));
  }

  register(data) {
    return this.http.put<any>('http://localhost:8081/register', data);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
