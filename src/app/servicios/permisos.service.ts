import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  objUsuario: any;

  constructor(private http: HttpClient) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }
  guardarPermisosRol(idRol:any,arrayModulos:any[]){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      idRol:idRol,
      arrayModulos:arrayModulos
    };
    return this.http.post(`${environment.rutaApi}guardarpermisorol`,JSON.stringify(data),environment.options);
     
  } 
  cargarPermisosRol(idRol:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      idRol:idRol
    };
    return this.http.post(`${environment.rutaApi}cargarpermisosrol`,JSON.stringify(data),environment.options);
     
  } 
}
