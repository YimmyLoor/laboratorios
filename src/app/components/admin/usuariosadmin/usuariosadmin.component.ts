import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuariosadmin',
  templateUrl: './usuariosadmin.component.html',
  styleUrls: ['./usuariosadmin.component.css']
})
export class UsuariosadminComponent implements OnInit {









  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  arrayRoles:any[] = [];
  arrayRoles2:any[] = [];
  arrayCarreras:any[] = [];
  arrayUsuarios: any[] = [];
  idRol:any = "0";
  identificadorRol:any = 0;
  objRegistro:any = {
    idRol:"0",
    idTipoIdentificacion:"1",
    cedula:"",
    nombres:"",
    apellidos:"",
    correo:"",
    correoInstitucional:"",
    telefono:"",
    telefonoInternacional:"",
    idCarrera:"0"
  };
  objModificar:any = {
    id:"0",
    idRol:"0",
    idTipoIdentificacion:"0",
    cedula:"",
    nombres:"",
    apellidos:"",
    correo:"",
    correoInstitucional:"",
    telefono:"",
    telefonoInternacional:"",
    idCarrera:"0"
  };
  validarLoading = 0;
  validarLoadingModificar = 0;
  validarLoadingModalRoles = 0;
  idUsuarioSeleccionado: any;
  idCarreraRol:any = "0";
  validarSelectCarreras = false;
  idTipoIdentificacion:any = "1"; 
  arrayTipoIdentificacion:any[] = [
    {
      tipo:"1",
      nombre:"Cédula",
      checked:true
    },
    {
      tipo:"2",
      nombre:"Pasaporte",
      checked:false
    },
  

  ];
  validarLoadingTabla:string = 'block';
  validarTabla:string = 'none';
  constructor(
    private _servicioUsuarios:UsuariosService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType:'full_numbers',
      pageLength:10
    };
    
   this.cargarUsuarios();
   
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterContentInit(){
    var listaRoles:any = sessionStorage.getItem('listaRoles');
    this.arrayRoles = JSON.parse(listaRoles);
    var listaCarreras:any = sessionStorage.getItem('listaCarreras');
    this.arrayCarreras = JSON.parse(listaCarreras);
    
  }

  choose(event:any){
    console.log(this.objRegistro.idTipoIdentificacion)
  }
  valideKey(evt){
                              
    // code is the decimal ASCII representation of the pressed key.
    var code = (evt.which) ? evt.which : evt.keyCode;
    
    if(code==8) { // backspace.
      return true;
    } else if(code>=48 && code<=57) { // is a number.
      return true;
    } else{ // other keys.
      return false;
    }
}



  setIdentificadorRol(){
    var listaRolFiltro = this.arrayRoles.filter((x:any)=>x.id.toString() === this.objRegistro.idRol.toString());
    console.log(listaRolFiltro)
    if(listaRolFiltro.length > 0){
     
      this.identificadorRol = listaRolFiltro[0].identificadorRol;
    }else{
      this.identificadorRol = 0;
    }
  }
  presentarMenuEnviarClave(item:any){
    console.log(item)
    
    Swal.fire({
     title: 'Estás segur@ de enviar la clave a '+item.nombres+'?',
     text: "No podrás revertir esto!",
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     cancelButtonText:'Cancelar',
     confirmButtonText: 'Si, quiero enviar!'
   }).then((result) => {
     if (result.isConfirmed) {
        item.validarEnviarClave = true;
       this.enviarClave(item);
       
     }
   }) 
  }

  enviarClave(item:any){
    this._servicioUsuarios.enviarClaveUsuario(item).subscribe({
      next: (data:any) =>{
        if(data.validar == true){
          item.validarEnviarClave = false;
          this.presentarMensaje("success","Correcto","Clave enviada exitosamente al correo: "+item.correoInstitucional)
        }else{
          item.validarEnviarClave = false;
          this.presentarMensaje("error","Error",data.mensaje)
        }
      } ,
      error: (error) => {
        item.validarEnviarClave = false;
        if(error.status == 0){
          this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
        }else{
          this.presentarMensaje("error","Error","Error interno de la App")
        } 
        
      },
    });
  }

