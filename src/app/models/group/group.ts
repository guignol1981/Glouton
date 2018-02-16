import {User} from "../user/user";

export class Group {

    constructor(public _id: string = null,
                public name: string = '',
                public users: User[] = [],
                public authorizedEmails: string[] = []) {}


}
