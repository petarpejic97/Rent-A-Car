import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map, skipWhile, take, takeWhile, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,
    private userService: UserService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): | boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>
  {
    return this.authService.fetchUserData().pipe(
      map(
        status =>{
          if(!status){
            return true;
          }
          else{
            this.userService.showNotAllowedError.next(true);
            return (this.router.createUrlTree(['/home']));
          }
        }
      ),
      catchError((error) => {
        return of(true);
      })
    )
  }
}
