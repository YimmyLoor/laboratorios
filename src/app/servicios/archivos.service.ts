import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  objUsuario: any;

  constructor(private http: HttpClient) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }


  eliminarArchivo(item:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      ...item,
    };
    return this.http.post(`${environment.rutaApi}eliminararchivo`,JSON.stringify(data),environment.options);
     
  } 

  guardarArchivo(data:any){
    return this.http.post(`${environment.rutaApi}guardararchivo`,data,{responseType:'json',reportProgress:true});
  }

  cargarArchivos(){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
    };
    return this.http.post(`${environment.rutaApi}cargararchivos`,JSON.stringify(data),environment.options);
     
  } 


  
  cargarTipoArchivos(){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
    };
    return this.http.post(`${environment.rutaApi}cargartipoarchivos`,JSON.stringify(data),environment.options);
     
  } 


}
