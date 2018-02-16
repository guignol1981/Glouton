import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Group} from "../models/group/group";
import {forEach} from "@angular/router/src/utils/collection";

@Injectable()
export class GroupService {
    apiEndPoint = 'api/groups';

    constructor(private http: Http) {
    }

    create(group: Group): Promise<Group> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        return this.http.post(this.apiEndPoint, JSON.stringify(group), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return this._deserializeGroup(response.json().data);
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
        return new Group(
            data['_id'],
            data['name'],
            data['members'],
            data['authorizedEmails']
        );
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
