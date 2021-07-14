import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { VehicleReserveComponent } from './vehicle/vehicle-reserve/vehicle-reserve.component';
import { VehicleDetailComponent } from './vehicle/vehicle-detail/vehicle-detail.component';
import { VehicleEditComponent } from './vehicle/vehicle-edit/vehicle-edit.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ReservationListComponent } from './reservation/reservation-list/reservation-list.component';
import { ReservationDetailComponent } from './reservation/reservation-detail/reservation-detail.component';
import { ReservationStatusComponent } from './reservation/reservation-status/reservation-status.component';
import { VehicleListComponent } from './vehicle/vehicle-list/vehicle-list.component';
import { CarRentalComponent } from './car-rental/car-rental.component';
import { CompanyRegisterComponent } from './company-register/company-register.component';
import { VehicleResolverService } from './vehicle/vehicle-resolver.service';
import { AuthResolverService } from './auth/auth-resolver.service';
import { ReservationResolverService } from './reservation/reservation-resolver.service';
import { ReserveVehicleResolverService } from './vehicle/vehicle-reserve/reserve-vehicle-resolver.service';
import { AuthGuard } from './auth/auth.guard';
import { OwnerGuard } from './auth/owner.guard';
import { UserGuard } from './auth/user.guard';
import { GuestGuard } from './auth/guest.guard';


const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    resolve: [AuthResolverService]
  },
  {
    path: 'vehicle',
    component: VehicleComponent,
    resolve: [AuthResolverService],
    children: [
      { path: '', component: VehicleListComponent , resolve: [VehicleResolverService]},
      { path: 'new', component: VehicleEditComponent, canActivate:[AuthGuard,OwnerGuard] },
      { path: ':id', component: VehicleDetailComponent,  canActivate:[AuthGuard],resolve: [VehicleResolverService]},
      { path: ':id/edit', component: VehicleEditComponent , canActivate:[AuthGuard,OwnerGuard],resolve: [VehicleResolverService]},
      { path: ':id/reserve', component: VehicleReserveComponent , canActivate:[AuthGuard], resolve: [ReserveVehicleResolverService]}
    ]
  },
  {
    path: 'reservation',
    component: ReservationComponent,
    canActivate:[AuthGuard],
    resolve: [AuthResolverService,ReservationResolverService],
    children: [
      { path: '', component: ReservationListComponent },
      { path: ':id', component: ReservationDetailComponent },
      { path: ':id/status', component: ReservationStatusComponent }
    ]
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate:[GuestGuard],
    children: [
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent }
    ]
  },
  {
    path: 'car-rental/:id',
    component: CarRentalComponent,
    resolve: [VehicleResolverService]
  },
  {
    path: 'company-register',
    resolve: [AuthResolverService],
    canActivate:[AuthGuard,UserGuard],
    component: CompanyRegisterComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
