import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Message} from "../models/message/message";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class MessageService {
    apiEndPoint = 'api/messages';

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    public save(message: Message): Promise<Message> {
        let url = `${this.apiEndPoint}/${message._id}`;

        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(url, JSON.stringify(message), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let messageData = response.json();
                return new Message(messageData._id,
                    messageData.title,
                    messageData.body,
                    messageData.type,
                    messageData.seen);
            })
            .catch(this.handleError);
    }

    public delete(message: Message) {
        let url = `${this.apiEndPoint}/${message._id}`;
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.delete(url, {headers: headers})
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    public send(message: Message): Promise<Message> {
        let url = `${this.apiEndPoint}`;
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.post(url, JSON.stringify(message), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let messageData = response.json();
                return new Message(
                    messageData._id,
                    messageData.title,
                    messageData.body,
                    messageData.type,
                    messageData.seen);
            })
            .catch(this.handleError);
    }

    public getUnseen(): Promise<Message[]> {
        let url = `${this.apiEndPoint}/unseen`;

        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(url, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let messages = [];
                response.json().forEach((messageData) => {
                    messages.push(
                        new Message(messageData._id,
                            messageData.title,
                            messageData.body,
                            messageData.type,
                            messageData.seen,
                            messageData.author));
                });
                return messages;
            })
            .catch(this.handleError);
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
                response.json().forEach((messageData) => {
                    messages.push(
                        new Message(messageData._id,
                            messageData.title,
                            messageData.body,
                            messageData.type,
                            messageData.seen,
                            messageData.author,
                            null,
                            messageData.template));
                    console.log(messageData.template);
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
