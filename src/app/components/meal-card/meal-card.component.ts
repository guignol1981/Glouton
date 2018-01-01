import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Meal} from "../../models/meal/meal";
import {Router} from "@angular/router";
import {User} from "../../models/user/user";
import {MealService} from "../../models/meal/meal.service";
import {MealImageService} from "../../services/meal-image.service";
import {NotificationsService} from "angular2-notifications";


@Component({
    selector: 'app-meal-card',
    templateUrl: './meal-card.component.html',
    styleUrls: ['./meal-card.component.css', '../../app.component.css']
})
export class MealCardComponent implements OnInit {
    @Input() meal: Meal;
    @Input() user: User;
    @Output() updated: EventEmitter<Meal> = new EventEmitter<Meal>();

    public notificationOptions = {
        position: ["bottom", "left"],
        timeOut: 5000,
        lastOnBottom: true
    };

    constructor(private router: Router,
                private mealService: MealService,
                public imageService: MealImageService,
                private notificationService: NotificationsService) {
    }

    ngOnInit() {
    }

    joinMeal() {
        this.mealService.join(this.meal)
            .then(data => {
                this.meal = data;
                this.notificationService.success('You joined the lunch proposition!');
                this.updated.emit(this.meal);
            });
    }

    leaveMeal() {
        this.mealService.leave(this.meal)
            .then(data => {
                this.meal = data;
                this.notificationService.success('You left the lunch proposition!');
                this.updated.emit(this.meal);
            });
    }

    goToMealDetails() {
        this.router.navigate(['/lunch-details/' + this.meal._id]);
    }

}
