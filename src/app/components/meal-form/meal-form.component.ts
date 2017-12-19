import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {UserService} from "../../models/user/user.service";
import {User} from "../../models/user/user";

@Component({
    selector: 'app-meal-form',
    templateUrl: './meal-form.component.html',
    styleUrls: ['./meal-form.component.css']
})
export class MealFormComponent implements OnInit {
    form: FormGroup;
    user: User;

    constructor(private mealService: MealService,
                private authenticationService: AuthenticationService,
                private router: Router,
                private userService: UserService) {
    }

    ngOnInit() {
        if (!this.authenticationService.isLoggedIn()) {
            this.router.navigate(['login']);
            return;
        }

        this.userService.getProfile().then(
            data => {
                this.user = data;
                this.form = new FormGroup({
                    title: new FormControl(),
                    description: new FormControl(),
                    imageUrl: new FormControl(),
                    date: new FormControl(),
                    minParticipants: new FormControl()
                });
            }
        );
    }

    onSubmit() {
        let meal = <Meal>this.form.value;
        meal.participants = [];
        meal.cook = this.user;
        this.mealService.save(meal)
            .then(
                data => console.log(data)
            );
    }

}
