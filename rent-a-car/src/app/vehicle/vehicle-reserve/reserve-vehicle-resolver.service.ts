import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Resolve, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { VehicleService } from 'src/app/shared/vehicle.service';
import { Vehicle } from '../vehicle.model';

@Injectable({ providedIn: 'root' })
export class ReserveVehicleResolverService implements Resolve<Vehicle[]>{

  constructor(
    private vehicleService: VehicleService,
    private dataStorageService: DataStorageService,
    private route: ActivatedRoute
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Vehicle[] | Observable<Vehicle[]> | Promise<Vehicle[]>{
      this.vehicleService.vehicleDetailSpinner.next(true)
      const vehicles = this.vehicleService.getVehicles();
      if (vehicles.length === 0){
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
}
