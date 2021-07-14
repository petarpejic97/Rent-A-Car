import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SnackBarSuccSignUpComponent } from '../auth/snack-bar-succ-sign-up/snack-bar-succ-sign-up.component';
import { User } from '../auth/user.model';
import { UserService } from '../auth/user.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-company-register',
  templateUrl: './company-register.component.html',
  styleUrls: ['./company-register.component.css']
})
export class CompanyRegisterComponent implements OnInit {
  imageExtensions: string[] = ['jpg','jpeg','png'];
  imageIsValid: boolean;
  imageSelected: boolean = false;
  companyForm: FormGroup;
  options: string[] = ['Zagreb', 'Split', 'Osijek', 'Rijeka'];
  filteredOptions: Observable<string[]>;
  city: FormControl = new FormControl();
  uploadedImage = '';
  imgTitle = 'Choose image';
  loggedUser: User;
  registerCompanyErrorAppeared: boolean = false;
  constructor(private userService: UserService,
              private http: HttpClient,
              private router: Router) { }

  ngOnInit(): void {
    this.filteredOptions = this.city.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.initForm();
    this.getUserInfo();

  }
  getUserInfo(){
      this.loggedUser = this.userService.getUser();
      if (this.loggedUser === undefined){
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
            this.userService.saveUser(this.loggedUser);
          },
          errorResponse => {
            localStorage.removeItem('userToken');
          }
        )
      );
      }
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  initForm(): void{
    this.companyForm = new FormGroup({
      companyName : new FormControl('', [
        Validators.required,
        this.noWhitespaceValidator
      ]),
      city : new FormControl('', [
        Validators.required,
        this.allowCity.bind(this)
      ]),
      address : new FormControl('', [
        Validators.required,
        this.noWhitespaceValidator
      ]),
      phoneNumber : new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      email : new FormControl('', [
        Validators.required,
        Validators.email
      ]),
    });
  }
  public noWhitespaceValidator(control: FormControl): any {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  allowCity(control: FormControl): {[s: string]: boolean} {
    const isInputIncluded = this.options.includes(control.value)
    return isInputIncluded ? null : {allowCity: true}
  }
  getError(formControl: FormControl): string {
    if(formControl.hasError('required')){
      return 'Field is required!';
    }
    if(formControl.hasError('whitespace')){
      return 'Enter is not valid!'
    }
    if (formControl.hasError('allowCity')) {
      return 'Not valid city. Please choose one from list!';
    }
    if (formControl.hasError('companyName')) {
      return 'Not a valid enter!';
    }
    if (formControl.hasError('city')) {
      return 'Not a valid enter!';
    }
    if (formControl.hasError('email')) {
      return 'Not a valid email!';
    }
    if (formControl.hasError('pattern')) {
      return 'Phone number is not valid!';
    }
    else {
      return 'Enter is not valid!';
    }
  }
  onSubmit(form){
    if (!form.valid || !this.imageIsValid) {
      return;
    }
    this.http
        .post<any>(
          'https://sbdrustvo.com/carrental/',
          {
            user: this.loggedUser.id,
            name: form.value.companyName,
            city: form.value.city,
            address: form.value.address,
            contactNumber: form.value.phoneNumber,
            email: form.value.email,
            image: this.uploadedImage,
            token: localStorage.getItem('userToken')
          }
        )
        .subscribe(
          responseData => {
            if (responseData){
              this.router.navigate(['/home']);
              this.userService.successCompanyRegister.next(true);
            }
          },
          errorResponse => {
            this.userService.companyRegisterError.next(errorResponse.error)
          }
        );
  }
  handleImageSelect(event,image): void {
    this.imageSelected = true;
    let extension = image.value.split('.').pop();
    console.log(this.imageIsValid)
    this.imageIsValid = this.validateImageExtension(extension);
    this.fetchBase64ImagePaths(event);
  }
  fetchBase64ImagePaths(event) {
    this.imgTitle = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.uploadedImage = reader.result as string;
    };
  }
  validateImageExtension(extension: string): boolean{
    if(this.imageExtensions.includes(extension)){
      return true;
    }
    else{
      return false;
    }
  }

  getImageMessage(): string{
    if(this.imageIsValid){
      return 'Image is valid.';
    }
    else{
      return 'Image is not valid! (Only: jpg,jpeg and png formats are allowed.)';
    }
  }
}
