import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/servicios/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario:any = "";
  clave:any = "";
  validarLoading:any = 0;
  altoPagina:any = "0";
  constructor(
    private _servicioLogin:LoginService,
    private router:Router
    
  ) { 
    this.altoPagina = ( window.screen.height).toString()+"px";
  }

  ngOnInit(): void {
  }


  async iniciarSesion(){
     console.log(this.usuario);
     console.log(this.clave);
     this.validarLoading = 1;
     this._servicioLogin.login(this.usuario,this.clave).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            sessionStorage.setItem('objUsuario',JSON.stringify(data.objUsuario));
            if(data.listaRolUsuario.length == 0){
              this.presentarMensaje("error","Error","Al parecer no tienes roles asignados");
            }else if(data.listaRolUsuario.length == 1){
              sessionStorage.setItem('rolesAsignados',JSON.stringify(data.listaRolUsuario));
              this.iniciarSesionRol(data.objUsuario,data.listaRolUsuario[0].id);
            }else{
              sessionStorage.setItem('rolesAsignados',JSON.stringify(data.listaRolUsuario));
              this.router.navigate(['/loginrol']);
            }
            //
          }else{
            this.presentarMensaje("error","Error",data.mensaje);
            this.validarLoading = 0;
          }
        } ,
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

  async iniciarSesionRol(item:any,idRolUsuario:any){
    console.log(idRolUsuario)
    console.log(item)
    this.validarLoading = 1;
      this._servicioLogin.loginRol(item.id,idRolUsuario,item.tokenLogin)
      .subscribe({
        next: (data:any) =>{
          if(data.validar == true){
            sessionStorage.setItem('objRolUsuario',JSON.stringify(data.objRolUsuario));
            sessionStorage.setItem('listaModulos',JSON.stringify(data.listaModulos));
            //this.router.navigate(['/inicio']);
            this.router.navigate(['/inicio/perfil']);
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
