import {Component, OnDestroy, OnInit} from '@angular/core';
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../../models/user/user.service";
import {User} from "../../models/user/user";

@Component({
    selector: 'app-meal-list',
    templateUrl: './meal-list.component.html',
    styleUrls: ['./meal-list.component.css']
})
export class MealListComponent implements OnInit, OnDestroy {
    meals: Meal[] = [];
    user: User;
    mealsSubscription: Subscription;

    constructor(private userService: UserService,
                private mealService: MealService) {
    }

    ngOnInit() {
        this.userService.getConnectedUser().then(user => {
            this.user = user;
            this.mealsSubscription = this.mealService.mealsSubject.subscribe(data => this.meals = data);
            this.mealService.getList().then(data => this.meals = data);
        });
    }

    ngOnDestroy() {
        this.mealsSubscription.unsubscribe();
    }

}
