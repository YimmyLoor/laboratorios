import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  objUsuario: any;

  constructor(private http: HttpClient) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }

  eliminarBanner(item:any){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
      ...item,
    };
    return this.http.post(`${environment.rutaApi}eliminarbanner`,JSON.stringify(data),environment.options);
     
  } 

  cargarBanners(){
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    const data:any = {
      tokenApp:environment.tokenApp,
      objUsuario:this.objUsuario,
    };
    return this.http.post(`${environment.rutaApi}cargarbanners`,JSON.stringify(data),environment.options);
     
  } 
  guardarBanner(data:any){
    return this.http.post(`${environment.rutaApi}guardarbanner`,data,{responseType:'json',reportProgress:true});
  }
}
