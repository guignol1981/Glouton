import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";
import {AuthenticationService} from "../../services/authentication.service";
import {User} from "../../models/user/user";
import {MealImageService} from "../../services/meal-image.service";
import {FileHolder} from "angular2-image-upload";
import {ToastsManager} from "ng2-toastr";
import {UserService} from "../../models/user/user.service";
import {MealFormDateValidation} from '../../validators/meal-form-date';
import {MealFormParticipantValidation} from '../../validators/meal-form-participants';

@Component({
    selector: 'app-meal-form',
    templateUrl: './meal-form.component.html',
    styleUrls: ['./meal-form.component.css']
})
export class MealFormComponent implements OnInit {
    @Input() edit = false;
    @Output() updated: EventEmitter<Meal> = new EventEmitter<Meal>();
    meal: Meal;
    user: User;
    form: FormGroup;

    constructor(private mealService: MealService,
                public authenticationService: AuthenticationService,
                public imageService: MealImageService,
                public userService: UserService,
                public toastr: ToastsManager,
                vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        if (!this.edit) {
            this.meal = new Meal();
            this.userService.getConnectedUser().then(user => {
                this.user = user;
                this.initForm();
            });
        }
    }

    @Input()
    initFromEdit(user: User, meal: Meal) {
        this.user = user;
        this.meal = meal;
        this.initForm();
    }

    initForm() {
        this.form = new FormGroup({
            title: new FormControl(this.meal.title, [Validators.required, Validators.minLength(5)]),
            description: new FormControl(this.meal.description, [Validators.required, Validators.minLength(15)]),
            imageUrl: new FormControl(this.meal.imageUrl, Validators.required),
            date: new FormControl(this.meal.date, Validators.required),
            limitDate: new FormControl(this.meal.limitDate, Validators.required),
            minParticipants: new FormControl(this.meal.minParticipants, [Validators.required, Validators.min(1)]),
            maxParticipants: new FormControl(this.meal.maxParticipants, [Validators.required, Validators.min(1)])
        }, {validators: [MealFormDateValidation.LogicDatesSelection, MealFormParticipantValidation.LogicParticipantsSelection]});
    }

    onImageRemoved() {
        this.meal.imageUrl = null;
    }

    imageFinishedUploading(file: FileHolder) {
        this.form.get('imageUrl').setValue(JSON.parse(file.serverResponse['_body']).imageUrl);
    }

    onSubmit(closeButton) {
        let meal = <Meal>this.form.value;
        meal._id = this.meal._id;
        meal.participants = this.meal.participants;
        meal.cook = this.user;
        console.log(meal);
        this.mealService.save(meal)
            .then((updatedMeal) => {
                if (this.edit) {
                    this.toastr.success(`Meal updated!`, 'Success!');
                    this.updated.emit(updatedMeal);
                } else {
                    this.toastr.success(`Meal created!`, 'Success!');
                }

                closeButton.click();
            });
    }

    formControlIsInvalid(formControlName: string) {
        let formControl = this.form.get(formControlName);
        return !formControl.valid && !formControl.pristine;
    }

    close() {
        this.form.reset();
        this.meal = new Meal();
    }

}
