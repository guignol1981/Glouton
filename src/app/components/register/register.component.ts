import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {User} from "../../models/user/user";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    form: FormGroup;

    constructor(private authenticationService: AuthenticationService,
                private router: Router) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(),
            email: new FormControl(),
            password: new FormControl()
        });
    }

    onSubmit() {
        let user = <User>this.form.value;
        this.authenticationService.register(user)
            .then(() => this.router.navigate(['dashboard']));
    }

    goToLogin() {
        this.router.navigate(['login']);
    }

}
