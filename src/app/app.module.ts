import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {routing} from "./routing";
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {MealCardComponent} from './components/meal-card/meal-card.component';
import {MealListComponent} from './components/meal-list/meal-list.component';
import {MealFormComponent} from './components/meal-form/meal-form.component';
import {MealService} from "./models/meal/meal.service";
import {MealDetailsComponent} from './components/meal-details/meal-details.component';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {AuthenticationService} from "./services/authentication.service";
import {ProfileComponent} from './components/profile/profile.component';
import {UserService} from "./models/user/user.service";
import {CanActivateViaAuthGuardService} from "./services/can-activate-via-auth-guard.service";
import { LunchBoxComponent } from './components/lunch-box/lunch-box.component';


@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        NavbarComponent,
        MealCardComponent,
        MealListComponent,
        MealFormComponent,
        MealDetailsComponent,
        RegisterComponent,
        LoginComponent,
        ProfileComponent,
        LunchBoxComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpModule,
        routing
    ],
    providers: [
        MealService,
        AuthenticationService,
        UserService,
        CanActivateViaAuthGuardService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
