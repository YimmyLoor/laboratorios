import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {

  objUsuario: any;

  constructor(private http: HttpClient) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }

  modificarMaterial(data:any){
    return this.http.post(`${environment.rutaApi}modificarmaterial`,data,{responseType:'json',reportProgress:true});
  }

  guardarMaterial(data:any){
    return this.http.post(`${environment.rutaApi}guardarmaterial`,data,{responseType:'json',reportProgress:true});
  }
  eliminarMaterial(objMaterial:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      objMaterial:objMaterial
    };
    return this.http.post(`${environment.rutaApi}eliminarmaterial`,JSON.stringify(data),environment.options);
     
  } 

  modificarCodicionMaterial(objCondicion:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      objCondicion:objCondicion
    };
    return this.http.post(`${environment.rutaApi}modificarcondicionmaterial`,JSON.stringify(data),environment.options);
     
  } 
  cargarMateriales(idLaboratorio:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      idLaboratorio:idLaboratorio
    };
    return this.http.post(`${environment.rutaApi}cargarmateriales`,JSON.stringify(data),environment.options);
     
  } 
}
