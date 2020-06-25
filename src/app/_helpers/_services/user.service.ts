import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  update(user: any) {
    console.log(' ::>> update >>>>>>>>>>>> ', user);
    return this.http.post<any>('http://localhost:8081/update', user);
  }
}
