import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MealService} from '../../models/meal/meal.service';
import {Meal} from '../../models/meal/meal';
import * as moment from 'moment';
import {User} from '../../models/user/user';
import {UserService} from '../../models/user/user.service';
import {MealFormComponent} from '../meal-form/meal-form.component';
import {CalendarDayComponent} from '../calendar-day/calendar-day.component';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
    selector: 'app-lunch-box',
    templateUrl: './lunch-box.component.html',
    styleUrls: ['./lunch-box.component.scss']
})
export class LunchBoxComponent implements OnInit {
    @ViewChild(MealFormComponent) mealFormComponent: MealFormComponent;
    meals: Meal[] = [];
    weekFirstDay = moment().startOf('week');
    weekdays = [];
    weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    user: User;
    globalFilter = 'joined';
    globalFilterSubject = new BehaviorSubject<string>(this.globalFilter);

    constructor(private mealService: MealService, private userService: UserService) {
    }

    ngOnInit() {
        this.userService.getConnectedUser().then(user => {
            this.user = user;
            this.mealService.getLunchBox(this.weekFirstDay.toISOString()).then(data => {
                this.meals = data;
                this.updateWeekDays();
            });
        });
    }

    updateWeekDays() {
        this.weekdays = [
            this.weekFirstDay,
            moment(this.weekFirstDay).add(1, 'day'),
            moment(this.weekFirstDay).add(2, 'day'),
            moment(this.weekFirstDay).add(3, 'day'),
            moment(this.weekFirstDay).add(4, 'day'),
            moment(this.weekFirstDay).add(5, 'day'),
            moment(this.weekFirstDay).add(6, 'day')
        ];
    }

    getNextWeek() {
        this.weekFirstDay = this.weekFirstDay.add(1, 'week');
        this.mealService.getLunchBox(this.weekFirstDay.toISOString()).then(data => {
            this.updateWeekDays();
            this.meals = data;
        });
    }

    getPreviousWeek() {
        this.weekFirstDay = this.weekFirstDay.subtract(1, 'week');
        this.mealService.getLunchBox(this.weekFirstDay.toISOString()).then(data => {
            this.updateWeekDays();
            this.meals = data;
        });
    }

    getThisWeek() {
        this.weekFirstDay = moment().startOf('week');
        this.mealService.getLunchBox(this.weekFirstDay.toISOString()).then(data => {
            this.updateWeekDays();
            this.meals = data;
        });
    }

    getJoinedLunchForDay(weekDay) {
        let dayLunch = [];

        this.meals.forEach(lunch => {
            if (moment(lunch.deliveryDate).isSame(weekDay) && lunch.asJoined(this.user)) {
                dayLunch.push(lunch);
            }
        });

        return dayLunch;
    }

    getProposedLunchForDay(weekDay) {
        let dayLunch = [];

        this.meals.forEach(lunch => {
            if (moment(lunch.deliveryDate).isSame(weekDay) && lunch.isCook(this.user)) {
                dayLunch.push(lunch);
            }
        });

        return dayLunch;
    }

    getSuggestedLunchForDay(weekDay) {
        let dayLunch = [];

        this.meals.forEach(lunch => {
            if (moment(lunch.deliveryDate).isSame(weekDay) && !lunch.asJoined(this.user) && !lunch.isCook(this.user)) {
                dayLunch.push(lunch);
            }
        });

        return dayLunch;
    }

    setGlobalFilter(filterName) {
        this.globalFilter = filterName;
        this.globalFilterSubject.next(this.globalFilter);
    }


}
