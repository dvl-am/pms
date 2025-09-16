import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthUser, UserCredential, UserDetails } from '../../models/common-model';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../appConfig/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  authURL = '';
  liquidURL = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loggedInUserDetails = new BehaviorSubject<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loggedInUser = new BehaviorSubject<any>('');

  constructor(public config: AppConfigService,private http:HttpClient) {
       this.liquidURL = this.config.getAPIURL(true, 'apiUrl', 'workFlowQueryUrl');
       this.authURL = config.authenticationUrl;
   }
   authenticateUser(obj: UserCredential): Observable<AuthUser> {
    const formData = new FormData();
    formData.append('userid', obj.email);
    formData.append('password', obj.password);
    return this.http.post<AuthUser>(`${this.authURL}login`, formData).pipe(
      map((el) => {
        console.log(el)
        let userToken = '';
        if (el.Value) {
          userToken = el.Value;
          sessionStorage.setItem('user', JSON.stringify(el));
          sessionStorage.setItem('userToken', userToken);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const decodedToken: any = jwtDecode(userToken);
          return decodedToken;
        }
        return el;
      })
    );
  }
    fetchUserDetails(emailId: string): Observable<UserDetails[]> {
    const obj = {
      view: 'userDetails',
      filter: {
        emailId: emailId,
      },
    };
    return this.http.post<UserDetails[]>(`${this.liquidURL}`, obj).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((el: any) => {
        if (el.length) {
          this.loggedInUserDetails.next(Object(el[0]));
          this.loggedInUser = el[0];
          return el;
        }
      })
    );
  }
}
