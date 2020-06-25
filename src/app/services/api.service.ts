import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public getAccounts(): any {
    return this.http.get<any>('http://localhost:8080/api/accounts').pipe(
      map(ApiService.extractData),
      catchError(ApiService.handleError)
    );
  }

  private static extractData(res: Response) {
    return res || {};
  }

  private static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`data returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return throwError(error);
  }
}
