import {Component, OnInit, ViewChild} from '@angular/core';
import {MessageService} from "../../services/message.service";
import {Message} from "../../models/message/message";
import {UserService} from "../../models/user/user.service";
import {User} from "../../models/user/user";
import {PrivateMessageComponent} from "../private-message/private-message.component";

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
    messages: Message[];
    user: User;
    @ViewChild(PrivateMessageComponent) privateMessage: PrivateMessageComponent;

    constructor(private userService: UserService,
                private messageService: MessageService) {
    }

    ngOnInit() {
        this.userService.getConnectedUser().then(user => {
            this.user = user;
            this.messageService.getAll().then(messages => {
                    this.messages = messages;
                }
            );
        });
    }

    getMessageClass(message: Message) {
        if (message.seen) {
            return 'list-group-item mt-1 list-group-item-secondary global-shadow';
        }
        return 'global-shadow list-group-item mt-1 list-group-item-' + message.category;
    }

    reply(message: Message, initModalButton) {
        this.privateMessage.initMessage(this.user, message.author, message.thread);
        initModalButton.click();
    }

    markAsSeen(message: Message) {
        if (! message.seen) {
            message.seen = true;
            this.messageService.update(message).then();
        }
    }

    remove(message: Message) {
        this.messageService.remove(message).then(() => {
            for (let i = this.messages.length - 1; i >= 0; i--) {
                if (this.messages[i]._id === message._id) {
                    this.messages.splice(i, 1);
                    break;
                }
            }
        });
    }

}
