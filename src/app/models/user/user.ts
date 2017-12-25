export class User {

    constructor(public _id: string = null,
                public name: string = '',
                public email: string = '',
                public creationDate: Date = new Date()) {
    }
}
