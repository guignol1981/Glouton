import {Component, OnDestroy, OnInit} from '@angular/core';
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../../models/user/user.service";
import {User} from "../../models/user/user";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";

@Component({
    selector: 'app-meal-list',
    templateUrl: './meal-list.component.html',
    styleUrls: ['./meal-list.component.css']
})
export class MealListComponent implements OnInit, OnDestroy {
    meals: Meal[] = [];
    filteredMeals: Meal[] = [];
    filters = ['all'];
    user: User;
    mealsSubscription: Subscription;
    dayFilter = moment();

    constructor(private userService: UserService,
                private mealService: MealService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        let dateParamFilter = this.activatedRoute.snapshot.params['date'];
        if (dateParamFilter) {
            this.toggleFilter(moment(dateParamFilter));
        }
        this.userService.getConnectedUser().then(user => {
            this.user = user;
            this.mealsSubscription = this.mealService.mealsSubject.subscribe(data => {
                this.meals = data;
                this.filterList();
            });
            this.mealService.getList().then(data => {
                this.meals = data;
                this.filterList();
            });
        });
    }

    ngOnDestroy() {
        this.mealsSubscription.unsubscribe();
    }

    toggleFilter(filter) {
        if (filter === 'all') {
            this.filters = [filter];
        } else if (filter === 'next-day' || filter === 'previous-day') {
            if (filter === 'next-day') {
                this.dayFilter = this.dayFilter.add(1, 'day').startOf('day');
                this.filters = [this.dayFilter];
            } else {
                this.dayFilter = this.dayFilter.subtract(1, 'day').startOf('day');
                this.filters = [this.dayFilter];
            }
        } else {
            this.filters = this.filters.filter(item => item !== 'all');
            this.filters = this.filters.filter(item => !moment.isMoment(item));

            let index = this.filters.indexOf(filter);
            if (index > -1) {
                this.filters.splice(index, 1);
            } else {
                this.filters.push(filter);
            }
        }
        this.filterList();
    }

    getFilterClass(filter) {
        let index = this.filters.indexOf(filter);
        if (index > -1) {
            return 'badge badge-primary';
        }
        return 'badge badge-secondary';
    }

    updateMeal(meal: Meal) {
        this.meals.forEach((item, index, array) => {
            if (item._id === meal._id) {
                array[index] = meal;
            }
        });
        this.filterList();
    }

    filterList() {
        this.filteredMeals = [];
        let addMealToFilter = function (meal, filteredMeals) {
            let index = filteredMeals.indexOf(meal);
            if (index === -1) {
                filteredMeals.push(meal);
            }
            return filteredMeals;
        };
        this.meals.forEach(meal => {
            this.filters.forEach(filter => {
                if (filter === 'all') {
                    this.filteredMeals = addMealToFilter(meal, this.filteredMeals);
                    return;
                } else if (filter === 'joined' && meal.asJoined(this.user)) {
                    this.filteredMeals = addMealToFilter(meal, this.filteredMeals);
                    return;
                } else if (filter === 'confirmed' && meal.isConfirmed()) {
                    this.filteredMeals = addMealToFilter(meal, this.filteredMeals);
                    return;
                } else if (filter === 'pending' && meal.isPending()) {
                    this.filteredMeals = addMealToFilter(meal, this.filteredMeals);
                    return;
                } else if (filter === 'by me' && meal.isCook(this.user)) {
                    this.filteredMeals = addMealToFilter(meal, this.filteredMeals);
                    return;
                } else if (moment.isMoment(filter)) {
                    if (moment(meal.deliveryDate).isSame(filter)) {
                        this.filteredMeals = addMealToFilter(meal, this.filteredMeals);
                    }
                }
            });
        });
    }
}
