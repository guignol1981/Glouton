import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";
import {ActivatedRoute, Params} from "@angular/router";
import {MealImageService} from "../../services/meal-image.service";
import {UserService} from "../../models/user/user.service";
import {User} from "../../models/user/user";
import {MealFormComponent} from "../meal-form/meal-form.component";
import {ToastsManager} from "ng2-toastr";

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
                public userService: UserService,
                public toastr: ToastsManager,
                vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
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

    joinMeal() {
        this.mealService.join(this.meal)
            .then(meal => {
                this.meal = meal;
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

    editMeal(button) {
        this.mealFormComponent.initFromEdit(this.user, this.meal);
        button.click();
    }

    onMealUpdated(meal: Meal) {
        this.meal = meal;
    }

}
