import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  objUsuario: any;

  constructor(private http: HttpClient) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }

  
  guardarFotoPerfil(data:any){
    return this.http.post(`${environment.rutaApi}guardarfotoperfil`,data,{responseType:'json',reportProgress:true});
  }
  modificarRolesUsuario(idUsuario:any,arrayRoles:any[]){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      arrayRoles:arrayRoles,
      idUsuario:idUsuario
    };
    return this.http.post(`${environment.rutaApi}modificarrolesusuario`,JSON.stringify(data),environment.options);
     
  } 

  eliminarUsuario(objUsuarioEliminar:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      objUsuarioEliminar:objUsuarioEliminar
    };
    return this.http.post(`${environment.rutaApi}eliminarusuario`,JSON.stringify(data),environment.options);
     
  } 

  enviarClaveUsuario(objUsuarioRegistro:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      objUsuarioRegistro:objUsuarioRegistro
    };
    return this.http.post(`${environment.rutaApi}enviarclave`,JSON.stringify(data),environment.options);
     
  } 

  cargarUsuarios(){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
    };
    return this.http.post(`${environment.rutaApi}cargarusuarios`,JSON.stringify(data),environment.options);
     
  } 

  modificarUsuario(objUsuarioModificar:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      objUsuarioModificar:objUsuarioModificar
    };
    return this.http.post(`${environment.rutaApi}modificarusuario`,JSON.stringify(data),environment.options);
     
  } 
  cambiarClave(objCambiarClave:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      ...objCambiarClave
    };
    return this.http.post(`${environment.rutaApi}cambiarclave`,JSON.stringify(data),environment.options);
     
  } 

  guardarUsuario(objUsuarioRegistro:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      objUsuarioRegistro:objUsuarioRegistro
    };
    return this.http.post(`${environment.rutaApi}guardarusuario`,JSON.stringify(data),environment.options);
     
  } 
}
