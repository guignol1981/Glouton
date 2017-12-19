import {Component, OnInit} from '@angular/core';
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
    selector: 'app-meal-details',
    templateUrl: './meal-details.component.html',
    styleUrls: ['./meal-details.component.css']
})
export class MealDetailsComponent implements OnInit {
    meal: Meal;

    constructor(private mealService: MealService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let mealId = params['id'];

            this.mealService.get(mealId)
                .then(data => this.meal = data);
        });
    }

}
