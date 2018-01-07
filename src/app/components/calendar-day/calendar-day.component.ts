import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {MealService} from '../../models/meal/meal.service';
import {Meal} from '../../models/meal/meal';
import {Router} from '@angular/router';

@Component({
    selector: 'app-calendar-day',
    templateUrl: './calendar-day.component.html',
    styleUrls: ['./calendar-day.component.css']
})
export class CalendarDayComponent implements OnInit {
    @Input() weekdayName: string;
    @Input() weekday: moment;
    joinedMeals: Meal[] = [];
    proposedMeals: Meal[] = [];
    suggestedMeals: Meal[] = [];


    constructor(private mealService: MealService,
                private router: Router) {
    }

    ngOnInit() {
        this.mealService.getJoinedMealsForDate(this.weekday).then(meals => this.joinedMeals = meals);
        this.mealService.getProposedMealsForDate(this.weekday).then(meals => this.proposedMeals = meals);
        this.mealService.getSuggestedMealsForDate(this.weekday).then(meals => this.suggestedMeals = meals);
    }

    goToLunchDetails(id) {
        this.router.navigate(['lunch-details/' + id]);
    }

}
