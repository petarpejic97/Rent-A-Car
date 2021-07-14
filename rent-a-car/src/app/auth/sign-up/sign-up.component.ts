import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ɵINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  passwordNotMatch = false;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm(): void{
    this.signUpForm = new FormGroup({
      firstName : new FormControl('', [
        Validators.required,
        Validators.pattern(/^\S*$/)
      ]),
      lastName : new FormControl('', [
        Validators.required,
        Validators.pattern(/^\S*$/)
      ]),
      dateOfBirth : new FormControl('', [
        Validators.required
      ]),
      email : new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password : new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confPassword : new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }
  getFirstNameErrorMessage(): string {
    if (this.signUpForm.controls.firstName.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.signUpForm.controls.firstName.hasError('pattern')) {
      return 'Required one word input';
    }
    return this.signUpForm.controls.firstName.hasError('firstName') ? 'Not a valid enter' : '';
  }
  getLastNameErrorMessage(): string {
    if (this.signUpForm.controls.lastName.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.signUpForm.controls.lastName.hasError('pattern')) {
      return 'Required one word input';
    }
    return this.signUpForm.controls.lastName.hasError('lastName') ? 'Not a valid enter' : '';
  }
  getEmailErrorMessage(): string {
    if (this.signUpForm.controls.email.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.signUpForm.controls.email.hasError('email')) {
      return 'Not a valid email';
    }
    return this.signUpForm.controls.email.hasError('email') ? 'Not a valid enter' : '';
  }
  getPasswordErrorMessage(): string {
    if (this.signUpForm.controls.password.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.signUpForm.controls.password.hasError('minlength')) {
      return 'Password must be longer';
    }
    return this.signUpForm.controls.password.hasError('password') ? 'Not a valid enter' : '';
  }
  getConfPasswordErrorMessage(): string {
    if (this.signUpForm.controls.password.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.signUpForm.controls.password.hasError('minlength')) {
      return 'Password must be longer';
    }
    return this.signUpForm.controls.password.hasError('password') ? 'Not a valid enter' : '';
  }

  onSubmit(form): void {
    if (!form.valid) {
      return;
    }
    if(this.signUpForm.controls.password.value !== this.signUpForm.controls.confPassword.value){
      this.passwordNotMatch = true;
      return;
    }
    console.log("ovdje ne smije")
    this.http
        .post<any>(
          'https://sbdrustvo.com/register',
          {
            firstName: form.value.firstName,
            lastName: form.value.lastName,
            birthday: form.value.dateOfBirth,
            email: form.value.email,
            password: form.value.password
          }
        )
        .subscribe(responseData => {
            if (responseData === 'success'){
              this.router.navigate(['../sign-in'],
                {
                  relativeTo: this.route,
                }
              );
              this.authService.succLogin.next(true);
              form.reset();
            }
        });
  }
  
  hideMessage(): void {
    this.passwordNotMatch = false;
  }
}
