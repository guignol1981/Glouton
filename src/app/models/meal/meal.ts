import {User} from "../user/user";
export class Meal {
    public title: string;
    public description: string;
    public cook: User;
    public date: Date;

    constructor(public _id: string = null) {
    }

}
