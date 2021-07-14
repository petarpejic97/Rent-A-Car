import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar-succ-sign-up',
  templateUrl: './snack-bar-succ-sign-up.component.html',
  styleUrls: ['./snack-bar-succ-sign-up.component.css']
})
export class SnackBarSuccSignUpComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }

  ngOnInit(): void {
  }

}
