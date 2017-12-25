export class Message {
    constructor(public _id: string = null,
                public title: string = '',
                public body: string = '',
                public type: string = '',
                public seen: boolean = false) {
    }
}