import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RolusuariosService {

  objUsuario: any;

  constructor(private http: HttpClient) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }


  

}
