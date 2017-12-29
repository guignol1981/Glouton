import {User} from "../user/user";
export class Message {
    public recipient: User;

    constructor(public _id: string = null,
                public title: string = '',
                public type: string = '',
                public category: string = 'secondary',
                public seen: boolean = false,
                public recipientData: any = null,
                public template: string = null,
                public creationDate: Date = null) {
        if (recipientData) {
            this.recipient = new User(recipientData._id, recipientData.name, recipientData.email, recipientData.creationDate);
        }
    }
}