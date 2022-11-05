import { Component, OnInit } from '@angular/core';
import { PermisosService } from 'src/app/servicios/permisos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rolesadmin',
  templateUrl: './rolesadmin.component.html',
  styleUrls: ['./rolesadmin.component.css']
})
export class RolesadminComponent implements OnInit {

  arrayRoles:any[] = [];
  arrayModulos:any[] = [];
  idRol:string = "0";
  validarLoading:any = 0;
  constructor(
    private _servicioPermisos:PermisosService
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentInit(){
    var listaRoles:any = sessionStorage.getItem('listaRoles');
    this.arrayRoles = JSON.parse(listaRoles);
  }

  guardarPermiso(){
    if(this.idRol == "0"){
      this.presentarMensaje("error","Error","Selecciona un rol")
    }else{
      this.validarLoading = 1;
      var arrayModulosGuardar = this.arrayModulos.filter((x:any)=>x.checked === true);
      console.log(arrayModulosGuardar)
      this._servicioPermisos.guardarPermisosRol(this.idRol,arrayModulosGuardar).subscribe({
        
      next: (data:any) =>{
        console.log(data)
        if(data.validar == true){
          console.log(data)
         // this.arrayModulos = data.listaModulos;
         this.presentarMensaje("success","Correcto",data.mensaje)
        }else{
          this.presentarMensaje("error","Error",data.mensaje)
        }
        this.validarLoading = 0;
      } ,
      error: (error) => {
        if(error.status == 0){
          this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
        }else{
          this.presentarMensaje("error","Error","Error interno de la App")
        } 
        this.validarLoading = 0;
        
      },
    });
  }
  }

  async cargarPermisosRol(){
    if(this.idRol == "0"){
      this.arrayModulos = [];
    }else{
      this.arrayModulos = [];
      this._servicioPermisos.cargarPermisosRol(this.idRol).subscribe({
      next: (data:any) =>{
        if(data.validar == true){
          console.log(data)
          this.arrayModulos = data.listaModulos;
        }else{
          this.presentarMensaje("error","Error",data.mensaje)
        }
      } ,
      error: (error) => {
        if(error.status == 0){
          this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
        }else{
          this.presentarMensaje("error","Error","Error interno de la App")
        } 
        
      },
    });
  }
 }

 async presentarMensaje(tipo:any,titulo:string,mensaje:string){
  Swal.fire(
    titulo,
    mensaje,
    tipo,
  )
 }

}
