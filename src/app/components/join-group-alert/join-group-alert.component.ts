import {Component, OnInit} from '@angular/core';
import {Group} from "../../models/group/group";
import {isBoolean} from "util";
import {DialogComponent, DialogService} from "ng2-bootstrap-modal";
import {GroupService} from "../../services/group.service";

export interface JoinGroupAlertFormModel {
    group: Group;
}

@Component({
    selector: 'app-join-group-alert',
    templateUrl: './join-group-alert.component.html',
    styleUrls: ['./join-group-alert.component.css']
})
export class JoinGroupAlertComponent extends DialogComponent<JoinGroupAlertFormModel, boolean> implements OnInit {
    group: Group;

    constructor(dialogService: DialogService,
                private groupService: GroupService) {
        super(dialogService);
    }

    ngOnInit() {
        document.getElementsByTagName('body')[0].classList.add('modal-open');
    }

    join() {
        // this.groupService.join(this.group).
    }

    leave() {

    }

    remove() {

    }

}
