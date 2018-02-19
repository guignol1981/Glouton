import {Component, OnInit, ViewChild} from '@angular/core';
import {MealService} from '../../models/meal/meal.service';
import {Meal} from '../../models/meal/meal';
import {ActivatedRoute, Params} from '@angular/router';
import {MealImageService} from '../../services/meal-image.service';
import {UserService} from '../../models/user/user.service';
import {User} from '../../models/user/user';
import {MealFormComponent} from '../meal-form/meal-form.component';
import {NotificationsService} from 'angular2-notifications';
import * as moment from 'moment';
import {MealType} from "../../models/meal/meal-type.enum";
import {SuggestionFormComponent} from "../suggestion-form/suggestion-form.component";
import {DialogService} from "ng2-bootstrap-modal";

@Component({
    selector: 'app-meal-details',
    templateUrl: './meal-details.component.html',
    styleUrls: ['./meal-details.component.css', '../../app.component.css']
})
export class MealDetailsComponent implements OnInit {
    meal: Meal;
    user: User;
    @ViewChild(MealFormComponent) mealFormComponent: MealFormComponent;
    weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    weekDayName = '';
    remaningTime;
    mealType = MealType;

    constructor(private mealService: MealService,
                private activatedRoute: ActivatedRoute,
                public imageService: MealImageService,
                public userService: UserService,
                private notificationService: NotificationsService,
                private dialogService: DialogService) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let mealId = params['id'];
            this.userService.getConnectedUser().then(user => {
                this.user = user;
                this.mealService.get(mealId)
                    .then(data => {
                        this.meal = data;
                        this.remaningTime = moment(this.meal.limitDate).fromNow().replace('in', '');
                        this.weekDayName = this.weekdayNames[moment(this.meal.deliveryDate).weekday()];
                    });
            });
        });
    }

    joinMeal() {
        this.mealService.join(this.meal)
            .then(meal => {
                this.meal = meal;
                this.notificationService.success('You joined the lunch propositon!');
            });
    }

    leaveMeal() {
        this.mealService.leave(this.meal)
            .then(data => {
                this.meal = data;
                this.notificationService.success('You left the lunch proposition!');
            });
    }

    editMeal() {
        this.dialogService.addDialog(SuggestionFormComponent, {
            meal: this.meal, user: this.user, date: null
        }, {backdropColor: 'rgba(0, 0, 0, 0.5)'})
            .subscribe((meal: Meal) => {
                this.meal = meal;
            });
    }

    cancelMeal() {
        let hasParticipants = this.meal.participants.length > 0;
        this.mealService.cancel(this.meal).then((meal) => {
            this.meal = meal;
            if (hasParticipants) {
                this.notificationService.success(
                    'The lunch proposition have been canceled, we notified the participants!'
                );
            } else {
                this.notificationService.success('The lunch proposition have been canceled!');
            }
        });
    }

    onMealUpdated(meal: Meal) {
        this.meal = meal;
    }

}
