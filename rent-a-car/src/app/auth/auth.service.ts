import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  dataRefreshInterval: number = 0.5;
  succLogin = new BehaviorSubject(false)

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) { }

  saveToken(token: string): void {
    localStorage.setItem('userToken', token);
    this.fetchUserData().subscribe();
  }
  fetchUserData(): Observable<User> {
    return this.http
      .post<any>(
        environment.apiUrl + '/auth',
        {
          token: localStorage.getItem('userToken')
        }
      )
      .pipe(
        tap(
          (responseData: any) => {
            let user: User = {
              id: responseData[0].id,
              email: responseData[0].email,
              roles: responseData[0].roles,
              birthday: responseData[0].birthday,
              firstName: responseData[0].firstName,
              lastName: responseData[0].lastName
            };
            this.userService.saveUser(user);
          },
          errorResponse => {
            if(errorResponse.status === 500){
              localStorage.removeItem('userToken');
            }
          }
        )
      );
  }
  navigateToHomeScreen(): void {
    this.router.navigate(['/']);
  }
}

