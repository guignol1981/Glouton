export interface PhotoData {
    socialUrl: string;
    cloudStorageObject: string;
    cloudStoragePublicUrl: string;
}

export class User {

    constructor(public _id: string = null,
                public name: string,
                public email: string,
                public photoData?: PhotoData,
                public creationDate: Date = new Date()) {
    }
}
