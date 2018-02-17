import {User} from "../user/user";
import {GeoData} from "../geo-data/geo-data";

export class Group {

    constructor(public _id: string = null,
                public name: string = '',
                public owner: User = null,
                public members: User[] = [],
                public geoData: GeoData = new GeoData()) {
    }

}
