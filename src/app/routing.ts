import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {MealFormComponent} from './components/meal-form/meal-form.component';
import {MealDetailsComponent} from './components/meal-details/meal-details.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ProfileComponent} from './components/profile/profile.component';

const appRoutes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'suggest', component: MealFormComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'meal-details/:id', component: MealDetailsComponent},
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {path: '**', component: DashboardComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: false});
