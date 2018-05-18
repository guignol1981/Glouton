import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Group} from "../models/group/group";
import {forEach} from "@angular/router/src/utils/collection";
import {UserService} from "../models/user/user.service";
import {User} from "../models/user/user";
import {AuthenticationService} from "./authentication.service";
import {GoogleMapService} from "./google-map.service";
import {toPromise} from "rxjs/operator/toPromise";

@Injectable()
export class GroupService {
    apiEndPoint = 'api/groups';

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    public static deserializeGroup(data: any): Group {
        let members: User[] = [];
        let pending: User[] = [];

        data['members'].forEach(memberData => {
            members.push(UserService.desirializeUser(memberData));
        });

        data['pending'].forEach(pendingData => {
            pending.push(UserService.desirializeUser(pendingData));
        });

        return new Group(
            data['_id'],
            data['name'],
            data['description'],
            UserService.desirializeUser(data['owner']),
            members,
            data['pending'],
            GoogleMapService.deserializeGeoData(data['geoData'])
        );
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
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.post(this.apiEndPoint, JSON.stringify(group), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return GroupService.deserializeGroup(response.json().data);
            })
            .catch(this.handleError);
    }

    joinRequest(group: Group): Promise<Group> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(this.apiEndPoint + '/join-request/' + group._id, JSON.stringify({}), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return GroupService.deserializeGroup(response.json().data);
            })
            .catch(this.handleError);
    }

    cancelJoinRequest(group: Group): Promise<Group> {
        let headers = new Headers({
           'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(this.apiEndPoint + '/cancel-join-request/' + group._id, JSON.stringify({}), {headers: headers})
            .toPromise()
            .then((response: Response ) => {
                return GroupService.deserializeGroup(response.json().data);
            })
            .catch(this.handleError);
    }

    confirmJoinRequest(groupId: string, userId: string, accept: string): Promise<number> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/confirm-join-request/' + groupId + '/' + userId + '/' + accept, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return response.status;
            })
            .catch(this.handleError);
    }

    leave(group: Group): Promise<Group> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(this.apiEndPoint + '/leave/' + group._id, {}, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return GroupService.deserializeGroup(response.json().data);
            })
            .catch(this.handleError);
    }

    remove(group: Group): Promise<Group> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.delete(this.apiEndPoint + '/remove/' + group._id, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return GroupService.deserializeGroup(response.json().data);
            })
            .catch(this.handleError);
    }

    getList(): Promise<Group[]> {
        return this.http.get(this.apiEndPoint)
            .toPromise()
            .then((response: Response) => {
                let groups = [];
                response.json().data.forEach(data => {
                    groups.push(GroupService.deserializeGroup(data));
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
                    groups.push(GroupService.deserializeGroup(data));
                });
                return groups;
            })
            .catch(this.handleError);
    }

    getUserGroup(): Promise<Group[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/joined', {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let groups: Group[] = [];
                response.json().data.forEach(groupData => {
                    groups.push(GroupService.deserializeGroup(groupData));
                });
                return groups;
            })

            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
