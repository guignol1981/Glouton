import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Lunch} from "../../models/lunch/lunch";
import {Router} from "@angular/router";
import {User} from "../../models/user/user";
import {LunchService} from "../../models/lunch/lunch.service";
import {LunchImageService} from "../../services/lunch-image.service";
import {NotificationsService} from "angular2-notifications";


@Component({
    selector: 'app-lunch-card',
    templateUrl: './lunch-card.component.html',
    styleUrls: ['./lunch-card.component.scss', '../../app.component.scss']
})
export class LunchCardComponent implements OnInit {
    @Input() lunch: Lunch;
    @Input() user: User;
    @Output() updated: EventEmitter<Lunch> = new EventEmitter<Lunch>();

    public notificationOptions = {
        position: ["bottom", "left"],
        timeOut: 5000,
        lastOnBottom: true
    };

    constructor(private router: Router,
                private lunchService: LunchService,
                public imageService: LunchImageService,
                private notificationService: NotificationsService) {
    }

    ngOnInit() {
    }

    joinLunch() {
        this.lunchService.join(this.lunch)
            .then(data => {
                this.lunch = data;
                this.notificationService.success('You joined the lunch proposition!');
                this.updated.emit(this.lunch);
            });
    }

    leaveLunch() {
        this.lunchService.leave(this.lunch)
            .then(data => {
                this.lunch = data;
                this.notificationService.success('You left the lunch proposition!');
                this.updated.emit(this.lunch);
            });
    }

    goToLunchDetails() {
        this.router.navigate(['/lunch-details/' + this.lunch._id]);
    }

}
