import {Component, OnDestroy, OnInit} from '@angular/core';
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'app-meal-list',
    templateUrl: './meal-list.component.html',
    styleUrls: ['./meal-list.component.css']
})
export class MealListComponent implements OnInit, OnDestroy {
    meals: Meal[] = [];
    mealsSubscribtion: Subscription;

    constructor(private mealService: MealService) {
    }

    ngOnInit() {
        this.mealsSubscribtion = this.mealService.mealsSubject.subscribe(data => this.meals = data);
        this.mealService.getAll().then(data => {
            console.log(data);
            this.meals = data;
        });
    }

    ngOnDestroy() {
        this.mealsSubscribtion.unsubscribe();
    }

}
