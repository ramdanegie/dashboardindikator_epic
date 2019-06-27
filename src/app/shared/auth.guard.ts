import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // return true;
    if (localStorage.getItem('user-data')) {
      // logged in so return true
   
      var authorization = "";
      // var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VtZW50In0.7deJBpwcQwNKlt8WXbedSRxpGfMRch37Om96SELitrmWiKUO2DzaWjWiwu-dOQKPrP2tsLyVTciY9nHy4hfoXQ';
      var arr = document.cookie.split(';')
      for (var i = 0; i < arr.length; i++) {
        var element = arr[i].split('=');
        if (element[0].indexOf('authorization') > 0) {
          authorization = element[1];
        }
      }
    
      window.localStorage.setItem('X-AUTH-TOKEN', JSON.stringify(authorization));
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login']);
    // , { queryParams: { returnUrl: state.url } });
    return false;
  }
}
