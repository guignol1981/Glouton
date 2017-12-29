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
                let mealData = response.json();
                return new Meal(mealData._id,
                    mealData.title,
                    mealData.description,
                    mealData.imageUrl,
                    mealData.cook,
                    new Date(mealData.date),
                    new Date(mealData.limitDate),
                    mealData.minParticipants,
                    mealData.maxParticipants,
                    mealData.participants,
                    mealData.creationDate);
            })
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
                this.meals = [];
                response.json().forEach(mealData => {
                    let meal = new Meal(mealData._id,
                        mealData.title,
                        mealData.description,
                        mealData.imageUrl,
                        mealData.cook,
                        new Date(mealData.date),
                        new Date(mealData.limitDate),
                        mealData.minParticipants,
                        mealData.maxParticipants,
                        mealData.participants,
                        mealData.creationDate);
                    this.meals.push(meal);
                });
                this.mealsSubject.next(this.meals);
                return this.meals;
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
            .then((response: Response) => {
                let joined: Meal[] = [];

                response.json().forEach(mealData => {
                    let meal = new Meal(mealData._id,
                        mealData.title,
                        mealData.description,
                        mealData.imageUrl,
                        mealData.cook,
                        new Date(mealData.date),
                        new Date(mealData.limitDate),
                        mealData.minParticipants,
                        mealData.maxParticipants,
                        mealData.participants,
                        mealData.creationDate);
                    joined.push(meal);
                });

                return joined;
            })
            .catch(this.handleError);
    }

    save(meal: Meal): Promise<Meal> {
        if (meal['_id']) {
            return this.put(meal);
        }
        return this.post(meal);
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
            .then((response: Response) => {
                let mealData = response.json();
                return new Meal(mealData._id,
                    mealData.title,
                    mealData.description,
                    mealData.imageUrl,
                    mealData.cook,
                    new Date(mealData.date),
                    new Date(mealData.limitDate),
                    mealData.minParticipants,
                    mealData.maxParticipants,
                    mealData.participants,
                    mealData.creationDate);
            })
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
            .then((response: Response) => {
                let mealData = response.json();
                return new Meal(mealData._id,
                    mealData.title,
                    mealData.description,
                    mealData.imageUrl,
                    mealData.cook,
                    new Date(mealData.date),
                    new Date(mealData.limitDate),
                    mealData.minParticipants,
                    mealData.maxParticipants,
                    mealData.participants,
                    mealData.creationDate);
            })
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
                let mealData = response.json();
                let newMeal = new Meal(mealData._id,
                    mealData.title,
                    mealData.description,
                    mealData.imageUrl,
                    mealData.cook,
                    new Date(mealData.date),
                    new Date(mealData.limitDate),
                    mealData.minParticipants,
                    mealData.maxParticipants,
                    mealData.participants,
                    mealData.creationDate);
                this.meals.push(newMeal);
                this.mealsSubject.next(this.meals);
                return newMeal;
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
            .then((response: Response) => {
                let mealData = response.json();
                return new Meal(mealData._id,
                    mealData.title,
                    mealData.description,
                    mealData.imageUrl,
                    mealData.cook,
                    new Date(mealData.date),
                    new Date(mealData.limitDate),
                    mealData.minParticipants,
                    mealData.maxParticipants,
                    mealData.participants,
                    mealData.creationDate);
            })
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private deserializeMeal(data: any): Meal {

    }

}
