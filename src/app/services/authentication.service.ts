import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {User} from "../models/user/user";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class AuthenticationService {
    loggedIn = false;
    isLoggedInSubject = new BehaviorSubject<Boolean>(this.loggedIn);

    constructor(private http: Http) {
    }

    saveToken(token) {
        localStorage.setItem('mean-token', token);
    }

    getToken() {
        return localStorage.getItem('mean-token');
    }

    isLoggedIn() {
        let token = this.getToken();
        let payload;

        if (token) {
            payload = token.split('.')[1];
            payload = atob(payload);
            payload = JSON.parse(payload);

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    }

    register(user: User) {
        const headers = new Headers({
                'Content-Type': 'application/json'
            }
        );

        return this.http
            .post('/api/register', JSON.stringify(user), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                this.saveToken(response.json().token);
                this.loggedIn = true;
                this.isLoggedInSubject.next(this.loggedIn);
            })
            .catch(this.handleError);
    }

    login(user) {
        const headers = new Headers({
                'Content-Type': 'application/json'
            }
        );

        return this.http
            .post('/api/login', JSON.stringify(user), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                this.saveToken(response.json().token);
                this.loggedIn = true;
                this.isLoggedInSubject.next(this.loggedIn);
            })
            .catch(this.handleError);
    }

    logout() {
        localStorage.removeItem('mean-token');
        this.loggedIn = false;
        this.isLoggedInSubject.next(this.loggedIn);
    }


    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(JSON.parse(error._body).msg || error);
    }
}
