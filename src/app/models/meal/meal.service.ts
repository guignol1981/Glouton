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
            .then((response: Response) => {
                return this._deserializeMeal(response.json());
            })
            .catch(this.handleError);
    }

    getList(): Promise<Meal[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                this.meals = [];
                response.json().forEach(mealData => {
                    let meal = this._deserializeMeal(mealData);
                    this.meals.push(meal);
                });
                this.mealsSubject.next(this.meals);
                return this.meals;
            })
            .catch(this.handleError);
    }

    getLunchBox(weekFirstDay: string): Promise<Meal[]> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.get(this.apiEndPoint + '/lunch-box/' + weekFirstDay, {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let joined: Meal[] = [];

                response.json().forEach(mealData => {
                    joined.push(this._deserializeMeal(mealData));
                });

                return joined;
            })
            .catch(this.handleError);
    }

    save(meal: Meal): Promise<Meal> {
        if (meal._id) {
            return this.put(meal);
        }
        return this.post(meal);
    }

    join(meal: Meal): Promise<Meal> {
        const url = `${this.apiEndPoint}/join/${meal._id}`;
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http
            .put(url, JSON.stringify(this.userService.getConnectedUser()), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return this._deserializeMeal(response.json());
            })
            .catch(this.handleError);
    }

    leave(meal: Meal) {
        let url = `${this.apiEndPoint}/leave/${meal._id}`;
        let headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        return this.http.put(url, JSON.stringify(this.userService.getConnectedUser()), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return this._deserializeMeal(response.json());
            })
            .catch(this.handleError);
    }

    private post(meal: Meal): Promise<Meal> {
        let headers = new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.authenticationService.getToken()
            }
        );

        return this.http
            .post(this.apiEndPoint, JSON.stringify(meal), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                let newMeal = this._deserializeMeal(response.json());
                this.meals.push(newMeal);
                this.mealsSubject.next(this.meals);
                return newMeal;
            })
            .catch(this.handleError);
    }

    private put(meal: Meal) {
        const url = `${this.apiEndPoint}/${meal._id}`;
        let headers = new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.authenticationService.getToken()
            }
        );

        return this.http
            .put(url, JSON.stringify(meal), {headers: headers})
            .toPromise()
            .then((response: Response) => {
                return this._deserializeMeal(response.json());
            })
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private _deserializeMeal(data: any): Meal {
        let participants = [];
        data.participants.forEach(participant => {
            participants.push(
                new User(participant._id,
                    participant.name,
                    participant.email,
                    new Date(participant.creationDate)
                )
            );
        });
        let meal = new Meal(data._id,
            data.title,
            data.description,
            new User(data.cook._id,
                data.cook.name,
                data.cook.email,
                new Date(data.cook.creationDate)),
            participants,
            data.image,
            new Date(data.deliveryDate),
            new Date(data.limitDate),
            new Date(data.creationDate),
            data.minParticipants,
            data.maxParticipants,
            data.contribution,
            data.status);
        return meal;
    }

}
