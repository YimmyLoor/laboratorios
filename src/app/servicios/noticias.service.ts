import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  objUsuario: any;

  constructor(private http: HttpClient) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }

  eliminarNoticia(item:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      objNoticia:item,
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
    };
    return this.http.post(`${environment.rutaApi}eliminarnoticia`,JSON.stringify(data),environment.options);
  }
  guardarNoticia(data:any){
    return this.http.post(`${environment.rutaApi}guardarnoticia`,data,{responseType:'json',reportProgress:true});
  }

  cargarNoticias(){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
    };
    return this.http.post(`${environment.rutaApi}cargarnoticias`,JSON.stringify(data),environment.options);
     
  } 
}
