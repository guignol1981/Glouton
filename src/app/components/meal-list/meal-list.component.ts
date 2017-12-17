import { Component, OnInit } from '@angular/core';
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";

@Component({
  selector: 'app-meal-list',
  templateUrl: './meal-list.component.html',
  styleUrls: ['./meal-list.component.css']
})
export class MealListComponent implements OnInit {
  meals: Meal[] = [];

  constructor(private mealService: MealService) { }

  ngOnInit() {
    this.mealService.getAll().then(data => this.meals = data);
  }

}
