import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User = undefined;
  userChanged = new Subject<User>();
  showNotAllowedError = new BehaviorSubject<boolean>(null);
  successCompanyRegister = new BehaviorSubject<boolean>(null);
  companyRegisterError = new BehaviorSubject<string>('');
  constructor() { }


  saveUser(user: User): void{
    this.user = user;
    this.userChanged.next(user);
  }
  removeUser(): void{
    this.user = undefined;
  }
  getUser(): User{
    return this.user;
  }
  getUserType(): string[]{
    if(this.user === undefined){
      return null;
    }
    else{
      return this.user.roles;
    }
  }

}
