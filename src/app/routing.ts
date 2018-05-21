import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {LunchFormComponent} from './components/lunch-form/lunch-form.component';
import {LunchListComponent} from './components/lunch-list/lunch-list.component';
import {LunchDetailsComponent} from './components/lunch-details/lunch-details.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ProfileComponent} from './components/profile/profile.component';
import {LunchBoxComponent} from './components/lunch-box/lunch-box.component';
import {InboxComponent} from './components/inbox/inbox.component';
import {HelpComponent} from './components/help/help.component';
import {CanActivateViaAuthGuardService} from "./services/can-activate-via-auth-guard.service";
import {AboutComponent} from './components/about/about.component';
import {LandingComponent} from './components/landing/landing.component';
import {ConfirmJoinRequestComponent} from "./components/confirm-join-request/confirm-join-request.component";

const appRoutes: Routes = [
    {path: 'lunch-details/:id', component: LunchDetailsComponent, canActivate: [CanActivateViaAuthGuardService]},
    {
        path: 'confirm-join-request/:id/:user-id/:accept',
        component: ConfirmJoinRequestComponent,
        canActivate: [CanActivateViaAuthGuardService]
    },
    {path: 'lunch-form/:id', component: LunchFormComponent, canActivate: [CanActivateViaAuthGuardService]},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'explore', component: LunchListComponent, canActivate: [CanActivateViaAuthGuardService]},
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
