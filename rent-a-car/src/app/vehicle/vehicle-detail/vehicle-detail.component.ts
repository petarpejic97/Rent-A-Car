import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/auth/user.model';
import { UserService } from 'src/app/auth/user.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Image } from 'src/app/shared/image.model';
import { VehicleService } from 'src/app/shared/vehicle.service';
import { Vehicle } from '../vehicle.model';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {

  spinnerIsClosed: boolean = false;
  vehiclesSubscription: Subscription;
  userSubscription: Subscription;
  loggedUser: User;
  vehicle: Vehicle;
  vehicleImages: Image[];

  currentImage = 1;
  imageWidth: number;
  imagesCount: number;
  borders: number[] = [];

  routeParams: Params;

  filterForm: FormGroup;
  formIsValid: boolean = false;
  minDate: Date = new Date();
  minDate2: Date;
  options: string[] = ['Zagreb', 'Split', 'Osijek', 'Rijeka'];
  filteredOptions: Observable<string[]>;

  warningWindowIsOpened: boolean = false;

  startTime: string;
  endTime: string;
  constructor(
    private userService: UserService,
    private vehicleService: VehicleService,
    private element: ElementRef,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private dataStorageService: DataStorageService
  ) { }

  ngOnInit(): void {
    this.fetchVehicle();
    this.fetchUser();
  }
  fetchVehicle(): void {
    const id = +this.activeRoute.snapshot.paramMap.get('id');
    let vehicles = this.vehicleService.getVehicles();
    if(vehicles.length>0){
      this.vehicle = this.vehicleService.getVehicle(id);
      this.vehicleService.vehicleDetailSpinner.next(false)
      this.showVehicle();
    }
    else{
      this.dataStorageService.fetchVehicleByID(+id).subscribe(vehicle => {
        this.vehicle = vehicle[0];
        this.vehicleService.vehicleDetailSpinner.next(false)
        this.showVehicle();
      });
    }
  }
  fetchUser(): void{
    if(!this.userService.getUser()){
      this.userSubscription = this.userService.userChanged.subscribe(user=>{
        this.loggedUser = this.userService.getUser();
      })
    }
    else{
      this.loggedUser = this.userService.getUser();
    }
  }

  showVehicle(): void{
    this.spinnerIsClosed = true;
    setTimeout(()=>{
      this.initImagesData();
    },500)
  }
  initImagesData(): void {
    const image = this.element.nativeElement.querySelector('.slide-container');
    this.imageWidth = image.offsetWidth;
    this.imagesCount = this.vehicle.images.length;
    this.initBorders();
  }
  initBorders(): void {
    for (let i = 0; i < this.vehicle.images.length; i++) {
      this.borders.push(i * this.imageWidth);
    }
  }
  handleScroll(data): void {
    const currentOffset = data.target.scrollLeft;
    if (currentOffset < this.imageWidth) {
      this.currentImage = 1;
    }
    else if (currentOffset > this.borders[this.currentImage] && currentOffset < this.borders[this.currentImage + 1]) {
      this.currentImage++;
    }
    else if (currentOffset < this.borders[this.currentImage - 1]) {
      this.currentImage--;
    }
    else if (currentOffset >= ((this.imagesCount - 1) * this.imageWidth)) {
      this.currentImage = this.imagesCount;
    }
  }
  fetchParams(): void {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.routeParams = params;
    });
  }
  handleReservation(): void {
    this.fetchParams();
    if (this.routeParams.location === undefined) {
      this.initForm();
      this.validateForm();
      this.warningWindowIsOpened = true;
    }
    else {
      this.navigateTonConfirmScreen();
    }
  }
  initForm(): void {
    this.filterForm = new FormGroup({
      location: new FormControl(null, [Validators.required]),
      start_date: new FormControl(null, [Validators.required]),
      end_date: new FormControl(null, [Validators.required])
    });
    this.filterForm.controls.location.setValue(this.vehicle.carRental.city);
    this.filterForm.controls.location.disable();
    this.filterPlaceOptions();
  }
  filterPlaceOptions(): void {
    this.filteredOptions = this.filterForm.controls.location.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  validateForm(): void {
    this.filterForm.valueChanges.subscribe(val => {
      if (this.filterForm.status === 'VALID') {
        this.formIsValid = true;
      }
      if (this.filterForm.status === 'INVALID') {
        this.formIsValid = false;
      }
    });
  }
  closeWarning(): void {
    this.warningWindowIsOpened = false;
  }

  fetchStartDate(date): void {
    this.minDate2 = date;
  }

  navigateToEditScreen(): void {
    this.router.navigate(['/vehicle/' + this.vehicle.id + '/edit']);
  }
  formatDates(startDate, endDate): void{
    let start_date = new Date(startDate)
    let end_date = new Date(endDate)
    this.startTime = start_date.getFullYear() + '-' + (start_date.getMonth() + 1) + '-' + start_date.getDate();
    this.endTime = end_date.getFullYear() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getDate();
  }
  navigateTonConfirmScreen(): void {
    if (!this.routeParams.location) {
      this.formatDates(this.filterForm.controls.start_date.value,this.filterForm.controls.end_date.value)
      this.routeParams = {
        location: this.vehicle.carRental.city,
        start_date: this.startTime,
        end_date: this.endTime
      };
    }
    this.dataStorageService.fetchVehiclesByParameters(this.routeParams.location, this.routeParams.start_date,this.routeParams.end_date).subscribe(
      (response:Vehicle[]) => {
        if(response.includes(this.vehicle)){
           this.router.navigate(['/home']);
        }
        else{
           this.router.navigate(['reserve'], { relativeTo: this.activeRoute, queryParams: this.routeParams });
        }
      }
    );

  }
  deleteCurrentVehicle(): void{
    this.vehicleService.deleteVehicle(this.vehicle.id);
    this.dataStorageService.deleteVehicle(this.vehicle.id).subscribe();
    this.router.navigate(['/vehicle']);
  }
  getYear(date:any): number{
    let tempDate;
    if(date.date){
      tempDate = new Date(date.date);
    }
    else{
      tempDate = new Date(date);
    }
    let year = +tempDate.getFullYear();
    return year;
  }
  fetchCurrentLink(): string{
    return window.location.href;
  }
  ngOnDestroy(): void {
    if (this.vehiclesSubscription) {
      this.vehiclesSubscription.unsubscribe();
    }
    if(this.userSubscription){
      this.userSubscription.unsubscribe();
    }
  }
}
