import {Component, Input, OnInit} from '@angular/core';
import {Meal} from "../../models/meal/meal";
import {Router} from "@angular/router";
import {User} from "../../models/user/user";
import {UserService} from "../../models/user/user.service";
import {MealService} from "../../models/meal/meal.service";
import {MealImageService} from "../../services/meal-image.service";


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
                private mealService: MealService,
                public imageService: MealImageService) {
    }

    ngOnInit() {
        this.userService.getProfile()
            .then(data => this.user = data);
    }

    asJoined() {
        let asJoined = false;

        this.meal.participants.forEach((participant) => {
            if (participant._id === this.user._id) {
                asJoined = true;
            }
        });

        return asJoined;
    }

    isCook() {
        return (this.meal.cook._id === this.user._id)
    }

    joinMeal() {
        this.mealService.join(this.meal, this.user)
            .then(data => this.meal = data);
    }

    goToMealDetails() {
        this.router.navigate(['/meal-details/' + this.meal._id]);
    }

    editMeal() {
        this.router.navigate([`/suggest/${this.meal._id}`]);
    }

}
