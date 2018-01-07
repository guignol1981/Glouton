import {Component, Input, OnInit} from '@angular/core';
import {Meal} from '../../models/meal/meal';
import {Router} from '@angular/router';
import {MealFormComponent} from "../meal-form/meal-form.component";
import {User} from "../../models/user/user";

@Component({
    selector: 'app-calendar-day',
    templateUrl: './calendar-day.component.html',
    styleUrls: ['./calendar-day.component.css']
})
export class CalendarDayComponent implements OnInit {
    @Input() weekdayName: string;
    @Input() weekday;
    @Input() joinedLunchs: Meal[] = [];
    @Input() proposedLunchs: Meal[] = [];
    @Input() suggestedLunchs: Meal[] = [];
    @Input() mealForm: MealFormComponent;
    @Input() user: User;
    activeTab =  'joined';

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    goToLunchDetails(id) {
        this.router.navigate(['lunch-details/' + id]);
    }

    setTab(tabName) {
        this.activeTab = tabName;
    }

    proposeLunch(button) {
        this.mealForm.initFromDate(this.weekday, this.user);
        button.click();
    }

}
