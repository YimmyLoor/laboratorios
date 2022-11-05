import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private router: Router
  ) { 


  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(sessionStorage.getItem('objUsuario')){
        if(sessionStorage.getItem('objRolUsuario')){
          return true;
        }else{
          this.router.navigate(['/loginrol']);
          return false;
        }
        
      }else{
        this.router.navigate(['/login']);
        return false;
      }
     
  }
  
}
