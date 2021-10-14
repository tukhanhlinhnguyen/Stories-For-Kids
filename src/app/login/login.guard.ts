import {  CanActivate,  ActivatedRouteSnapshot,  RouterStateSnapshot,  Router} from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthenticationStateService } from "./auth-store/auth.state.service";

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authservice: AuthenticationStateService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let auth = this.authservice.getAuth();

    if (!(auth?.token)) {
      this.router.navigate(["login"]);
      return false;
    }

    return !(route.data?.roles) || route.data.roles.some((role:string)=>auth.roles.includes(role))
  }
}