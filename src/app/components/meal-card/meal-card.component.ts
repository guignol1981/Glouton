import {Component, Input, OnInit} from '@angular/core';
import {Meal} from "../../models/meal/meal";
import {Router} from "@angular/router";
import {User} from "../../models/user/user";
import {AuthenticationService} from "../../services/authentication.service";
import {UserService} from "../../models/user/user.service";
import {MealService} from "../../models/meal/meal.service";

@Component({
    selector: 'app-meal-card',
    templateUrl: './meal-card.component.html',
    styleUrls: ['./meal-card.component.css']
})
export class MealCardComponent implements OnInit {
    @Input() meal: Meal;
    user: User;

    constructor(private router: Router,
                private userService: UserService,
                private mealService: MealService) {
    }

    ngOnInit() {
        this.userService.getProfile()
            .then(data => this.user = data);
    }

    joinMeal() {
        this.mealService.join(this.meal, this.user)
            .then(data => console.log('joined!'));
    }

    goToMealDetails() {
        this.router.navigate(['/meal-details/' + this.meal._id]);
    }

}
