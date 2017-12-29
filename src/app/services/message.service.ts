import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Message} from "../models/message/message";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";
import {User} from "../models/user/user";

@Injectable()
export class MessageService {
    apiEndPoint = 'api/messages';

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    public update(message: Message): Promise<Message> {
        let url = `${this.apiEndPoint}/${message._id}`;

        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(url, JSON.stringify(message), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return this._desirializeMessage(response.json());
            })
            .catch(this.handleError);
    }

    public remove(message: Message) {
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
                return this._desirializeMessage(response.json());
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
                    messages.push(this._desirializeMessage(messageData));
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
                    messages.push(this._desirializeMessage(messageData));
                });
                return messages;
            })
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private _desirializeMessage(data: any): Message {
        let author = null;
        if (data.author) {
            author = new User(data.author._id,
                data.author.name,
                data.author.email,
                data.author.creationDate);
        }
        return new Message(data._id,
            data.title,
            data.type,
            data.category,
            data.seen,
            new User(data.recipient._id, data.recipient.name, data.recipient.email, data.recipient.creationDate),
            author,
            data.template,
            data.creationDate,
            data.thread);
    }
}
