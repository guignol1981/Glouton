import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class MealImageService {
    apiEndPoint = 'api/images/meal';

    constructor(private http: Http, private authenticationService: AuthenticationService) {
    }

    public postImage(image: File,
                     partName: string = 'image',
                     customFormData?: { [name: string]: any },
                     withCredentials?: boolean): Observable<Response> {
        let url = this.apiEndPoint;
        let headers = new Headers({
            Authorization: 'Bearer ' + this.authenticationService.getToken()
        });

        let formData = new FormData();
        for (let key in customFormData) {
            formData.append(key, customFormData[key]);
        }
        formData.append(partName, image);
        return this.http.post(url, formData, {headers: headers});
    }
}

