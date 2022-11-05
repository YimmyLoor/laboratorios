import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SincronizarService {

  constructor(private http: HttpClient) { }

  sincronizar(objUsuario:any){
    
    const data:any = {
      tokenApp:environment.tokenApp,
      
      usuario:objUsuario.usuario,
      clave:objUsuario.clave,
      tokenLogin:objUsuario.tokenLogin,
    };
    return this.http.post(`${environment.rutaApi}sincronizar`,JSON.stringify(data),environment.options);
     
   } 
}
