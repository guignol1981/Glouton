import {Component, OnInit} from '@angular/core';
import {MessageService} from "../../services/message.service";
import {Message} from "../../models/message/message";

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
    messages: Message[];

    constructor(private messageService: MessageService) {
    }

    ngOnInit() {
        this.messageService.getAll().then(messages => this.messages = messages);
    }

    getMessageClass(message: Message) {
        if (message.seen) {
            return 'list-group-item mt-1 list-group-item-secondary';
        }
        return 'list-group-item mt-1 list-group-item-' + message.type;
    }

    markAsSeen(message: Message) {
        message.seen = true;
        this.messageService.save(message).then();
    }

}
