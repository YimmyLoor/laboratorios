import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UnidadesService {
  objUsuario: any;

  constructor(private http: HttpClient) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }
  eliminarRedSocialUnidad(item:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      ...item,
    };
    return this.http.post(`${environment.rutaApi}eliminarredsocialunidad`,JSON.stringify(data),environment.options);
     
  } 


  guardarLogoUnidad(data:any){
    return this.http.post(`${environment.rutaApi}guardarlogounidad`,data,{responseType:'json',reportProgress:true});
  }
  guardarRedSocialUnidad(objRedSocial:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      ...objRedSocial
    };
    return this.http.post(`${environment.rutaApi}guardarredsocialunidad`,JSON.stringify(data),environment.options);
     
  } 
  cargarUnidades(){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
    };
    return this.http.post(`${environment.rutaApi}cargarunidades`,JSON.stringify(data),environment.options);
     
  } 
  eliminarUnidad(item:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      ...item,
    };
    return this.http.post(`${environment.rutaApi}eliminarunidad`,JSON.stringify(data),environment.options);
     
  } 
  modificarUnidad(item:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      ...item,
    };
    return this.http.post(`${environment.rutaApi}modificarunidad`,JSON.stringify(data),environment.options);
     
  } 
  guardarUnidad(idUsuario:any,idCarrera:any,nombreUnidad:any,descripcionUnidad:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      idUsuario:idUsuario,
      idCarrera:idCarrera,
      nombreUnidad:nombreUnidad,
      descripcionUnidad:descripcionUnidad,
    };
    return this.http.post(`${environment.rutaApi}guardarunidad`,JSON.stringify(data),environment.options);
     
   } 
}
