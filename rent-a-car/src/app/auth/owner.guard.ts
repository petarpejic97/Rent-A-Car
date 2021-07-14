import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";

@Injectable({ providedIn: 'root' })
export class OwnerGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree>
    {
      return this.authService.fetchUserData().pipe(
        map(
          status=>{
            if(status[0].roles.includes('ROLE_ADMIN')){
              return true;
            }
            else{
              this.userService.showNotAllowedError.next(true);
              return (this.router.createUrlTree(['/home']));
            }
          }
        ),
        catchError((error) => {
          this.userService.showNotAllowedError.next(true);
          return of(this.router.createUrlTree(['/home']))
        })
      )
  }
}
