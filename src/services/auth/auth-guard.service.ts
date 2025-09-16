import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../LoginService/login-service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router, public _loginService: LoginService,) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    let accessRoutes = [];
    if (this._loginService.isLoggedIn()) {
      accessRoutes = sessionStorage.getItem("pathObj") != null
        ? JSON.parse(sessionStorage.getItem("pathObj") || "{}")?.pathArr
        : [];
      let currentURL = "login";
      if (state.url.toString() !== "/home" || accessRoutes.length) {
        currentURL = state.url.slice(1).toString();
      }
      if (this.hasPath([...accessRoutes, "login"], currentURL)) {
        
        return true;
      } else {
         this.router.navigate(['/home']);
        return false;
      }
    }
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }

  canLoad(state: RouterStateSnapshot): boolean {
    
    if (this._loginService.isLoggedIn()) {
      const user = this._loginService.getUserDetails();
      if (!user) {
        this.router.navigate(["/login"]);
      }
      return true;
    }

    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }

  hasPath(pathArr: string[], val: string) {
    return pathArr.includes(val);
  }
}
