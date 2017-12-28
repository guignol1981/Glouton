import {User} from "../user/user";
export class Message {
    public body: string[] = [];
    public author: User;
    public recipient: User;

    constructor(public _id: string = null,
                public title: string = '',
                public bodyData: any = null,
                public type: string = '',
                public seen: boolean = false,
                public authorData: any = null,
                public recipientData: any = null,
                public template: string = null) {
        if (bodyData) {
            bodyData.forEach(data => {
                this.body.push(data);
            });
        }

        if (authorData) {
            this.author = new User(authorData._id, authorData.name, authorData.email, authorData.creationDate);
        }
        if (recipientData) {
            this.recipient = new User(recipientData._id, recipientData.name, recipientData.email, recipientData.creationDate);
        }
    }
}