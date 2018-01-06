import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MealService} from '../../models/meal/meal.service';
import {Meal} from '../../models/meal/meal';
import {AuthenticationService} from '../../services/authentication.service';
import {User} from '../../models/user/user';
import {MealImageService} from '../../services/meal-image.service';
import {UserService} from '../../models/user/user.service';
import {MealFormDateValidation} from '../../validators/meal-form-date';
import {MealFormParticipantValidation} from '../../validators/meal-form-participants';
import {CropperSettings, ImageCropperComponent} from 'ng2-img-cropper';
import {NotificationsService} from 'angular2-notifications';
import {DatepickerOptions} from 'ng2-datepicker';
import * as moment from 'moment';


@Component({
    selector: 'app-meal-form',
    templateUrl: './meal-form.component.html',
    styleUrls: ['./meal-form.component.css']
})
export class MealFormComponent implements OnInit {
    @Input() editMode = false;
    @Output() updated: EventEmitter<Meal> = new EventEmitter<Meal>();
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    meal: Meal;
    user: User;
    form: FormGroup;
    data: any;
    cropperSettings: CropperSettings;
    useOwnPicture = false;
    public notificationOptions = {
        position: ['bottom', 'left'],
        timeOut: 5000,
        lastOnBottom: true
    };

    deliveryDateOptions: DatepickerOptions = {
        minDate: moment().startOf('day').add(1, 'day').startOf('day').toDate()
    };

    limitDateOptions: DatepickerOptions = {
        minDate: moment().startOf('day').toDate()
    };

    constructor(private mealService: MealService,
                public authenticationService: AuthenticationService,
                public imageService: MealImageService,
                public userService: UserService,
                public mealImageService: MealImageService,
                private notificationService: NotificationsService) {
    }

    ngOnInit() {
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 200;
        this.cropperSettings.height = 200;
        this.cropperSettings.croppedWidth = 300;
        this.cropperSettings.croppedHeight = 300;
        this.cropperSettings.noFileInput = true;

        this.data = {};

        if (!this.editMode) {
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


    fileChangeListener($event) {
        let image: any = new Image();
        let file: File = $event.target.files[0];
        let myReader: FileReader = new FileReader();
        let me = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            me.cropper.setImage(image);
        };

        myReader.readAsDataURL(file);
    }

    initForm() {
        this.form = new FormGroup({
            title: new FormControl(this.meal.title, [Validators.required, Validators.minLength(5)]),
            description: new FormControl(this.meal.description, [Validators.required, Validators.minLength(15)]),
            contribution: new FormControl(this.meal.contribution, [Validators.required, Validators.min(0)]),
            deliveryDate: new FormControl(this.meal.deliveryDate, Validators.required),
            limitDate: new FormControl(this.meal.limitDate, Validators.required),
            minParticipants: new FormControl(this.meal.minParticipants, [Validators.required, Validators.min(1)]),
            maxParticipants: new FormControl(this.meal.maxParticipants, [Validators.required, Validators.min(1)])
        }, {
            validators: [
                MealFormDateValidation.LimitDateShouldBeAtLeastToday,
                MealFormDateValidation.LimitDateShouldBeLowerThanDeliveryDate,
                MealFormDateValidation.deliveryDateShouldBeGreaterThanToday,
                MealFormParticipantValidation.LogicParticipantsSelection,
                MealFormParticipantValidation.minMinParticipants
            ]
        });
    }

    toggleUseOwnPicture() {
        this.useOwnPicture = !this.useOwnPicture;
        this.data.image = null;
    }

    onSubmit(closeButton) {
        let me = this;
        let saveMeal = function (imageData) {
            let meal = <Meal>me.form.value;
            let hasParticipants = me.meal.participants.length > 0;

            meal._id = me.meal._id;
            meal.image = imageData ? JSON.parse(imageData['_body']).image : meal.image;
            meal.participants = me.meal.participants;
            meal.cook = me.user;


            me.mealService.save(meal)
                .then((updatedMeal) => {
                    if (me.editMode) {
                        if (hasParticipants && updatedMeal.participants.length === 0) {
                            me.notificationService.warn('participants have been removed', 'we warned them!');
                        }

                        me.notificationService.success(`Lunch proposition updated!`);
                    } else {
                        me.notificationService.success(`Lunch proposition created!`);
                    }

                    me.updated.emit(updatedMeal);
                    closeButton.click();
                });
        };
        if (!me.editMode && me.useOwnPicture) {
            me.mealImageService.postImage(me.data.image).subscribe(data => {
                saveMeal(data);
            });
        } else {
            saveMeal(null);
        }
    }

    formControlIsInvalid(formControlName: string) {
        let formControl = this.form.get(formControlName);
        return !formControl.valid && !formControl.pristine;
    }


    close() {
        this.useOwnPicture = false;
        if (this.cropper) {
            this.cropper.reset();
        }
        this.meal = new Meal();
        this.initForm();
    }

}
