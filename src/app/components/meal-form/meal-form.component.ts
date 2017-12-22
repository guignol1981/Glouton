import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";
import {AuthenticationService} from "../../services/authentication.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../models/user/user.service";
import {User} from "../../models/user/user";
import {MealImageService} from "../../services/meal-image.service";
import {FileHolder} from "angular2-image-upload";

@Component({
    selector: 'app-meal-form',
    templateUrl: './meal-form.component.html',
    styleUrls: ['./meal-form.component.css']
})
export class MealFormComponent implements OnInit {
    form: FormGroup;
    meal: Meal = new Meal();
    user: User;

    constructor(private mealService: MealService,
                public authenticationService: AuthenticationService,
                private userService: UserService,
                public imageService: MealImageService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        let mealId = this.activatedRoute.snapshot.paramMap.get('id');
        if (mealId) {
            this.mealService.get(mealId)
                .then(data => {
                    this.meal = data;
                    this.initForm();
                });
        } else {
            this.meal = new Meal();
            this.initForm();
        }
    }

    initForm() {
        this.userService.getProfile().then(
            data => {
                this.user = data;
                this.form = new FormGroup({
                    title: new FormControl(this.meal.title, [Validators.required, Validators.minLength(10)]),
                    description: new FormControl(this.meal.description, [Validators.required, Validators.minLength(30)]),
                    imageUrl: new FormControl(this.meal.imageUrl, Validators.required),
                    date: new FormControl(this.meal.date, Validators.required),
                    limitDate: new FormControl(this.meal.limitDate, Validators.required),
                    minParticipants: new FormControl(this.meal.minParticipants, [Validators.required, Validators.min(1)]),
                    maxParticipants: new FormControl(this.meal.maxParticipants, [Validators.required, Validators.min(1)])
                });
            }
        );
    }

    onImageRemoved() {
        this.meal.imageUrl = null;
    }

    imageFinishedUploading(file: FileHolder) {
        this.form.get('imageUrl').setValue(JSON.parse(file.serverResponse['_body']).imageUrl);
    }

    onSubmit() {
        let meal = <Meal>this.form.value;
        meal._id = this.meal._id;
        meal.participants = [];
        meal.cook = this.user;

        this.mealService.save(meal)
            .then(
                data => console.log(data)
            );
    }

    displayFormControlValidationMessage(formControlName: string) {
        let formControl = this.form.get(formControlName);
        return ! formControl.valid && ! formControl.pristine;
    }

}
