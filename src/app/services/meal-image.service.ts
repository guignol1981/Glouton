import { Injectable } from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class MealImageService {
  constructor(private http: Http,
              private authenticationService: AuthenticationService) {
  }

  getMealImageApiEndPoint() {
    return 'api/images/meal';
  }

  getMealImage(id) {
    let headers = new Headers({
      Authorization: 'Bearer ' + this.authenticationService.getToken()
    });

    return this.http.get(this.getMealImageApiEndPoint() + '/' + id, {headers: headers})
        .toPromise()
        .then((response: Response) => response);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}

