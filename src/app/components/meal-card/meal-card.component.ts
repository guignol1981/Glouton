import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
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
    user: User;

    constructor(private router: Router,
                private userService: UserService,
                private mealService: MealService,
                public imageService: MealImageService,
                public toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.userService.getConnectedUser()
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
        return (this.meal.cook._id === this.user._id);
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

    editMeal() {

    }

}
