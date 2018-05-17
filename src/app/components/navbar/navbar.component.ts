import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {MessageService} from "../../services/message.service";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
    activeTab = 0;
    unseenMessageCount = 0;
    loggedInSubscription: Subscription;
    isLoggedIn: Boolean = false;

    constructor(public authenticationService: AuthenticationService,
                private messageService: MessageService,
                private router: Router) {
    }

    ngOnInit() {
        this.loggedInSubscription = this.authenticationService.isLoggedInSubject.subscribe(loggedIn => {
            this.isLoggedIn = loggedIn;
            if (loggedIn) {
                this.messageService.getUnseen().then(messages => this.unseenMessageCount = messages.length);
                this.checkForNotifications();
            }
        });
    }

    checkForNotifications() {
        this.messageService.getUnseen().then(messages => this.unseenMessageCount = messages.length);
    }

    ngOnDestroy() {
        this.loggedInSubscription.unsubscribe();
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['groups']);
    }

    setTab(tabIndex) {
        this.activeTab = tabIndex;
    }

    getNavItemClass(tabIndex) {
        return this.activeTab === tabIndex ? 'nav-item active' : 'nav-item';
    }

}
