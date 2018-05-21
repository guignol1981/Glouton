import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Lunch} from '../../models/lunch/lunch';
import {Router} from '@angular/router';
import {LunchFormComponent} from '../lunch-form/lunch-form.component';
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
    @Input() joinedLunchs: Lunch[] = [];
    @Input() proposedLunchs: Lunch[] = [];
    @Input() suggestedLunchs: Lunch[] = [];
    @Input() lunchForm: LunchFormComponent;
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
        this.lunchForm.initFromDate(this.weekday, this.user);
        button.click();
    }

}
