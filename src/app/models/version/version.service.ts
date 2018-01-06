import {Injectable} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Headers, Http, Response} from '@angular/http';
import {Version} from './version';

@Injectable()
export class VersionService {
    apiEndPoint = 'api/versions';

    constructor(private authenticationService: AuthenticationService,
                private http: Http) {
    }

    getList(): Promise<Version[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let versions = [];
                response.json().forEach(versionData => {
                    versions.push(this._deserializeVersion(versionData));
                });
                return versions;
            })
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private _deserializeVersion(data: any): Version {
        return new Version(data._id,
            data.versionNumber,
            data.features,
            data.fixes,
            data.knownIssues,
            data.creationDate);
    }
}
