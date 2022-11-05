import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConfigurarLaboratorioService {

  objUsuario: any;

  constructor(private http: HttpClient) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }
  
  filtrarConfigurarLaboratorioDocente(idLaboratorio:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      idLaboratorio:idLaboratorio,
    };
    return this.http.post(`${environment.rutaApi}filtrarconfiguracionlaboratoriodocente`,JSON.stringify(data),environment.options);
     
  } 
  filtrarConfigurarLaboratorio(idLaboratorio:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      idLaboratorio:idLaboratorio,
    };
    return this.http.post(`${environment.rutaApi}filtrarconfiguracionlaboratorio`,JSON.stringify(data),environment.options);
     
  } 
  guardarConfigurarLaboratorio(idLaboratorio:any,horaInicio:any,horaFin:any,intervalo:any,arrayConfguracion:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      idLaboratorio:idLaboratorio,
      horaInicio:horaInicio,
      horaFin:horaFin,
      intervalo:intervalo,
      arrayConfguracion:arrayConfguracion,
    };
    return this.http.post(`${environment.rutaApi}guardarconfiguracionlaboratorio`,JSON.stringify(data),environment.options);
     
   } 
}
