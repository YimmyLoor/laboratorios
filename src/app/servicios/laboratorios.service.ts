import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LaboratoriosService {

  objUsuario: any;

  constructor(private http: HttpClient) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }

  guardarFotoLaboratorio(data:any){
    return this.http.post(`${environment.rutaApi}guardarfotolaboratorio`,data,{responseType:'json',reportProgress:true});
  }

  cargarLaboratoriosReporte(){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
    };
    return this.http.post(`${environment.rutaApi}cargarlaboratoriosreporte`,JSON.stringify(data),environment.options);
     
  } 

  cargarLaboratorios(){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
    };
    return this.http.post(`${environment.rutaApi}cargarlaboratorios`,JSON.stringify(data),environment.options);
     
  } 
  eliminarLaboratorio(item:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      ...item,
    };
    return this.http.post(`${environment.rutaApi}eliminarlaboratorio`,JSON.stringify(data),environment.options);
     
  } 
  modificarLaboratorio(item:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      ...item,
    };
    return this.http.post(`${environment.rutaApi}modificarlaboratorio`,JSON.stringify(data),environment.options);
     
  } 
  guardarLaboratorio(idUnidad:any,idUsuario:any,nombreLaboratorio:any,descripcionLaboratorio:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      idUnidad:idUnidad,
      idUsuario:idUsuario,
      nombreLaboratorio:nombreLaboratorio,
      descripcionLaboratorio:descripcionLaboratorio,
    };
    return this.http.post(`${environment.rutaApi}guardarlaboratorio`,JSON.stringify(data),environment.options);
     
   } 
}
