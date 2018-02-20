import {User} from "../user/user";
import {SafeHtml, SafeScript} from "@angular/platform-browser";
export class Message {
    public sanitizedTemplate: SafeHtml = null;

    constructor(public _id: string = null,
                public title: string = '',
                public type: string = '',
                public category: string = 'secondary',
                public seen: boolean = false,
                public recipient: User = null,
                public author: User = null,
                public template: string = null,
                public creationDate: Date = new Date(),
                public thread: string[] = []) {
    }
}