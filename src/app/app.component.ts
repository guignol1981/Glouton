import {Component} from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'app';
    public notificationOptions = {
        position: ['bottom', 'left'],
        timeOut: 5000,
        lastOnBottom: true
    };

    constructor(public authenticationService: AuthenticationService) {
    }
}
