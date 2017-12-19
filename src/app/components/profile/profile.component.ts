import {Component, OnInit} from '@angular/core';
import {UserService} from "../../models/user/user.service";
import {User} from "../../models/user/user";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    user: User;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.userService.getProfile()
            .then(data => this.user = data);
    }

}
