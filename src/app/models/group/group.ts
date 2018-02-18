import {User} from "../user/user";
import {GeoData} from "../geo-data/geo-data";
import * as moment from "moment";
import _isoWeek = moment.unitOfTime._isoWeek;

export class Group {

    constructor(public _id: string = null,
                public name: string = '',
                public description: string = '',
                public owner: User = null,
                public members: User[] = [],
                public geoData: GeoData = new GeoData()) {
    }

    isOwner(user: User) {
        return this.owner._id === user._id;
    }

    canJoin(user: User) {
        let index = this.members.indexOf(user);
        return index === -1 && this.owner._id !== user._id;
    }

    canLeave(user: User) {
        let index = this.members.indexOf(user);
        return index !== -1 && this.owner._id !== user._id;
    }

}
