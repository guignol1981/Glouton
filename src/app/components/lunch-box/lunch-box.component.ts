import {Component, OnInit} from '@angular/core';
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";
import {Router} from "@angular/router";
import * as moment from "moment";

@Component({
    selector: 'app-lunch-box',
    templateUrl: './lunch-box.component.html',
    styleUrls: ['./lunch-box.component.css']
})
export class LunchBoxComponent implements OnInit {
    meals: Meal[] = [];
    weekFirstDay = moment().startOf('week');
    weekdays = [];
    weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    constructor(private mealService: MealService,
                private router: Router) {
    }

    ngOnInit() {
        this.updateWeekDays();
        this.mealService.getLunchBox(this.weekFirstDay.toISOString()).then(data => {
            this.meals = data;
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

    isThisDay(meal: Meal, weekday): boolean {
        return moment(meal.deliveryDate).day() === weekday.day();
    }

    asLunchForThisDay(weekday): boolean {
        let asLunch = false;
        this.meals.forEach(meal => {
            if (this.isThisDay(meal, weekday)) {
                asLunch = true;
                return false;
            }
        });

        return asLunch;
    }

    getPlannedMealClass(meal: Meal): string {
        if (meal.isPending()) {
            return "list-group-item list-group-item-secondary";
        } else if (meal.isConfirmed()) {
            return "list-group-item list-group-item-success";
        } else if (meal.isCanceled()) {
            return 'list-group-item list-group-item-danger';
        } else  {
            return "list-group-item list-group-item-secondary";
        }
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

    goToMealDetails(meal: Meal) {
        this.router.navigate(['meal-details/' + meal._id]);
    }

}
