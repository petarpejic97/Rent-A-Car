import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { AuthService } from "./auth.service";
import { User } from "./user.model";
import { UserService } from "./user.service";

@Injectable({ providedIn: 'root' })
export class AuthResolverService implements Resolve<User>{

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  resolve(): User{
    const user = this.userService.getUser();
    if (user === undefined) {
      this.authService.fetchUserData().subscribe(
        userData => {  },
        errorMessage => { }
      );
    }
    else {
      return user;
    }
  }
}
