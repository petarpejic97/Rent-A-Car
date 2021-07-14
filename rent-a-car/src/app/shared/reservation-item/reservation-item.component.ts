import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from 'src/app/reservation/reservation.model';
import { Vehicle } from 'src/app/vehicle/vehicle.model';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-reservation-item',
  templateUrl: './reservation-item.component.html',
  styleUrls: ['./reservation-item.component.css']
})
export class ReservationItemComponent implements OnInit {

  @Input() reservation: Reservation;
  @Input() userReservations: boolean;
  statusColor: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.setStatusColor();
   }

  getDate(date:any): string{
    let formatedDate = '';
    let tempDate = new Date(date.date);
    formatedDate += tempDate.getDate() + "."
    formatedDate += (tempDate.getMonth()+1) + "."
    formatedDate += tempDate.getFullYear() + "."
    return formatedDate;
  }
  fetchNewPrice(): number{
    return this.reservation.vehicle.price - this.reservation.vehicle.price*(this.reservation.vehicle.discount/100);
  }
  setStatusColor(): void{
    if(this.userReservations){
      switch(this.reservation.status) {
        case 'Waiting': {
          this.statusColor = '#ffd382';
          break;
        }
        case 'Accepted': {
          this.statusColor = 'green';
          break;
        }
        case 'Rejected': {
          this.statusColor = 'red';
          break;
        }
      }
    }
    else{
      this.statusColor = "#ffd382";
    }
  }

  navigateToDetailedReservation(): void{
    this.router.navigate([this.reservation.id], {relativeTo: this.route});
  }
}
