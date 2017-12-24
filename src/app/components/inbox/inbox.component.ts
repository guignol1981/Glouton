import { Component, OnInit } from '@angular/core';
import {MessageService} from "../../services/message.service";
import {Message} from "../../models/message/message";

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  messages: Message[];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messageService.getAll().then(messages => this.messages = messages);
  }

}
