import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CarrerasService {

  objUsuario: any;

  constructor(private http: HttpClient) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }
/*   guardarLogoUnidad(data:any){
    return this.http.post(`${environment.rutaApi}guardarlogounidad`,data,{responseType:'json',reportProgress:true});
  } */
  cargarCarreras(){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
    };
    return this.http.post(`${environment.rutaApi}cargarcarreras`,JSON.stringify(data),environment.options);
     
  } 
  eliminarCarrera(item:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      ...item,
    };
    return this.http.post(`${environment.rutaApi}eliminarcarrera`,JSON.stringify(data),environment.options);
     
  } 
  modificarCarrera(item:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      ...item,
    };
    return this.http.post(`${environment.rutaApi}modificarcarrera`,JSON.stringify(data),environment.options);
     
  } 
  guardarCarrera(nombreCarrera:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      nombreCarrera:nombreCarrera,
    };
    return this.http.post(`${environment.rutaApi}guardarcarrera`,JSON.stringify(data),environment.options);
     
   } 
}
