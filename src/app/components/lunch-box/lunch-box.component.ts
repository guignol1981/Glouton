import {Component, OnInit} from '@angular/core';
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";
import {Router} from "@angular/router";

@Component({
    selector: 'app-lunch-box',
    templateUrl: './lunch-box.component.html',
    styleUrls: ['./lunch-box.component.css']
})
export class LunchBoxComponent implements OnInit {
    meals: Meal[];

    constructor(private mealService: MealService,
                private router: Router) {
    }

    ngOnInit() {
        this.mealService.getLunchBox().then(data => this.meals = data);
    }

    goToMealDetails(meal: Meal) {
        this.router.navigate(['meal-details/' + meal._id]);
    }

}
