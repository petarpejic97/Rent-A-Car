import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserService } from '../auth/user.service';
import { Reservation } from './reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  allReservations: Reservation[] = [];
  reservationsChanged = new Subject<boolean>();
  userReservations: Reservation[] = [];
  waitingReservations: Reservation[] = [];
  acceptedReservations: Reservation[] = [];
  rejectedReservations: Reservation[] = [];

  constructor() { }

  saveAllReservations(reservations: Reservation[]): void{
    this.allReservations = reservations;
    this.reservationsChanged.next(true);
  }
  saveUserReservations(reservations: Reservation[]): void {
    this.userReservations = reservations;
    this.reservationsChanged.next(true);
  }

  fetchAllReservations(): Reservation[] {
    return this.allReservations;
  }
  fetchUserReservations(): Reservation[] {
    return this.userReservations;
  }
  fetchWaitingReservations(): Reservation[] {
    return this.waitingReservations;
  }
  fetchAcceptedReservations(): Reservation[] {
    return this.acceptedReservations;
  }
  fetchRejectedReservations(): Reservation[] {
    return this.rejectedReservations;
  }
  fetchReservationByID(id:number,userType: string): Reservation {
    if(userType === 'ROLE_USER'){
      return this.userReservations.find( reservation => {return reservation.id === id});
    }
    else {
      return this.allReservations.find( reservation => {return reservation.id === id});
    }
  }
  removeReservation(reservation: Reservation): void{
    this.allReservations = this.allReservations.filter(res => res !== reservation);
    this.reservationsChanged.next(true);
  }
  updateReservation(loggedUserID:number ,id:number,status:string,message:string): void{
    this.allReservations.find(reservation => {
      if(reservation.id === id){
        reservation.info = message;
        reservation.status = status;
      }
    })
    this.filterReservations(loggedUserID);
  }
  filterReservations(userID: number): void{
    this.resetReservations();
    this.allReservations.forEach(reservation => {
      if(reservation.status === 'Waiting' && userID === reservation.vehicle.carRental.owner.id){
        this.waitingReservations.push(reservation);
      }
      else if(reservation.status === 'Accepted'  && userID === reservation.vehicle.carRental.owner.id){
        this.acceptedReservations.push(reservation);
      }
      else if(reservation.status === 'Rejected'  && userID === reservation.vehicle.carRental.owner.id){
        this.rejectedReservations.push(reservation);
      }
    })
  }
  resetReservations(): void{
    this.acceptedReservations = [];
    this.waitingReservations = [];
    this.rejectedReservations = [];
  }
}
