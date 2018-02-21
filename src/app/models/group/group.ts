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
                public pending: User[] = [],
                public geoData: GeoData = new GeoData()) {
    }

    isOwner(user: User) {
        return this.owner._id === user._id;
    }

    isPending(user: User) {
        let isPending = false;
        this.pending.forEach(pending => {
            if (pending._id === user._id) {
                isPending = true;
                return false;
            }
        });
        return isPending;
    }

    isMember(user: User) {
        let isMember = false;
        this.members.forEach(member => {
            if (member._id === user._id) {
                isMember = true;
                return false;
            }
        });
        return isMember;
    }
}
