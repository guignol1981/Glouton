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

    public static deserializeUser(data: any): User {
        return new User(data._id,
            data.name,
            data.email,
            data.photoData,
            data.creationDate);
    }

    getConnectedUser(): Promise<User> {
        let headers = new Headers({
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get('/api/profile', {headers: headers})
            .toPromise()
            .then((response: Response) => UserService.deserializeUser(response.json()))
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
