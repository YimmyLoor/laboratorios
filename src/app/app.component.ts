import { Component } from '@angular/core';
import { SincronizarService } from './servicios/sincronizar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ESPAM MFL';
  objUsuario: any = null;
  constructor(
    private _servicioSincronizar:SincronizarService
  ) { 
    if(sessionStorage.getItem('objUsuario')){
      var listaUsuario:any = sessionStorage.getItem('objUsuario');
      this.objUsuario = JSON.parse(listaUsuario);
      this.sincronizar(this.objUsuario);
    }
  }

  async sincronizar(objUsuario:any){
    this._servicioSincronizar.sincronizar(objUsuario).subscribe({
      next: (data:any) =>{
     
        if(data.validar == true){
          if(data.listaCarreras.length > 0){
            sessionStorage.setItem('listaRoles',JSON.stringify(data.listaRoles));
            sessionStorage.setItem('listaDias',JSON.stringify(data.listaDias));
            sessionStorage.setItem('listaCarreras',JSON.stringify(data.listaCarreras));
            sessionStorage.setItem('listaUnidades',JSON.stringify(data.listaUnidades));
            sessionStorage.setItem('listaLaboratorios',JSON.stringify(data.listaLaboratorios));
          }
        }else{
         
        }
      } ,
      error: (error) => {
        if(error.status == 0){
         

        }else{
          
        } 

      },
    });
  }
}
