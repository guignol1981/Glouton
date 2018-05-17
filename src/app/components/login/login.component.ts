import {Component, OnDestroy, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from "ng2-bootstrap-modal";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {User} from "../../models/user/user";
import {PasswordValidation} from "../../validators/password-validation";
import {NotificationsService} from "angular2-notifications";

export interface ConfirmModel {
    title: string;
    message: string;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends DialogComponent<ConfirmModel, boolean> implements OnInit {
    form: FormGroup;
    view = 'sign-in';

    constructor(dialogService: DialogService,
                private authenticationService: AuthenticationService,
                private notificationService: NotificationsService) {
        super(dialogService);
    }

    ngOnInit(): void {
        document.getElementsByTagName('body')[0].classList.add('modal-open');
        this.form = new FormGroup({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

    signIn() {
        let user = <User>this.form.value;
        this.authenticationService.login(user)
            .then(() => {
                this.result = true;
                this.close();
            })
            .catch(error => {
                this.notificationService.error(error);
            });
    }

    register() {
        let user = <User>this.form.value;
        this.authenticationService.register(user)
            .then(() => {
                document.getElementsByTagName('body')[0].classList.remove('modal-open');
                this.result = true;
                this.close();
            });
    }

    toggleRegister() {
        this.view = 'register';
        this.form = new FormGroup({
            name: new FormControl(null, Validators.minLength(5)),
            email: new FormControl(null, Validators.email),
            password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            agree: new FormControl(false, Validators.requiredTrue)
        }, {validators: PasswordValidation.MatchPassword});
    }

    toggleSignIn() {
        this.view = 'sign-in';
        this.form = new FormGroup({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

}
