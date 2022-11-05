import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  
  objUsuario: any;

  constructor(private http: HttpClient) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }
  cargarReporteReservaciones(carreras:any,fechaInicio:any,fechaFin:any,idLaboratorio:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      carreras:carreras,
      idLaboratorio:idLaboratorio,
      fechaInicio:fechaInicio,
      fechaFin:fechaFin
    };
    return this.http.post(`${environment.rutaApi}cargarreportereservaciones`,JSON.stringify(data),environment.options);
     
  } 

  /* cargarReservasPorCarrera(idCarrera:any,fechaInicio:any,fechaFin:any){
    
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      idCarrera:idCarrera,
      fechaInicio:fechaInicio,
      fechaFin:fechaFin
    };
    return this.http.post(`${environment.rutaApi}cargarreservasporcarrera`,JSON.stringify(data),environment.options);
     
  }  */
  
}
