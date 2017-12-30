import {Component, OnDestroy, OnInit} from '@angular/core';
import {MealService} from "../../models/meal/meal.service";
import {Meal} from "../../models/meal/meal";
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../../models/user/user.service";
import {User} from "../../models/user/user";

@Component({
    selector: 'app-meal-list',
    templateUrl: './meal-list.component.html',
    styleUrls: ['./meal-list.component.css']
})
export class MealListComponent implements OnInit, OnDestroy {
    meals: Meal[] = [];
    filteredMeals: Meal[] = [];
    user: User;
    mealsSubscription: Subscription;
    filters = ['all'];

    constructor(private userService: UserService,
                private mealService: MealService) {
    }

    ngOnInit() {
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
            this.filters = ['all'];
        } else {
            let index = this.filters.indexOf('all');
            if (index > -1) {
                this.filters.splice(index, 1);
            }
            index = this.filters.indexOf(filter);
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

    filterList() {
        this.filteredMeals = [];
        let addMealToFilter = function(meal, filteredMeals) {
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
                }
            });
        });
    }
}
