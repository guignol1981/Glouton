import { Injectable } from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class MealImageService {
  apiEndPoint = 'api/images/meal';
}

