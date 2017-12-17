import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    constructor(private authenticationService: AuthenticationService,
                private router: Router) {
    }

    ngOnInit() {
        if (! this.authenticationService.isLoggedIn()) {
            this.router.navigate(['login']);
            return;
        }
    }

}
