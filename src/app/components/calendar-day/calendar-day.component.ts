import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Meal} from '../../models/meal/meal';
import {Router} from '@angular/router';
import {MealFormComponent} from '../meal-form/meal-form.component';
import {User} from '../../models/user/user';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-calendar-day',
    templateUrl: './calendar-day.component.html',
    styleUrls: ['./calendar-day.component.scss']
})
export class CalendarDayComponent implements OnInit, OnDestroy {
    @Input() weekdayName: string;
    @Input() weekday;
    @Input() joinedLunchs: Meal[] = [];
    @Input() proposedLunchs: Meal[] = [];
    @Input() suggestedLunchs: Meal[] = [];
    @Input() mealForm: MealFormComponent;
    @Input() user: User;
    @Input() globalFilterSubject: BehaviorSubject<string>;
    globalFilterSubscription: Subscription;
    activeTab = 'joined';

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.globalFilterSubscription = this.globalFilterSubject.subscribe(filter => this.activeTab = filter);
    }

    ngOnDestroy() {
        this.globalFilterSubscription.unsubscribe();
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
