import {Component, OnInit, ViewChild} from '@angular/core';
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";
import {ActivatedRoute, Params} from "@angular/router";
import {MealImageService} from "../../services/meal-image.service";
import {UserService} from "../../models/user/user.service";
import {User} from "../../models/user/user";
import {MealFormComponent} from "../meal-form/meal-form.component";

@Component({
    selector: 'app-meal-details',
    templateUrl: './meal-details.component.html',
    styleUrls: ['./meal-details.component.css', '../../app.component.css']
})
export class MealDetailsComponent implements OnInit {
    meal: Meal;
    user: User;
    @ViewChild(MealFormComponent) mealFormComponent: MealFormComponent;

    constructor(private mealService: MealService,
                private activatedRoute: ActivatedRoute,
                public imageService: MealImageService,
                public userService: UserService) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let mealId = params['id'];
            this.userService.getConnectedUser().then(user => {
                this.user = user;
                this.mealService.get(mealId)
                    .then(data => {
                        this.meal = data;
                    });
            });
        });
    }

    editMeal(button) {
        this.mealFormComponent.initFromEdit(this.user, this.meal);
        button.click();
    }

    onMealUpdated(meal: Meal) {
        console.log(meal);
        this.meal = meal;
    }

}
