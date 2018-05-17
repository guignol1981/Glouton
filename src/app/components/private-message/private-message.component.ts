import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {User} from "../../models/user/user";
import {Message} from "../../models/message/message";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "../../services/message.service";
import {ToastsManager} from "ng2-toastr";
import {NotificationsService} from "angular2-notifications";

@Component({
    selector: 'app-private-message',
    templateUrl: './private-message.component.html',
    styleUrls: ['./private-message.component.scss']
})
export class PrivateMessageComponent implements OnInit {
    @Input() recipient: User;
    @Input() author: User;
    @Input() thread = [];
    public notificationOptions = {
        position: ["bottom", "left"],
        timeOut: 5000,
        lastOnBottom: true
    };

    form: FormGroup;

    constructor(private messageService: MessageService,
                private notificationService: NotificationsService) {
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.form = new FormGroup({
            title: new FormControl('', Validators.minLength(5)),
            body: new FormControl('', Validators.minLength(5))
        });
    }

    @Input()
    initMessage(author: User, recipient: User, thread) {
        this.author = author;
        this.recipient = recipient;
        this.thread = thread;
        this.initForm();
    }

    onMessageFormSubmit(messageCloseButton) {
        let message = new Message();
        this.thread.push(this.form.get('body').value);

        message.recipient = this.recipient;
        message.title = this.form.get('title').value;
        message.thread = this.thread;
        message.author = this.author;
        message.category = 'secondary';
        message.type = 'message-private';

        this.messageService.send(message).then(() => {
            this.notificationService.success('Message sent!');
            messageCloseButton.click();
        });
    }

    onMessageFormClose() {
        this.form.reset();
    }

}

