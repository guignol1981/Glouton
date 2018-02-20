import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {GroupService} from "../../services/group.service";
import {DialogService} from "ng2-bootstrap-modal";
import {GroupFormComponent} from "../group-form/group-form.component";
import {Group} from "../../models/group/group";
import {AuthenticationService} from "../../services/authentication.service";
import {LoginComponent} from "../login/login.component";
import {NotificationsService} from "angular2-notifications";
import {JoinGroupAlertComponent} from "../join-group-alert/join-group-alert.component";
import {UserService} from "../../models/user/user.service";
import {User} from "../../models/user/user";

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
    form: FormGroup;
    foundGroups: Group[];
    activeTab = 'search';

    constructor(private dialogService: DialogService,
                private groupService: GroupService,
                private userService: UserService,
                public authenticationService: AuthenticationService,
                private notificationService: NotificationsService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(null)
        });
        this.form.valueChanges.subscribe(data => {
            this.groupService.getByName(data['name']).then(groups => {
                this.foundGroups = groups;
            });
        });
    }

    createGroup() {
        let me = this;
        let createGroup = function () {
            me.dialogService.addDialog(GroupFormComponent, null, {backdropColor: 'rgba(0, 0, 0, 0.5)'})
                .subscribe((isConfirmed) => {
                    if (isConfirmed) {
                        me.notificationService.success('Group created!');
                    }
                });
        };
        if (this.authenticationService.isLoggedIn()) {
            createGroup();
        } else {
            this.signIn(createGroup, null);
        }
    }

    signIn(callback, arg) {
        this.dialogService.addDialog(LoginComponent, {}, {backdropColor: 'rgba(0, 0, 0, 0.5)'})
            .subscribe((isConfirmed) => {
                if (isConfirmed) {
                    this.notificationService.success('Logged in!');
                    if (callback) {
                        callback(arg);
                    }
                }
            });
    }

    onGroupClicked(group: Group) {
        let me = this;
        let popJoinGroupAlert = function (group, user) {
            me.dialogService.addDialog(JoinGroupAlertComponent, {user: user, group: group}, {backdropColor: 'rgba(0, 0, 0, 0.5)'})
                .subscribe((isConfirmed) => {
                    if (isConfirmed) {
                    }
                });
        };
        if (this.authenticationService.isLoggedIn()) {
            this.userService.getConnectedUser().then((user: User) => {
                popJoinGroupAlert(group, user);
            })
        } else {
            this.signIn(popJoinGroupAlert, group);
        }
    }

    getTabClass(tabName) {
        return this.activeTab === tabName ? 'nav-link active' : 'nav-link';
    }

    setTab(tabName) {
        this.activeTab = tabName;
    }
}
