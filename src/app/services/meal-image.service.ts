import { Injectable } from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class MealImageService {
  apiEndPoint = 'api/images/meal';

  constructor(private http: Http,
              private authenticationService: AuthenticationService) {
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}

