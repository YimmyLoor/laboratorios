import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReservacionesService {

  objUsuario: any;

  constructor(private http: HttpClient) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }

  cargarDetalleReservacionesDocente(){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
    };
    return this.http.post(`${environment.rutaApi}cargardetallereservacionesdocente`,JSON.stringify(data),environment.options);
     
   } 

  cargarReservacionesDocente(){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
    };
    return this.http.post(`${environment.rutaApi}cargarreservacionesdocente`,JSON.stringify(data),environment.options);
     
   } 

  cargarReservacionesAdmin(idLaboratorio:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      idLaboratorio:idLaboratorio,
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
    };
    return this.http.post(`${environment.rutaApi}cargarreservacionesadmin`,JSON.stringify(data),environment.options);
     
   } 
  
  eliminarReservacionDocente(arrayReservacion:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      arrayReservacion:arrayReservacion,
    };
    return this.http.post(`${environment.rutaApi}eliminarreservaciondocente`,JSON.stringify(data),environment.options);
     
   } 

   guardarReservacionDocente(data:any){
      return this.http.post(`${environment.rutaApi}guardarreservaciondocente`,data,{responseType:'json',reportProgress:true});
   }


/*    guardarReservacionDocente(arrayConfigurarLaboratorio:any[],arrayReservacion:any,objLaboratorio:any){
    
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      arrayConfigurarLaboratorio:arrayConfigurarLaboratorio,
      arrayReservacion:arrayReservacion,
      objLaboratorio:objLaboratorio
    };
    return this.http.post(`${environment.rutaApi}guardarreservaciondocente`,JSON.stringify(data),environment.options);
     
   }  */

}
