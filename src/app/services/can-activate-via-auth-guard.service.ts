import {Injectable} from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";

@Injectable()
export class CanActivateViaAuthGuardService implements CanActivate {

    constructor(private authenticationService: AuthenticationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.authenticationService.isLoggedIn();
    }

}
