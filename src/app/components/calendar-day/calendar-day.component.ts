import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {Meal} from '../../models/meal/meal';
import {Router} from '@angular/router';

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

}
