import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { User } from 'src/app/auth/user.model';
import { UserService } from 'src/app/auth/user.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { VehicleService } from 'src/app/shared/vehicle.service';
import { environment } from 'src/environments/environment';
import { Vehicle } from '../vehicle.model';

@Component({
  selector: 'app-vehicle-reserve',
  templateUrl: './vehicle-reserve.component.html',
  styleUrls: ['./vehicle-reserve.component.css']
})
export class VehicleReserveComponent implements OnInit {
  backgroundColor = 'rgb(255, 211, 130)';
  vehicle: Vehicle = null;
  selected = 'Cash';
  modelYear = '';
  manufactureYear = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
  numberOfDays = 0;
  loggedUser: User;
  userBirthday: Date = new Date();
  coverImage: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private http: HttpClient,
    private userService: UserService,
    private dataStorageService: DataStorageService
    ) { }

  ngOnInit(): void {
    this.getParametersFromURL();
    this.getUserInfo();
  }
  getParametersFromURL(): void{
    this.vehicleService.vehicleDetailSpinner.next(false)
    this.route.params.subscribe(
      (params: Params) => {
        if(this.vehicleService.getVehicles().length>0){
          this.vehicle = this.vehicleService.getVehicle(+params.id);
          this.setUpCarYears();
          this.setCarImage();
        }
        else{
          this.dataStorageService.fetchVehicleByID(+params.id).subscribe(vehicle=>{
            this.vehicle = vehicle[0];
          })
          this.setUpCarYears();
          this.setCarImage();
        }
      }
    );
    this.route.queryParams.subscribe(
      (params: Params) => {
        this.setUpReservationDates(params);
      }
    );
  }
  setCarImage(): void{
    const imageObject = this.vehicle.images.find( imageObject => imageObject.isCover === true);
    this.coverImage = imageObject.base64;
  }
  setUpCarYears(): void{
      this.manufactureYear = this.vehicle.manufactureYear.date.split('-')[0];
      this.modelYear = this.vehicle.modelYear.date.split('-')[0];
  }
  setUpReservationDates(params: any): void{
    this.startDate = new Date(params.start_date);
    this.endDate = new Date(params.end_date);
    this.getNumberOfDays();
  }
  getNumberOfDays(): void{
    const diff = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    this.numberOfDays = Math.ceil(diff / (1000 * 3600 * 24));
  }
  getUserInfo(): void{
    this.loggedUser = this.userService.getUser();
    if (this.userService.getUser() === undefined){
      this.http
      .post<any>(
        environment.apiUrl + '/auth',
        {
          token: localStorage.getItem('userToken')
        }
      )
      .pipe(
        tap(
          (responseData: any) => {
            this.loggedUser = responseData;
            this.userBirthday = responseData.birthday;
            this.userService.saveUser(this.loggedUser);
          },
          errorResponse => {
            localStorage.removeItem('userToken');
          }
        )
      );
    }
  }

  sendReservation(): void{
    const reservation = this.fetchReservationData();
    this.dataStorageService.addReservation(this.vehicle.id, reservation).subscribe(
      response => {
        this.router.navigate(['/home']);
        this.vehicleService.successVehicleReservation.next(true);
      },
      errorResponse => {}
    );
  }

  fetchReservationData(): any{
    const reservation = {
      user_id: this.loggedUser.id,
      startTime: this.startDate,
      endTime: this.endDate,
      paymentMethod: this.selected,
      paymentAmount: this.vehicle.price * this.numberOfDays + 5,
      carRental: this.vehicle.carRental.id,
      info: ''

    };
    return reservation;
  }
  getSelected(event: MatSelectChange){
  }
}
