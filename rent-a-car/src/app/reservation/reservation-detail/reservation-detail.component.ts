import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { UserService } from 'src/app/auth/user.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Vehicle } from 'src/app/vehicle/vehicle.model';
import { Reservation } from '../reservation.model';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.css']
})
export class ReservationDetailComponent implements OnInit {

  reservationID:number;
  userSubscription: Subscription = new Subscription();
  loggedUser: User;
  reservation: Reservation = null;
  reservationSubscription: Subscription = new Subscription();
  vehicle: Vehicle = null;
  shortMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private dataStorageService: DataStorageService,
    private userService: UserService
    ) { }

  ngOnInit(): void {
    this.fetchReservationID();
    this.fetchUser();
  }

  fetchReservationID(): void{
    this.reservationID = +this.route.snapshot.paramMap.get('id');
  }
  fetchUser(): void{
    let user = this.userService.getUser();
    if(!user){
      this.userSubscription = this.userService.userChanged.subscribe( user =>{
        this.loggedUser = this.userService.getUser();
        this.fetchReservtionByUserType();
      })
    }
    else{
      this.loggedUser = user;
      this.fetchReservtionByUserType();
    }
  }
  fetchReservtionByUserType(): void{
    if(this.loggedUser.roles.includes('ROLE_USER')&&this.loggedUser.roles.length===1){
      this.fetchReservation('ROLE_USER');
    }
    else{
      this.fetchReservation('ROLE_ADMIN');
    }
  }
  fetchReservation(type: string): void{
    let reservation = this.reservationService.fetchReservationByID(this.reservationID,type);
    if(!reservation){
      this.reservationSubscription = this.reservationService.reservationsChanged.subscribe((state) => {
        this.reservation = this.reservationService.fetchReservationByID(this.reservationID,type);
        this.fetchVehicle();
      })
    }
    else{
      this.reservation = this.reservationService.fetchReservationByID(this.reservationID,type);
      this.shortMessage = this.reservation.info;
      this.fetchVehicle();
    }

  }
  fetchVehicle(): void{
    this.vehicle = this.reservation.vehicle;
  }
  getDate(date:any): string{
    let formatedDate = '';
    let tempDate = new Date(date.date);
    formatedDate += tempDate.getDate() + "."
    formatedDate += (tempDate.getMonth()+1) + "."
    formatedDate += tempDate.getFullYear() + "."
    return formatedDate;
  }
  getYear(date:any){
    let formatedDate = '';
    let tempDate = new Date(date.date);
    formatedDate += tempDate.getFullYear() + "."
    return formatedDate;
  }
  getNewPrice(): number{
    return this.reservation.vehicle.price - this.reservation.vehicle.price*(this.reservation.vehicle.discount/100)
  }

  cancelReservation(): void{
    this.reservationService.removeReservation(this.reservation);
    this.dataStorageService.removeReservation(this.reservationID).subscribe(
      response => {this.router.navigate(['/reservation']);},
      error => {}
    );
  }
  updateReservation(status: string): void{
    this.reservationService.updateReservation(this.loggedUser.id,this.reservationID,status,this.shortMessage);
    this.dataStorageService.updateReservation(this.reservationID,status,this.shortMessage).subscribe(
      response => { this.router.navigate(['/reservation']); },
      error => {}
    );
  }
  goBack(): void{
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  ngOnDestroy(): void {
    this.reservationSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
