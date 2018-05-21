import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Lunch} from './lunch';
import {User} from '../user/user';
import {AuthenticationService} from '../../services/authentication.service';
import {UserService} from '../user/user.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import {GroupService} from "../../services/group.service";

@Injectable()
export class LunchService {
    private lunchs: Lunch[] = [];
    public lunchsSubject = new BehaviorSubject<Lunch[]>(this.lunchs);

    apiEndPoint = 'api/lunchs';

    constructor(private authenticationService: AuthenticationService,
                private userService: UserService,
                private http: Http) {
    }

    get(id: string): Promise<Lunch> {
        let headers = new Headers({
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/' + id, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return this._deserializeLunch(response.json());
            })
            .catch(this.handleError);
    }

    getList(): Promise<Lunch[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                this.lunchs = [];
                response.json().forEach(lunchData => {
                    let lunch = this._deserializeLunch(lunchData);
                    this.lunchs.push(lunch);
                });
                this.lunchsSubject.next(this.lunchs);
                return this.lunchs;
            })
            .catch(this.handleError);
    }

    getLunchBox(weekFirstDay: string): Promise<Lunch[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/lunch-box/' + weekFirstDay, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let joined: Lunch[] = [];

                response.json().forEach(lunchData => {
                    joined.push(this._deserializeLunch(lunchData));
                });

                return joined;
            })
            .catch(this.handleError);
    }

    save(lunch: Lunch): Promise<Lunch> {
        if (lunch._id) {
            return this.put(lunch);
        }
        return this.post(lunch);
    }

    cancel(lunch: Lunch): Promise<Lunch> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(this.apiEndPoint, JSON.stringify(lunch), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return this._deserializeLunch(response.json());
            })
            .catch(this.handleError);
    }

    join(lunch: Lunch): Promise<Lunch> {
        const url = `${this.apiEndPoint}/join/${lunch._id}`;
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http
            .put(url, JSON.stringify(this.userService.getConnectedUser()), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return this._deserializeLunch(response.json());
            })
            .catch(this.handleError);
    }

    leave(lunch: Lunch) {
        let url = `${this.apiEndPoint}/leave/${lunch._id}`;
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(url, JSON.stringify(this.userService.getConnectedUser()), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return this._deserializeLunch(response.json());
            })
            .catch(this.handleError);
    }

    private post(lunch: Lunch): Promise<Lunch> {
        let headers = new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.authenticationService.getToken()
            }
        );

        return this.http
            .post(this.apiEndPoint, JSON.stringify(lunch), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let newLunch = this._deserializeLunch(response.json());
                this.lunchs.push(newLunch);
                this.lunchsSubject.next(this.lunchs);
                return newLunch;
            })
            .catch(this.handleError);
    }

    private put(lunch: Lunch) {
        const url = `${this.apiEndPoint}/${lunch._id}`;
        let headers = new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.authenticationService.getToken()
            }
        );

        return this.http
            .put(url, JSON.stringify(lunch), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return this._deserializeLunch(response.json());
            })
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private _deserializeLunch(data: any): Lunch {
        let participants = [];
        data.participants.forEach(participant => {
            participants.push(
                new User(participant._id,
                    participant.name,
                    participant.email,
                    null,
                    new Date(participant.creationDate)
                )
            );
        });
        let lunch = new Lunch(data._id,
            GroupService.deserializeGroup(data.group),
            data.title,
            data.description,
            new User(data.cook._id,
                data.cook.name,
                data.cook.email,
                null,
                new Date(data.cook.creationDate)),
            participants,
            data.image,
            new Date(data.deliveryDate),
            data.deliveryHour,
            new Date(data.limitDate),
            new Date(data.creationDate),
            data.minParticipants,
            data.maxParticipants,
            data.contribution,
            data.status,
            data.type);
        return lunch;
    }

}
