import {Component, OnInit} from '@angular/core';
import {Group} from "../../models/group/group";
import {isBoolean} from "util";
import {DialogComponent, DialogService} from "ng2-bootstrap-modal";
import {GroupService} from "../../services/group.service";
import {User} from "../../models/user/user";
import {NotificationsService} from "angular2-notifications";

export interface JoinGroupAlertFormModel {
    user: User;
    group: Group;
}

@Component({
    selector: 'app-join-group-alert',
    templateUrl: './join-group-alert.component.html',
    styleUrls: ['./join-group-alert.component.scss']
})
export class JoinGroupAlertComponent extends DialogComponent<JoinGroupAlertFormModel, boolean> implements OnInit {
    user: User;
    group: Group;

    constructor(dialogService: DialogService,
                notificationService: NotificationsService,
                private groupService: GroupService) {
        super(dialogService);
    }

    ngOnInit() {
        document.getElementsByTagName('body')[0].classList.add('modal-open');
    }

    joinRequest() {
        this.groupService.joinRequest(this.group).then((group: Group) => {
            this.group = group;
        });
    }

    cancelJoinRequest() {
        this.groupService.cancelJoinRequest(this.group).then((group: Group) => {
            this.group = group;
        });
    }

    leave() {
        this.groupService.leave(this.group).then((group: Group) => {
            this.group = group;
        });
    }

    remove() {
        this.groupService.remove(this.group).then(() => {
            this.close();
        });
    }

}
