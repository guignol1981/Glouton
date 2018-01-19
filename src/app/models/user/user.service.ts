import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {User} from "./user";
import {AuthenticationService} from "../../services/authentication.service";

@Injectable()
export class UserService {
    user: User = null;

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    getConnectedUser(): Promise<User> {
        if (this.user) {
            return new Promise<User>(resolve => this.user);
        } else {
            let headers = new Headers({
                Authorization: 'Bearer ' + this.authenticationService.getToken()
            });

            return this.http.get('/api/profile', {headers: headers})
                .toPromise()
                .then((response: Response) => this._desirializeUser(response.json()))
                .catch(this.handleError);
        }
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private _desirializeUser(data: any): User {
        return new User(data._id,
            data.name,
            data.email,
            data.creationDate);
    }

}
