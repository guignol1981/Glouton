import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {User} from "../../models/user/user";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form: FormGroup;

    constructor(private authenticationService: AuthenticationService,
                private router: Router) {
    }

    ngOnInit() {
        if (this.authenticationService.isLoggedIn()) {
            this.router.navigate(['dashboard']);
            return;
        }

        this.form = new FormGroup({
            email: new FormControl(),
            password: new FormControl()
        });
    }

    onSubmit() {
        let user = <User>this.form.value;
        this.authenticationService.login(user)
            .then(() => this.router.navigate(['dashboard']));
    }

    goToRegister() {
        this.router.navigate(['register']);
    }

}
