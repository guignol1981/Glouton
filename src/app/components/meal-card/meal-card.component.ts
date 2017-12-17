import {Component, Input, OnInit} from '@angular/core';
import {Meal} from "../../models/meal/meal";
import {Router} from "@angular/router";

@Component({
  selector: 'app-meal-card',
  templateUrl: './meal-card.component.html',
  styleUrls: ['./meal-card.component.css']
})
export class MealCardComponent implements OnInit {
  @Input() meal: Meal;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToMealDetails () {
    this.router.navigate(['/meal-details/' + this.meal._id]);
  }

}
