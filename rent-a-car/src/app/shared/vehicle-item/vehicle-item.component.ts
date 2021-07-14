import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Vehicle } from 'src/app/vehicle/vehicle.model';
import { Image } from '../image.model';
@Component({
  selector: 'app-vehicle-item',
  templateUrl: './vehicle-item.component.html',
  styleUrls: ['./vehicle-item.component.css']
})
export class VehicleItemComponent implements OnInit {

  @Input() vehicle: Vehicle;
  coverImage: string;
  params: Params;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.setCoverImage();
    this.fetchRouteParams();
  }

  setCoverImage(): void {
    const tempImage = this.vehicle.images.find((image:Image) => {
      return image.isCover === true
    })
    this.coverImage = tempImage.base64;
  }
  fetchRouteParams(): void{
    this.route.queryParams.subscribe((params: Params) => {
      this.params = params;
    });
  }

  seeCarDetail(): void {
    this.router.navigate(['/vehicle/'+this.vehicle.id], {relativeTo: this.route,queryParams: this.params});
  }
  seeRentalCar(): void {
    this.router.navigate(['/car-rental/'+this.vehicle.carRental.id]
    );
  }
}
