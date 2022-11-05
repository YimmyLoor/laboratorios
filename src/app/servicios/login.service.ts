import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  loginRol(idUsuario:any,idRolUsuario:any,tokenLogin:any){
    
    const data:any = {
      tokenApp:environment.tokenApp,
      idUsuario:idUsuario,
      idRolUsuario:idRolUsuario,
      tokenLogin:tokenLogin
    };
    return this.http.post(`${environment.rutaApi}loginrol`,JSON.stringify(data),environment.options);
     
   } 
  login(usuario:any,clave:any){
    
    const data:any = {
      tokenApp:environment.tokenApp,
      usuario:usuario,
      clave:clave,
    };
    return this.http.post(`${environment.rutaApi}login`,JSON.stringify(data),environment.options);
     
   } 
}
