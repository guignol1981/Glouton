import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {User} from "../../models/user/user";
import {Message} from "../../models/message/message";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "../../services/message.service";
import {ToastsManager} from "ng2-toastr";

@Component({
    selector: 'app-private-message',
    templateUrl: './private-message.component.html',
    styleUrls: ['./private-message.component.css']
})
export class PrivateMessageComponent implements OnInit {
    @Input() recipient: User;
    @Input() author: User;
    form: FormGroup;

    constructor(private messageService: MessageService,
                public toastr: ToastsManager,
                vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl('', Validators.minLength(5)),
            body: new FormControl('', Validators.minLength(5))
        });
    }

    onMessageFormSubmit(messageCloseButton) {
        let message = new Message();
        message.recipient = this.recipient;
        message.title = this.form.get('title').value;
        message.body = this.form.get('body').value;
        message.author = this.author;
        message.type = 'primary';
        this.messageService.send(message).then(() => {
            this.toastr.success('Message sent!', 'Success!');
            messageCloseButton.click();
        });
    }

    onMessageFormClose() {
        this.form.reset();
    }

}

