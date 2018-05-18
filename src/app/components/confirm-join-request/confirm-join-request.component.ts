import {Component, OnInit} from '@angular/core';
import {GroupService} from "../../services/group.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Group} from "../../models/group/group";

@Component({
    selector: 'app-confirm-join-request',
    templateUrl: './confirm-join-request.component.html',
    styleUrls: ['./confirm-join-request.component.scss']
})
export class ConfirmJoinRequestComponent implements OnInit {
    httpStatus: number;

    constructor(private groupService: GroupService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let groupId = params['id'];
            let userId = params['user-id'];
            let accept = params['accept'];
            this.groupService.confirmJoinRequest(groupId, userId, accept).then((status: number) => {
                this.httpStatus = status;
            });
        });
    }

}
