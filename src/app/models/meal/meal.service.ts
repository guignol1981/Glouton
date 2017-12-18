import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Meal} from "./meal";
import {User} from "../user/user";

@Injectable()
export class MealService {

    apiEndPoint = 'api/meals';

    constructor(private http: Http) {
    }

    get(id: string): Promise<Meal> {
        return this.http.get(this.apiEndPoint + '/' + id)
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    getAll(): Promise<Meal[]> {
        return this.http.get(this.apiEndPoint, {})
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

    join(meal: Meal, user: User): Promise<Meal> {
        const headers = new Headers();
        const url = `${this.apiEndPoint}/join/${meal['_id']}`;

        headers.append('Content-Type', 'application/json');

        return this.http
            .put(url, JSON.stringify(user), {headers: headers})
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    private post(model: Meal): Promise<Meal> {
        const headers = new Headers({
                'Content-Type': 'application/json'
            }
        );

        return this.http
            .post(this.apiEndPoint, JSON.stringify(model), {headers: headers})
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    private put(model: Meal) {
        const headers = new Headers();
        const url = `${this.apiEndPoint}/${model['_id']}`;

        headers.append('Content-Type', 'application/json');

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
