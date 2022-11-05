import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/servicios/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loginrol',
  templateUrl: './loginrol.component.html',
  styleUrls: ['./loginrol.component.css']
})
export class LoginrolComponent implements OnInit {

  validarLoading:any = 0;
  arrayRoles:any[] = [];
  idRol:string = "0";
  objUsuario: any = null;
  altoPagina:any = "0";
  constructor(
    private _servicioLogin:LoginService,
    private router:Router
  ) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    console.log(this.objUsuario);
    this.altoPagina = (window.screen.height).toString()+"px";
  }

  ngOnInit(): void {
    var listaRoles:any = sessionStorage.getItem('rolesAsignados');
    this.arrayRoles = JSON.parse(listaRoles);
    console.log(this.arrayRoles);
  }

  cancelar(){
    
    sessionStorage.removeItem('rolesAsignados');
    sessionStorage.removeItem('objUsuario');
    sessionStorage.removeItem('listaModulos');
    sessionStorage.removeItem('objRolUsuario');

    sessionStorage.removeItem('listaUnidades');
    sessionStorage.removeItem('listaLaboratorios');
    sessionStorage.removeItem('listaCarreras');
    sessionStorage.removeItem('listaDias');

    this.router.navigate(['login']);
  }

  iniciarSesion(){
    console.log(this.idRol);
    if(this.idRol == "0"){
      this.presentarMensaje("error","Error","Selecciona un rol");
    }else{
      this.iniciarSesionRol(this.objUsuario,this.idRol);
    }
   
  }

  async iniciarSesionRol(item:any,idRolUsuario:any){
    console.log(item)
    this.validarLoading = 1;
      this._servicioLogin.loginRol(item.id,idRolUsuario,item.tokenLogin)
      .subscribe({
        next: (data:any) =>{
          if(data.validar == true){
            sessionStorage.setItem('objRolUsuario',JSON.stringify(data.objRolUsuario));
            sessionStorage.setItem('listaModulos',JSON.stringify(data.listaModulos));
            this.router.navigate(['/inicio/perfil']);
           // window.location.href = '/inicio/perfil';
          }else{
            this.presentarMensaje("error","Error",data.mensaje);
            this.validarLoading = 0;
          }
          
        },
        error: (error) => {
          
          if(error.status == 0){
            this.presentarMensaje("error","Error","No se puede comunicar con el servidor");
           }else{
             this.presentarMensaje("error","Error","Error interno de la App");
           }
          console.error(error)
          this.validarLoading = 0;
        },

      });

  }
  async presentarMensaje(tipo:any,titulo:string,mensaje:string){
    Swal.fire(
      titulo,
      mensaje,
      tipo,
    )
   }
}
