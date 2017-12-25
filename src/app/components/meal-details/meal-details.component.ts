import {Component, OnInit} from '@angular/core';
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";
import {ActivatedRoute, Params} from "@angular/router";
import {MealImageService} from "../../services/meal-image.service";
import {UserService} from "../../models/user/user.service";
import {MessageService} from "../../services/message.service";
import {User} from "../../models/user/user";

@Component({
    selector: 'app-meal-details',
    templateUrl: './meal-details.component.html',
    styleUrls: ['./meal-details.component.css']
})
export class MealDetailsComponent implements OnInit {
    meal: Meal;
    user: User;

    constructor(private mealService: MealService,
                private activatedRoute: ActivatedRoute,
                public imageService: MealImageService,
                public userService: UserService,
                public messageService: MessageService) {
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

}
