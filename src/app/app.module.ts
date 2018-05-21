import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {routing} from './routing';
import {AgmCoreModule} from "@agm/core";
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {LunchCardComponent} from './components/lunch-card/lunch-card.component';
import {LunchListComponent} from './components/lunch-list/lunch-list.component';
import {LunchFormComponent} from './components/lunch-form/lunch-form.component';
import {LunchService} from './models/lunch/lunch.service';
import {LunchDetailsComponent} from './components/lunch-details/lunch-details.component';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {AuthenticationService} from './services/authentication.service';
import {ProfileComponent} from './components/profile/profile.component';
import {UserService} from './models/user/user.service';
import {CanActivateViaAuthGuardService} from './services/can-activate-via-auth-guard.service';
import {LunchBoxComponent} from './components/lunch-box/lunch-box.component';
import {ImageUploadModule} from 'angular2-image-upload';
import {LunchImageService} from './services/lunch-image.service';
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
import {LandingComponent} from './components/landing/landing.component';
import {GroupService} from "./services/group.service";
import {BootstrapModalModule} from "ng2-bootstrap-modal";
import {GroupFormComponent} from './components/group-form/group-form.component';
import {MapComponent} from './components/map/map.component';
import {GoogleMapService} from "./services/google-map.service";
import {
    JoinGroupAlertComponent,
} from './components/join-group-alert/join-group-alert.component';
import { LunchFormComponent } from './components/lunch-form/lunch-form.component';
import { ConfirmJoinRequestComponent } from './components/confirm-join-request/confirm-join-request.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        NavbarComponent,
        LunchCardComponent,
        LunchListComponent,
        LunchFormComponent,
        LunchDetailsComponent,
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
        LandingComponent,
        GroupFormComponent,
        MapComponent,
        JoinGroupAlertComponent,
        LunchFormComponent,
        ConfirmJoinRequestComponent,
        LoaderComponent
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
        SimpleNotificationsModule.forRoot(),
        BootstrapModalModule.forRoot({container: document.body}),
        AgmCoreModule.forRoot({apiKey: 'AIzaSyDgQC2X_l3E6ol88MSuBGaAuZm-FjXRNXs'}),
    ],
    entryComponents: [
        GroupFormComponent,
        LoginComponent,
        JoinGroupAlertComponent,
        LunchFormComponent
    ],
    providers: [
        LunchService,
        AuthenticationService,
        UserService,
        CanActivateViaAuthGuardService,
        LunchImageService,
        MessageService,
        VersionService,
        GroupService,
        GoogleMapService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}