import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {UserService} from "../models/user/user.service";
import {Message} from "../models/message/message";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class MessageService {
    apiEndPoint = 'api/messages';

    constructor(private http: Http,
                private userService: UserService,
                private authenticationService: AuthenticationService) {
    }

    public getAll(): Promise<Message[]> {
        let url = `${this.apiEndPoint}`;

        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(url, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let messages = [];
                response.json().forEach(messageData => {
                    let message = new Message(messageData._id, messageData.title, messageData.body);
                    messages.push(message);
                });
                return messages;
            })
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
