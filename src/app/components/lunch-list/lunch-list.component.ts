import {Component, OnDestroy, OnInit} from '@angular/core';
import {LunchService} from "../../models/lunch/lunch.service";
import {Lunch} from "../../models/lunch/lunch";
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../../models/user/user.service";
import {User} from "../../models/user/user";
import {DialogService} from "ng2-bootstrap-modal";
import {LunchFormComponent} from "../lunch-form/lunch-form.component";
import {NotificationsService} from "angular2-notifications";
import {GroupService} from "../../services/group.service";
import {Group} from "../../models/group/group";

@Component({
    selector: 'app-lunch-list',
    templateUrl: './lunch-list.component.html',
    styleUrls: ['./lunch-list.component.scss']
})
export class LunchListComponent implements OnInit, OnDestroy {
    lunchs: Lunch[] = [];
    filteredLunchs: Lunch[] = [];
    filters = ['all'];
    user: User;
    lunchsSubscription: Subscription;
    groups: Group[] = [];

    constructor(private userService: UserService,
                private lunchService: LunchService,
                private dialogService: DialogService,
                private groupService: GroupService) {
    }

    ngOnInit() {
        this.groupService.getUserGroup().then(groups => this.groups = groups);
        this.userService.getConnectedUser().then(user => {
            this.user = user;
            this.lunchsSubscription = this.lunchService.lunchsSubject.subscribe(data => {
                this.lunchs = data;
                this.filterList();
            });
            this.lunchService.getList().then(data => {
                this.lunchs = data;
                this.filterList();
            });
        });
    }

    ngOnDestroy() {
        this.lunchsSubscription.unsubscribe();
    }

    toggleFilter(filter) {
        if (filter === 'all') {
            this.filters = [filter];
        } else {
            this.filters = this.filters.filter(item => item !== 'all');
            let index = this.filters.indexOf(filter);
            if (index > -1) {
                this.filters.splice(index, 1);
            } else {
                this.filters.push(filter);
            }
        }
        if (this.filters.length === 0) {
            this.filters = ['all'];
        }
        this.filterList();
    }

    getFilterClass(filter) {
        let index = this.filters.indexOf(filter);

        if (index > -1) {
            return this.filterIsAGroup(filter) ? 'badge badge-info' : 'badge badge-primary';
        }

        return 'badge badge-secondary';
    }

    updateLunch(lunch: Lunch) {
        this.lunchs.forEach((item, index, array) => {
            if (item._id === lunch._id) {
                array[index] = lunch;
            }
        });
        this.filterList();
    }

    filterList() {
        this.filteredLunchs = [];
        let addLunchToFilter = function (lunch, filteredLunchs) {
            let index = filteredLunchs.indexOf(lunch);
            if (index === -1) {
                filteredLunchs.push(lunch);
            }
            return filteredLunchs;
        };

        this.lunchs.forEach(lunch => {
            this.filters.forEach(filter => {
                if (filter === 'all') {
                    this.filteredLunchs = addLunchToFilter(lunch, this.filteredLunchs);
                    return;
                } else if (filter === 'joined' && lunch.asJoined(this.user)) {
                    this.filteredLunchs = addLunchToFilter(lunch, this.filteredLunchs);
                    return;
                } else if (filter === 'confirmed' && lunch.isConfirmed()) {
                    this.filteredLunchs = addLunchToFilter(lunch, this.filteredLunchs);
                    return;
                } else if (filter === 'pending' && lunch.isPending()) {
                    this.filteredLunchs = addLunchToFilter(lunch, this.filteredLunchs);
                    return;
                } else if (filter === 'by me' && lunch.isCook(this.user)) {
                    this.filteredLunchs = addLunchToFilter(lunch, this.filteredLunchs);
                    return;
                } else if (this.filterIsAGroup(filter) && lunch.group.name === filter) {
                    this.filteredLunchs = addLunchToFilter(lunch, this.filteredLunchs);
                }
            });
        });
    }

    filterIsAGroup(filter): boolean {
        let isAGroup = false;

        this.groups.forEach(group => {
            if (group.name === filter) {
                isAGroup = true;
                return false;
            }
        });

        return isAGroup;
    }

    suggest() {
        this.dialogService.addDialog(LunchFormComponent, {
            lunch: new Lunch(), user: this.user, date: null
        }, {backdropColor: 'rgba(0, 0, 0, 0.5)'})
            .subscribe((lunch: Lunch) => {
            });
    }
}
