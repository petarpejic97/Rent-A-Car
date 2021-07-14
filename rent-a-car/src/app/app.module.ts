import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { VehicleReserveComponent } from './vehicle/vehicle-reserve/vehicle-reserve.component';
import { ReservationComponent } from './reservation/reservation.component';
import { HeaderComponent } from './header/header.component';
import { ReservationStatusComponent } from './reservation/reservation-status/reservation-status.component';
import { ReservationListComponent } from './reservation/reservation-list/reservation-list.component';
import { ReservationDetailComponent } from './reservation/reservation-detail/reservation-detail.component';
import { VehicleListComponent } from './vehicle/vehicle-list/vehicle-list.component';
import { ReservationItemComponent } from './shared/reservation-item/reservation-item.component';
import { VehicleItemComponent } from './shared/vehicle-item/vehicle-item.component';
import { HttpClientModule } from '@angular/common/http';
import { VehicleComponent } from './vehicle/vehicle.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MatNativeDateModule } from '@angular/material/core';
import { VehicleDetailComponent } from './vehicle/vehicle-detail/vehicle-detail.component';
import { CarRentalComponent } from './car-rental/car-rental.component';
import { FooterComponent } from './footer/footer.component';
import { VehicleEditComponent } from './vehicle/vehicle-edit/vehicle-edit.component';
import { CompanyRegisterComponent } from './company-register/company-register.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarSuccSignUpComponent } from './auth/snack-bar-succ-sign-up/snack-bar-succ-sign-up.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { ErrorAlertComponent } from './shared/error-alert/error-alert.component';
import { ButtonSpinnerComponent } from './shared/button-spinner/button-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    SignInComponent,
    SignUpComponent,
    VehicleReserveComponent,
    ReservationComponent,
    HomeComponent,
    HeaderComponent,
    ReservationStatusComponent,
    ReservationListComponent,
    ReservationDetailComponent,
    VehicleListComponent,
    ReservationItemComponent,
    VehicleItemComponent,
    VehicleComponent,
    VehicleListComponent,
    VehicleDetailComponent,
    CarRentalComponent,
    FooterComponent,
    VehicleEditComponent,
    CompanyRegisterComponent,
    SnackBarSuccSignUpComponent,
    ErrorAlertComponent,
    ButtonSpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatTabsModule,
    MatAutocompleteModule,
    FlexLayoutModule,
    MatToolbarModule,
    NoopAnimationsModule,
    MatNativeDateModule,
    MatSnackBarModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
