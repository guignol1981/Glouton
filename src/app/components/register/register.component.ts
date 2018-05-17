import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {User} from "../../models/user/user";
import {PasswordValidation} from "../../validators/password-validation";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    form: FormGroup;

    constructor(private authenticationService: AuthenticationService,
                private router: Router) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(null, Validators.minLength(5)),
            email: new FormControl(null, Validators.email),
            password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            agree: new FormControl(false, Validators.requiredTrue)
        }, {validators: PasswordValidation.MatchPassword});
    }

    onSubmit() {
        let user = <User>this.form.value;
        this.authenticationService.register(user)
            .then(
                () => this.router.navigate(['list']),
                error => {
                    alert(error);
                }
            );
    }

    goToLogin() {
        this.router.navigate(['login']);
    }

}
