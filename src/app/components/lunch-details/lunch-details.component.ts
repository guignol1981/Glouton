import {Component, OnInit, ViewChild} from '@angular/core';
import {LunchService} from '../../models/lunch/lunch.service';
import {Lunch} from '../../models/lunch/lunch';
import {ActivatedRoute, Params} from '@angular/router';
import {LunchImageService} from '../../services/lunch-image.service';
import {UserService} from '../../models/user/user.service';
import {User} from '../../models/user/user';
import {LunchFormComponent} from '../lunch-form/lunch-form.component';
import {NotificationsService} from 'angular2-notifications';
import * as moment from 'moment';
import {LunchType} from "../../models/lunch/lunch-type.enum";
import {LunchFormComponent} from "../lunch-form/lunch-form.component";
import {DialogService} from "ng2-bootstrap-modal";

@Component({
    selector: 'app-lunch-details',
    templateUrl: './lunch-details.component.html',
    styleUrls: ['./lunch-details.component.scss', '../../app.component.scss']
})
export class LunchDetailsComponent implements OnInit {
    lunch: Lunch;
    user: User;
    @ViewChild(LunchFormComponent) lunchFormComponent: LunchFormComponent;
    weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    weekDayName = '';
    remaningTime;
    lunchType = LunchType;

    constructor(private lunchService: LunchService,
                private activatedRoute: ActivatedRoute,
                public imageService: LunchImageService,
                public userService: UserService,
                private notificationService: NotificationsService,
                private dialogService: DialogService) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let lunchId = params['id'];
            this.userService.getConnectedUser().then(user => {
                this.user = user;
                this.lunchService.get(lunchId)
                    .then(data => {
                        this.lunch = data;
                        this.remaningTime = moment(this.lunch.limitDate).fromNow().replace('in', '');
                        this.weekDayName = this.weekdayNames[moment(this.lunch.deliveryDate).weekday()];
                    });
            });
        });
    }

    joinLunch() {
        this.lunchService.join(this.lunch)
            .then(lunch => {
                this.lunch = lunch;
                this.notificationService.success('You joined the lunch propositon!');
            });
    }

    leaveLunch() {
        this.lunchService.leave(this.lunch)
            .then(data => {
                this.lunch = data;
                this.notificationService.success('You left the lunch proposition!');
            });
    }

    editLunch() {
        this.dialogService.addDialog(LunchFormComponent, {
            lunch: this.lunch, user: this.user, date: null
        }, {backdropColor: 'rgba(0, 0, 0, 0.5)'})
            .subscribe((lunch: Lunch) => {
                this.lunch = lunch;
            });
    }

    cancelLunch() {
        let hasParticipants = this.lunch.participants.length > 0;
        this.lunchService.cancel(this.lunch).then((lunch) => {
            this.lunch = lunch;
            if (hasParticipants) {
                this.notificationService.success(
                    'The lunch proposition have been canceled, we notified the participants!'
                );
            } else {
                this.notificationService.success('The lunch proposition have been canceled!');
            }
        });
    }

    onLunchUpdated(lunch: Lunch) {
        this.lunch = lunch;
    }

}
