import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Group} from "../models/group/group";
import {forEach} from "@angular/router/src/utils/collection";
import {UserService} from "../models/user/user.service";
import {User} from "../models/user/user";
import {AuthenticationService} from "./authentication.service";
import {GoogleMapService} from "./google-map.service";

@Injectable()
export class GroupService {
    apiEndPoint = 'api/groups';

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    checkAvailability(name: string): Promise<boolean> {
        return this.http.get(this.apiEndPoint + '/availability/' + name)
            .toPromise()
            .then((response: Response) => {
                return response.json().data;
            })
            .catch(this.handleError);
    }

    create(group: Group): Promise<Group> {
        let headers = new Headers({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.post(this.apiEndPoint, JSON.stringify(group), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return this._deserializeGroup(response.json().data);
            })
            .catch(this.handleError);
    }

    getList(): Promise<Group[]> {
        return this.http.get(this.apiEndPoint)
            .toPromise()
            .then((response: Response) => {
                let groups = [];
                response.json().data.forEach(data => {
                    groups.push(this._deserializeGroup(data));
                });
                return groups;
            })
            .catch(this.handleError);
    }

    getByName(name: string): Promise<Group[]> {
        return this.http.get(this.apiEndPoint + '/' + name)
            .toPromise()
            .then((response: Response) => {
                let groups = [];
                response.json().data.forEach(data => {
                    groups.push(this._deserializeGroup(data));
                });
                return groups;
            })
            .catch(this.handleError);
    }

    _deserializeGroup(data: any): Group {
        let members: User[] = [];

        data['members'].forEach(memberData => {
            members.push(UserService.desirializeUser(memberData));
        });

        return new Group(
            data['_id'],
            data['name'],
            UserService.desirializeUser(data['owner']),
            members,
            GoogleMapService.deserializeGeoData(data['geoData'])
        );
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
