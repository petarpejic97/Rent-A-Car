import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Params, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { EMPTY, Observable } from "rxjs";
import { DataStorageService } from "../shared/data-storage.service";
import { VehicleService } from "../shared/vehicle.service";
import { Vehicle } from "./vehicle.model";
import { catchError } from 'rxjs/internal/operators/catchError';
import { HeaderService } from "../header/header.service";
import { filter } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class VehicleResolverService implements Resolve<Vehicle[]>{

  constructor(
    private vehicleService: VehicleService,
    private dataStorageService: DataStorageService,
    private headerService: HeaderService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Vehicle[] | Observable<Vehicle[]> | Promise<Vehicle[]>{
    
    if (Object.keys(route.queryParams).length === 0) {
      const vehicles = this.vehicleService.getVehicles();
      if(vehicles.length === 0){
        this.vehicleService.vehicleDetailSpinner.next(true)
        this.dataStorageService.setVehicleRefreshInterval();
        return this.dataStorageService.fetchVehicles().pipe(
          catchError((error) => {
            return EMPTY;
          })
        );
      }
      else {
        return vehicles;
      }
    }
    else{
      this.vehicleService.vehicleDetailSpinner.next(true)
      return this.dataStorageService.fetchVehiclesByParameters(
        route.queryParams.location,
        route.queryParams.start_date,
        route.queryParams.end_date).pipe(
          catchError((error) => {
            return EMPTY;
          })
      );
    }
  }
}
