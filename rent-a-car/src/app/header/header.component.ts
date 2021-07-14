import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';
import { UserService } from '../auth/user.service';
import { ReservationService } from '../reservation/reservation.service';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

 loggedUser: User;
 userType: string = 'none';
 subscription: Subscription;
 spinner=false
  constructor(
    private router:Router,
    private userService: UserService,
    private headerService: HeaderService,
    private reservationService: ReservationService
  ) { }

  ngOnInit(): void {
    this.subscription = this.userService.userChanged.subscribe(user => {
      this.loggedUser = user;
    })
    this.loggedUser = this.userService.getUser();

  }

  logout(): void{
    this.router.navigate(['/home']);
    localStorage.removeItem('userToken');
    this.userService.saveUser(undefined);
    this.userService.showNotAllowedError.next(false);
    this.reservationService.userReservations = [];
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }
}
