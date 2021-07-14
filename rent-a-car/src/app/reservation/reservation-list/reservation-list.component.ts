import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { UserService } from 'src/app/auth/user.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Reservation } from '../reservation.model';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {

  userSubscription: Subscription;
  reservationsSubscription: Subscription;
  loggedUser: User = undefined;
  reservationsLoading: boolean = true;
  userReservations: Reservation[];
  waitingReservations: Reservation[];
  acceptedReservations: Reservation[];
  rejectedReservations: Reservation[];


  constructor(
    private userService: UserService,
    private dataStorageService: DataStorageService,
    private reservationService: ReservationService
    ) {}

  ngOnInit(): void {
    this.fetchUserType();
  }
  fetchUserType(): void{
      this.userSubscription = this.userService.userChanged.subscribe(user=>{
        if(user){
          this.loggedUser = user;
          this.fetchReservationsByUserType();
        }
      })
      this.loggedUser = this.userService.getUser();
      this.fetchReservationsByUserType();
  }

  fetchReservationsByUserType(): void{
    if(this.loggedUser && this.loggedUser.roles.includes('ROLE_USER')){;
      if(this.reservationService.fetchUserReservations().length === 0){
        this.dataStorageService.fetchUserReservations().subscribe(
          response => {
            this.userReservations = this.reservationService.fetchUserReservations();
            this.reservationsLoading = false;
          },
          errorResponse => {
            if(errorResponse){
              this.reservationsLoading = false;
            }
           }
        );
      }
      else{
        this.userReservations = this.reservationService.fetchUserReservations();
        this.reservationsLoading = false;
      }
    }
    if(this.loggedUser && this.loggedUser.roles.includes('ROLE_ADMIN')){
      if(this.reservationService.fetchAllReservations().length === 0){
        this.dataStorageService.fetchAllReservations().subscribe(
          response => {console.log(response)},
          error => {console.log(error)}
        );
        this.reservationsSubscription = this.reservationService.reservationsChanged.subscribe(reservations => {
          this.reservationsLoading = false
          this.reservationService.filterReservations(this.loggedUser.id);
          this.fetchRentalCarReservations();
        })
      }
      else{
        this.reservationService.filterReservations(this.loggedUser.id);
        this.fetchRentalCarReservations();
      }
    }
  }
  fetchRentalCarReservations(): void{
    this.acceptedReservations = this.reservationService.fetchAcceptedReservations();
    this.waitingReservations = this.reservationService.fetchWaitingReservations();
    this.rejectedReservations = this.reservationService.fetchRejectedReservations();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
