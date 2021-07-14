import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from '../auth/user.service';
import { HeaderService } from '../header/header.service';
import { Reservation } from '../reservation/reservation.model';
import { ReservationService } from '../reservation/reservation.service';
import { Vehicle } from '../vehicle/vehicle.model';
import { VehicleService } from './vehicle.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(
    private reservationService: ReservationService,
    private vehicleService: VehicleService,
    private http: HttpClient,
    private userService: UserService,
    private headerService: HeaderService
    ) { }

  allVehicles: Vehicle[];
  allReservations: Reservation[];
  userReservations: Reservation[];

  private dataRefreshInterval = 5; // in minutes
z;

  fetchVehicles(): Observable<Vehicle[]>{
    return this.http
    .get<any>(
      environment.apiUrl + '/vehicles'
    )
    .pipe(
      tap((vehicles: Vehicle[]) => {
        this.vehicleService.setVehicles(vehicles);
        this.vehicleService.vehicleDetailSpinner.next(false)
      },
      (errorResponse: any) => {
        this.vehicleService.vehicleDetailSpinner.next(false)
        this.vehicleService.errorHappened.next(errorResponse.error);
      })
    );
  }
  fetchVehicleByID(id: number): Observable<Vehicle>{
    return this.http
    .get<any>(
      environment.apiUrl + '/vehicles/get/'+id
    )
    .pipe(
      tap((vehicle: Vehicle) => {
      })
    );
  }
  fetchVehiclesByParameters(p_location, p_startTime, p_endTime): Observable<Vehicle[]>{
    return this.http
            .post<Vehicle[]>(
              'https://sbdrustvo.com/vehicles/filter',
            {
              location: p_location,
              startTime: p_startTime,
              endTime: p_endTime
            })
            .pipe(
              tap((vehicles: Vehicle[]) => {
                this.vehicleService.vehicleDetailSpinner.next(false)
                this.vehicleService.setFilteredVehicles(vehicles);
              },
              (errorResponse: any) => {
                this.vehicleService.vehicleDetailSpinner.next(false)
                this.vehicleService.errorHappened.next(errorResponse.error);
              })
            );
  }
  fetchVehiclesByCarRentalId(id: string): Observable<Vehicle[]>{
    return this.http
            .get<Vehicle[]>(
              'https://sbdrustvo.com/vehicles/filter/' + id)
            .pipe(
              tap((vehicles: Vehicle[]) => {
                this.vehicleService.setFilteredVehicles(vehicles);
              })
            );
  }

  fetchAllReservations(): Observable<Reservation []>{
    return this.http
    .post<any>(
      environment.apiUrl + '/reservations/',
      {token: localStorage.getItem('userToken')}
    )
    .pipe(
      map(reservations => {
        return reservations.map(reservation => {
          return {
            ...reservation,
            user: {
              id: reservation.user.id,
              email: reservation.user.email,
              roles: reservation.user.roles,
              birthday: reservation.user.birthday,
              firstName: reservation.user.firstName,
              lastName: reservation.user.lastName
            }
          };
        });
      }),
      tap((reservations: Reservation[]) => {
        this.reservationService.saveAllReservations(reservations);
      })
    );
  }
  fetchUserReservations(): Observable<Reservation []>{
    return this.http
    .post<any>(
      environment.apiUrl + '/reservations/user/' + this.userService.getUser().id,
      {token: localStorage.getItem('userToken')}
    )
    .pipe(
      tap((reservations: Reservation[]) => {
        this.reservationService.saveUserReservations(reservations);
      })
    );
  }
  addReservation(vehicleID: number, reservation: any): Observable<any>{
    return this.http
    .post<any>(
      environment.apiUrl + '/reservations/' + vehicleID,
      {...reservation, token: localStorage.getItem('userToken')}
    )
    .pipe(
      tap(response => {
        this.fetchAllReservations();
        this.fetchUserReservations();
      })
    );
  }
  updateReservation(id: number, status: string, message: string): Observable<string>{
    return this.http
    .put<string>(
      environment.apiUrl + '/reservations/update/' + id,
      {
        token: localStorage.getItem('userToken'),
        status,
        info: message
      }
    )
    .pipe(
      tap(
        (response: string) => { },
        (errorResponse: string) => {
        }
      )
    );
  }
  removeReservation(reservationID: number): Observable<string>{
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        token: localStorage.getItem('userToken')
      }
    }
    return this.http
    .delete<any>(
      environment.apiUrl + '/reservations/' + reservationID,
      options
    )
    .pipe(
      tap(
        (response: string) => { },
        (errorResponse: string) => {  }
      )
    );
  }
  addVehicle(vehicle: any): Observable<any>{
    return this.http
    .post<any>(
      environment.apiUrl + '/vehicles/',
      {...vehicle, token: localStorage.getItem('userToken')}
    )
    .pipe(
      tap(
        (response: string) => {
        },
        (errorResponse: string) => {
        }
      )
    );
  }
  updateVehicle(vehicle: any): Observable<any>{
    return this.http
    .put<string>(
      environment.apiUrl + '/vehicles/' + vehicle.id,
      {...vehicle, token: localStorage.getItem('userToken')}
    )
    .pipe(
      tap(
        (response: string) => {
        },
        (errorResponse: string) => {
        }
      )
    );
  }
  deleteVehicle(id: number): Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        token: localStorage.getItem('userToken')
      }
    }
    return this.http
    .delete<any>(
      environment.apiUrl + '/vehicles/' + id,
      options
    )
    .pipe(
      tap(
        (response: string) => {
        },
        (errorResponse: string) => {
        }
      )
    );
  }

  setVehicleRefreshInterval(): void {
    setTimeout(() => {
      this.fetchVehicles().subscribe();
    }, this.dataRefreshInterval * 60 * 1000);
  }
}
