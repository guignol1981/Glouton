import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {UserService} from "../../models/user/user.service";
import {Router} from "@angular/router";
import {User} from "../../models/user/user";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    user: User;

    constructor(private authenticationService: AuthenticationService,
                private userService: UserService,
                private router: Router) {
    }

    ngOnInit() {
        if (!this.authenticationService.isLoggedIn()) {
            this.router.navigate(['login']);
        }

        this.userService.getProfile()
            .then(data => this.user = data);
    }

}
