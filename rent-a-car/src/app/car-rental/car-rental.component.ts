import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { report } from 'process';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { VehicleService } from '../shared/vehicle.service';
import { Vehicle } from '../vehicle/vehicle.model';
import { CarRental } from './car-rental.model';

@Component({
  selector: 'app-car-rental',
  templateUrl: './car-rental.component.html',
  styleUrls: ['./car-rental.component.css']
})
export class CarRentalComponent implements OnInit {
  vehicles: Vehicle[];
  defaultImage = 'https://www.mexperience.com/wp-content/uploads/Car-Rental-Sign-NBS-750x375.jpg';
  rentalImage: string;
  carRental: CarRental = {
    id: 0,
    name: '',
    city: '',
    address: '',
    owner: '',
    contactNumber: '',
    email: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    image: ''
  };
  subscription: Subscription;
  id: number;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              private vehicleService: VehicleService,
              private dataStorageService: DataStorageService) {
  }

  ngOnInit(): void {
    this.getParametersFromRoute();
    this.fetchVehicleByCarRental();
  }
  getParametersFromRoute(): void{
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.http
        .post<any>(
          'https://sbdrustvo.com/carrental/' + params.id,
          {}
        )
        .subscribe(responseData => {
          this.carRental = responseData[0];
          if(this.carRental.image === ''){
            this.rentalImage = this.defaultImage;
          }
          else{
            this.rentalImage = this.carRental.image;
          }
        });
      });
  }
  fetchVehicleByCarRental(): void {
    this.dataStorageService.fetchVehiclesByCarRentalId(this.id.toString())
        .subscribe( response => {
          this.vehicles = response;
        })
  }
}