  modificarRolesUsuario(){

      
      var arrayRolesGuardar = this.arrayRoles2.filter((x:any)=>x.checked === true);
      console.log(arrayRolesGuardar)
      var listaRolDocenteFiltro = arrayRolesGuardar.filter((x:any)=>x.identificadorRol === 2);
      if(arrayRolesGuardar.length == 0){
        this.presentarMensaje("error","Error","Selecciona al menos 1 rol")
      }else{
        this.validarLoadingModalRoles = 1;
        this._servicioUsuarios.modificarRolesUsuario(this.idUsuarioSeleccionado,arrayRolesGuardar).subscribe({
          
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            console.log(data)
          // this.arrayModulos = data.listaModulos;
          const indexUsuario = this.arrayUsuarios.findIndex((x:any)=>x.id.toString() === this.idUsuarioSeleccionado.toString());
          if(indexUsuario != -1){
            this.arrayUsuarios[indexUsuario].roles = data.listaRolUsuario;
          }
          this.presentarMensaje("success","Correcto",data.mensaje)
          }else{
            this.presentarMensaje("error","Error",data.mensaje)
          }
          this.validarLoadingModalRoles = 0;
        } ,
        error: (error) => {
          if(error.status == 0){
            this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
          }else{
            this.presentarMensaje("error","Error","Error interno de la App")
          } 
          this.validarLoadingModalRoles = 0;
          
        },
      });
    }
  
  }

  presentarFormularioRoles(item:any){
    console.log(item)
    this.idUsuarioSeleccionado = item.id;
    this.idCarreraRol = item.idCarrera;
    var arrayRolesTemp:any[] = [];
    this.arrayRoles.forEach((res:any)=>{
      var listaRolesFiltro = item.roles.filter((x:any)=>x.id.toString() === res.id.toString());
      var checked = false;
      if(listaRolesFiltro.length > 0){
        checked = true;
        
      }
      
      var obj = {
        ...res,
        checked:checked
      };
     
      arrayRolesTemp.push(obj);
    });
    this.arrayRoles2 = arrayRolesTemp;
  }

  presentarFormularioModificar(item:any){
    this.objModificar.id=item.id;
      this.objModificar.idCarrera=item.idCarrera;
      this.objModificar.cedula = item.cedula;
      this.objModificar.nombres = item.nombres;
      this.objModificar.apellidos = item.apellidos;
      this.objModificar.correo = item.correo;
      this.objModificar.correoInstitucional = item.correoInstitucional;
      this.objModificar.telefono = item.telefono;
  }
  async reCargarUsuarios(){
    
    this._servicioUsuarios.cargarUsuarios().subscribe({
      next: (data:any) =>{
        if(data.validar == true){
          console.log(data)
          this.arrayUsuarios = data.listaUsuarios;
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

 async presentarMenuEliminarUsuario(item:any){
  console.log(item)
  Swal.fire({
   title: 'Estás segur@ de eliminar a '+item.nombres+'?',
   text: "No podrás revertir esto!",
   icon: 'warning',
   showCancelButton: true,
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
   cancelButtonText:'Cancelar',
   confirmButtonText: 'Si, quiero eliminar!'
 }).then((result) => {
   if (result.isConfirmed) {
     this.eliminarUsuario(item);
     
   }
 })  
}

 eliminarUsuario(item:any){
  const indexUsuario = this.arrayUsuarios.findIndex(x=>x.id === item.id);
  if(item.id == ""){
    this.presentarMensaje("error","Error","No se encuentra el usuario")
  }else{
    this._servicioUsuarios.eliminarUsuario(item).subscribe({
      next: (data:any) =>{
        console.log(data)
        if(data.validar == true){
          //this.cargarUsuarios();
          this.arrayUsuarios.splice(indexUsuario, 1);;
          this.presentarMensaje("success","Correcto","Usuario eliminado exitosamente")
          
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
  console.log(this.objRegistro)
}

  async cargarUsuarios(){
 
    this._servicioUsuarios.cargarUsuarios().subscribe({
      next: (data:any) =>{
        
        if(data.validar == true){
          console.log(data)
          this.arrayUsuarios = data.listaUsuarios;
          if(this.arrayUsuarios.length > 0){
            this.dtTrigger.next(this.arrayUsuarios);
          }

        }else{
          this.presentarMensaje("error","Error",data.mensaje)
        }
        this.validarTabla = 'block';
        this.validarLoadingTabla = 'none';
      } ,
      error: (error) => {
        this.validarLoadingTabla = 'none';
        if(error.status == 0){
          this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
        }else{
          this.presentarMensaje("error","Error","Error interno de la App")
        } 
        
      },
    });
 }

 modificarUsuario(){
  const indexUsuario = this.arrayUsuarios.findIndex(x=>x.id === this.objModificar.id);
  if(this.objModificar.id == ""){
    this.presentarMensaje("error","Error","No se encuentra el usuario")
  }else if(indexUsuario === -1){
    this.presentarMensaje("error","Error","No se encuentra el usuario")
  }else if(this.objModificar.cedula == ""){
    this.presentarMensaje("error","Error","Ingresa la cédula o pasaporte")
  }else if(this.objModificar.nombres == ""){
    this.presentarMensaje("error","Error","Ingresa los dos nombres")
  }else  if(this.objModificar.apellidos == ""){
    this.presentarMensaje("error","Error","Ingresa los dos apellidos")
  }else  if(this.objModificar.correoInstitucional == ""){
    this.presentarMensaje("error","Error","Ingresa el correo institucional")
  }else  if(this.objModificar.telefono == ""){
    this.presentarMensaje("error","Error","Ingresa el teléfono")
  }else{
    this.validarLoadingModificar = 1;
    this._servicioUsuarios.modificarUsuario(this.objModificar).subscribe({
      next: (data:any) =>{
        console.log(data)
        if(data.validar == true){
          //this.cargarUsuarios();
          this.arrayUsuarios[indexUsuario].idCarrera = data.objUsuario.idCarrera;
          this.arrayUsuarios[indexUsuario].nombreCarrera = data.objUsuario.nombreCarrera;
          this.arrayUsuarios[indexUsuario].cedula = data.objUsuario.cedula;
          this.arrayUsuarios[indexUsuario].nombres = data.objUsuario.nombres;
          this.arrayUsuarios[indexUsuario].apellidos = data.objUsuario.apellidos;
          this.arrayUsuarios[indexUsuario].correo = data.objUsuario.correo;
          this.arrayUsuarios[indexUsuario].correoInstitucional = data.objUsuario.correoInstitucional;
          this.arrayUsuarios[indexUsuario].telefono = data.objUsuario.telefono;
          this.arrayUsuarios[indexUsuario].telefonoInternacional = data.objUsuario.telefonoInternacional;
          this.presentarMensaje("success","Correcto","Usuario modificado exitosamente")
          this.validarLoadingModificar = 0;
          
        }else{
          this.validarLoadingModificar = 0;
          this.presentarMensaje("error","Error",data.mensaje)
        }
       
      } ,
      error: (error) => {
        this.validarLoadingModificar = 0;
        if(error.status == 0){
          this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
        }else{
          this.presentarMensaje("error","Error","Error interno de la App")
        } 
      },
    });
    
  }
  console.log(this.objRegistro)
}

  guardarUsuario(){
    console.log(this.arrayTipoIdentificacion)
    if(this.objRegistro.idRol == "0"){
      this.presentarMensaje("error","Error","Selecciona un rol")
    }else if(this.objRegistro.idCarrera == "0"){
      this.presentarMensaje("error","Error","Selecciona una carrera")
    }else if(this.objRegistro.cedula == ""){
      this.presentarMensaje("error","Error","Ingresa la cédula o pasaporte")
    }else if(this.objRegistro.nombres == ""){
      this.presentarMensaje("error","Error","Ingresa los dos nombres")
    }else  if(this.objRegistro.apellidos == ""){
      this.presentarMensaje("error","Error","Ingresa los dos apellidos")
    }else  if(this.objRegistro.correoInstitucional == ""){
      this.presentarMensaje("error","Error","Ingresa el correo institucional")
    }else  if(this.objRegistro.telefono == ""){
      this.presentarMensaje("error","Error","Ingresa el teléfono")
    }else{
      this.validarLoading = 1;
      this._servicioUsuarios.guardarUsuario(this.objRegistro).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.reCargarUsuarios();
            this.objRegistro = {
              idRol:"0",
              cedula:"",
              nombres:"",
              apellidos:"",
              correo:"",
              correoInstitucional:"",
              telefono:"",
              telefonoInternacional:"",
              idCarrera:"0"
            };
            if(data.validarEnvioCorreo == false){
              this.presentarMensaje("error","Error",data.mensaje)
            }else{
              this.presentarMensaje("success","Correcto","Usuario guardado exitosamente")
            }
            this.validarLoading = 0;
            
          }else{
            this.validarLoading = 0;
            this.presentarMensaje("error","Error",data.mensaje)
          }
         
        } ,
        error: (error) => {
          this.validarLoading = 0;
          if(error.status == 0){
            this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
          }else{
            this.presentarMensaje("error","Error","Error interno de la App")
          } 
        },
      });
      
    }
    console.log(this.objRegistro)
  }

  async presentarMensaje(tipo:any,titulo:string,mensaje:string){
    Swal.fire(
      titulo,
      mensaje,
      tipo,
    )
   }

}
