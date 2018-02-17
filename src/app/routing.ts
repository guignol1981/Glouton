import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {MealFormComponent} from './components/meal-form/meal-form.component';
import {MealDetailsComponent} from './components/meal-details/meal-details.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ProfileComponent} from './components/profile/profile.component';
import {LunchBoxComponent} from './components/lunch-box/lunch-box.component';
import {InboxComponent} from './components/inbox/inbox.component';
import {HelpComponent} from './components/help/help.component';
import {CanActivateViaAuthGuardService} from "./services/can-activate-via-auth-guard.service";
import {AboutComponent} from './components/about/about.component';
import {LandingComponent} from './components/landing/landing.component';

const appRoutes: Routes = [
    {path: 'lunch-details/:id', component: MealDetailsComponent, canActivate: [CanActivateViaAuthGuardService]},
    {path: 'meal-form/:id', component: MealFormComponent, canActivate: [CanActivateViaAuthGuardService]},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [CanActivateViaAuthGuardService]},
    {path: 'profile', component: ProfileComponent, canActivate: [CanActivateViaAuthGuardService]},
    {path: 'lunch-box', component: LunchBoxComponent, canActivate: [CanActivateViaAuthGuardService]},
    {path: 'inbox', component: InboxComponent, canActivate: [CanActivateViaAuthGuardService]},
    {path: 'help', component: HelpComponent, canActivate: [CanActivateViaAuthGuardService]},
    {path: 'about', component: AboutComponent, canActivate: [CanActivateViaAuthGuardService]},
    {path: 'groups', component: LandingComponent},
    {
        path: '',
        redirectTo: '/groups',
        pathMatch: 'full'
    },
    {path: '**', component: LandingComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: false});
