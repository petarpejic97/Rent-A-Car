import { Component, OnInit } from '@angular/core';
import { VehicleService } from './shared/vehicle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rent-a-car';
  spinner=false;
  constructor(
    private vehicleService: VehicleService
  ) {}
  ngOnInit(): void {
    this.vehicleService.vehicleDetailSpinner.subscribe(
      value => {
          this.spinner = value;
      }
    )
  }
}
