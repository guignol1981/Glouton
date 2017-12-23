import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Meal} from "./meal";
import {User} from "../user/user";
import {AuthenticationService} from "../../services/authentication.service";
import {UserService} from "../user/user.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class MealService {
    private meals: Meal[] = [];
    public mealsSubject = new BehaviorSubject<Meal[]>(this.meals);

    apiEndPoint = 'api/meals';

    constructor(private authenticationService: AuthenticationService,
                private userService: UserService,
                private http: Http) {
    }

    get(id: string): Promise<Meal> {
        let headers = new Headers({
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/' + id, {headers: headers})
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    getAll(): Promise<Meal[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                this.meals = response.json();
                this.mealsSubject.next(this.meals);
                return response.json();
            })
            .catch(this.handleError);
    }

    getJoined(): Promise<Meal[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/joined', {headers: headers})
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    save(model: Meal): Promise<Meal> {
        if (model['_id']) {
            return this.put(model);
        }
        return this.post(model);
    }

    join(meal: Meal): Promise<Meal> {
        const url = `${this.apiEndPoint}/join/${meal['_id']}`;
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http
            .put(url, JSON.stringify(this.userService.getConnectedUser()), {headers: headers})
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    leave(meal: Meal) {
        let url = `${this.apiEndPoint}/leave/${meal['_id']}`;
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(url, JSON.stringify(this.userService.getConnectedUser()), {headers: headers})
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    private post(model: Meal): Promise<Meal> {
        let headers = new Headers({
                'Content-Type': 'application/json',
                 Authorization: 'Bearer ' + this.authenticationService.getToken()
            }
        );

        return this.http
            .post(this.apiEndPoint, JSON.stringify(model), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let meal = <Meal>response.json();
                this.meals.push(meal);
                this.mealsSubject.next(this.meals);
                return meal;
            })
            .catch(this.handleError);
    }

    private put(model: Meal) {
        const url = `${this.apiEndPoint}/${model['_id']}`;
        let headers = new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.authenticationService.getToken()
            }
        );

        return this.http
            .put(url, JSON.stringify(model), {headers: headers})
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
