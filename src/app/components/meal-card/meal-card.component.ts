import {Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Meal} from "../../models/meal/meal";
import {Router} from "@angular/router";
import {User} from "../../models/user/user";
import {UserService} from "../../models/user/user.service";
import {MealService} from "../../models/meal/meal.service";
import {MealImageService} from "../../services/meal-image.service";
import {ToastsManager} from "ng2-toastr";


@Component({
    selector: 'app-meal-card',
    templateUrl: './meal-card.component.html',
    styleUrls: ['./meal-card.component.css']
})
export class MealCardComponent implements OnInit {
    @Input() meal: Meal;
    @Input() user: User;

    constructor(private router: Router,
                private mealService: MealService,
                public imageService: MealImageService,
                public toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
    }

    joinMeal() {
        this.mealService.join(this.meal)
            .then(data => {
                this.meal = data;
                this.toastr.success('Meal Joined!', 'Success!');
            });
    }

    leaveMeal() {
        this.mealService.leave(this.meal)
            .then(data => {
                this.meal = data;
                this.toastr.success('Left meal!', 'Success!');
            });
    }

    goToMealDetails() {
        this.router.navigate(['/meal-details/' + this.meal._id]);
    }

}
