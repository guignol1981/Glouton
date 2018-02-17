import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {GeoData} from "../models/geo-data/geo-data";

@Injectable()
export class GoogleMapService {
    apiEndPoint = 'api/google-map';

    constructor(private http: Http) {
    }

    public static deserializeGeoData(data: any): GeoData {
        return new GeoData(
            data['lat'],
            data['lng'],
            data['formattedAddress'],
        );
    }

    getGeoData(address: string): Promise<GeoData> {
        return this.http.get(this.apiEndPoint + '/' + address)
            .toPromise()
            .then((response: Response) => {
                if (response.json().data === {}) {
                    return new GeoData();
                }
                return GoogleMapService.deserializeGeoData(response.json().data);
            })
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
