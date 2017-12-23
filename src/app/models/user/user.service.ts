import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {User} from "./user";
import {AuthenticationService} from "../../services/authentication.service";

@Injectable()
export class UserService {
    user: User;

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    getConnectedUser(): Promise<User> {
        let headers = new Headers({
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get('/api/profile', {headers: headers})
            .toPromise()
            .then((response: Response) => <User>response.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
