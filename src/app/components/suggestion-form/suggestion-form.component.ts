import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DialogComponent, DialogService} from "ng2-bootstrap-modal";
import {Meal} from "../../models/meal/meal";
import * as moment from 'moment';
import {User} from "../../models/user/user";
import {Group} from "../../models/group/group";
import {CropperSettings, ImageCropperComponent} from "ng2-img-cropper";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MealType} from "../../models/meal/meal-type.enum";
import {DatepickerOptions} from 'ng2-datepicker';
import {MealService} from "../../models/meal/meal.service";
import {AuthenticationService} from "../../services/authentication.service";
import {MealImageService} from "../../services/meal-image.service";
import {NotificationsService} from "angular2-notifications";
import {MealFormDateValidation} from "../../validators/meal-form-date";
import {MealFormParticipantValidation} from "../../validators/meal-form-participants";

export interface SuggestionFormModel {
    meal: Meal;
    groups: Group[];
    user: User;
    date: Date;
}

@Component({
    selector: 'app-suggestion-form',
    templateUrl: './suggestion-form.component.html',
    styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent extends DialogComponent<SuggestionFormModel, Meal> implements OnInit {
    @ViewChild('cropper', undefined)
    groups: Group[];
    formGroups: Group[];
    meal: Meal;
    date: Date;
    user: User;
    cropper: ImageCropperComponent;
    form: FormGroup;
    data: any;
    cropperSettings: CropperSettings;
    useOwnPicture = false;
    mealType = MealType;
    editMode = false;

    deliveryDateOptions: DatepickerOptions = {
        minDate: moment().startOf('day').add(1, 'day').startOf('day').toDate()
    };

    limitDateOptions: DatepickerOptions = {
        minDate: moment().startOf('day').toDate()
    };

    constructor(dialogService: DialogService,
                private mealService: MealService,
                public authenticationService: AuthenticationService,
                public imageService: MealImageService,
                public mealImageService: MealImageService,
                private notificationService: NotificationsService) {
        super(dialogService);
    }

    ngOnInit() {
        document.getElementsByTagName('body')[0].classList.add('modal-open');
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 200;
        this.cropperSettings.height = 200;
        this.cropperSettings.croppedWidth = 300;
        this.cropperSettings.croppedHeight = 300;
        this.cropperSettings.noFileInput = true;
        this.data = {};
        this.initForm();
        this.formGroups = this.groups;
    }

    initForm() {
        this.form = new FormGroup({
            title: new FormControl(this.meal.title, [Validators.required, Validators.minLength(5)]),
            description: new FormControl(this.meal.description, [Validators.required, Validators.minLength(15)]),
            contribution: new FormControl(this.meal.contribution, [Validators.required, Validators.min(0)]),
            deliveryDate: new FormControl(this.meal.deliveryDate, Validators.required),
            deliveryHour: new FormControl(this.meal.deliveryHour, [Validators.required, Validators.min(0), Validators.max(24)]),
            limitDate: new FormControl(this.meal.limitDate, Validators.required),
            minParticipants: new FormControl(this.meal.minParticipants, [Validators.required, Validators.min(1)]),
            maxParticipants: new FormControl(this.meal.maxParticipants, [Validators.required, Validators.min(1)]),
            group: new FormControl(this.meal.group ? this.meal.group._id : null, Validators.required),
            type: new FormControl(this.meal.type)
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

    onSubmit() {
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
                    if (hasParticipants && updatedMeal.participants.length === 0) {
                        me.notificationService.warn('participants have been removed', 'we warned them!');
                    }
                    me.notificationService.success(`Lunch proposition saved!`);

                    document.getElementsByTagName('body')[0].classList.remove('modal-open');
                    me.result = updatedMeal;
                    me.close();
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

    toggleUseOwnPicture() {
        this.useOwnPicture = !this.useOwnPicture;
        this.data.image = null;
    }

    formControlIsInvalid(formControlName: string) {
        let formControl = this.form.get(formControlName);
        return !formControl.valid && !formControl.pristine;
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

}
