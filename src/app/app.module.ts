import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {routing} from './routing';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {MealCardComponent} from './components/meal-card/meal-card.component';
import {MealListComponent} from './components/meal-list/meal-list.component';
import {MealFormComponent} from './components/meal-form/meal-form.component';
import {MealService} from './models/meal/meal.service';
import {MealDetailsComponent} from './components/meal-details/meal-details.component';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {AuthenticationService} from './services/authentication.service';
import {ProfileComponent} from './components/profile/profile.component';
import {UserService} from './models/user/user.service';
import {CanActivateViaAuthGuardService} from './services/can-activate-via-auth-guard.service';
import {LunchBoxComponent} from './components/lunch-box/lunch-box.component';
import {ImageUploadModule} from 'angular2-image-upload';
import {MealImageService} from './services/meal-image.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InboxComponent} from './components/inbox/inbox.component';
import {MessageService} from './services/message.service';
import {PrivateMessageComponent} from './components/private-message/private-message.component';
import {NgDatepickerModule} from 'ng2-datepicker';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {ImageCropperModule} from 'ng2-img-cropper';
import {HelpComponent} from './components/help/help.component';
import {AboutComponent} from './components/about/about.component';
import {VersionService} from './models/version/version.service';
import {CalendarDayComponent} from './components/calendar-day/calendar-day.component';
import {NgbModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {KeysPipe} from "./pipes/keys-pipe";
import { LandingComponent } from './components/landing/landing.component';
import {GroupService} from "./services/group.service";

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
        LunchBoxComponent,
        InboxComponent,
        PrivateMessageComponent,
        HelpComponent,
        AboutComponent,
        CalendarDayComponent,
        KeysPipe,
        LandingComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        ImageCropperModule,
        BrowserAnimationsModule,
        ImageUploadModule.forRoot(),
        NgDatepickerModule,
        NgbModule.forRoot(),
        NgbTooltipModule,
        SimpleNotificationsModule.forRoot()
    ],
    providers: [
        MealService,
        AuthenticationService,
        UserService,
        CanActivateViaAuthGuardService,
        MealImageService,
        MessageService,
        VersionService,
        GroupService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}