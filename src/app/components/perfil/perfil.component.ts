import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal from 'sweetalert2';
import { InicioComponent } from '../inicio/inicio.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  objUsuario: any;
  @ViewChild('modalCambiarFoto') modalCambiarFoto: ElementRef;
  @ViewChild('modalCambiarClave') modalCambiarClave: ElementRef;
  @ViewChild('inputFileFotoPerfil') inputFileFotoPerfil: ElementRef;
  mimeType: any;
  base64Image: string;
  blobImage: any;
  validarLoadingFotoPerfil:number = 0;
  nombreArchivo: any;
  imgChangeEvt: any = '';
  cropImgPreview: any = '';

  objCambiarClave:any = {
    claveActual:"",
    nuevaClave:"",
    repetirNuevaClave:""
  };
  validarLoadingClave:any = 0;
  constructor(
    private _servicioUsuarios:UsuariosService,
    private _inicioComponent:InicioComponent
  ) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
  }

  ngOnInit(): void {
  }

  modificarClave(){
    if(this.objCambiarClave.claveActual == ""){
      this.presentarMensaje("error","Error","Ingrese su contraseña actual");
    }else if(this.objCambiarClave.nuevaClave == "" || this.objCambiarClave.nuevaClave.length < 8){
      this.presentarMensaje("error","Error","La nueva contraseña debe tener al menos 8 caracteres");
    }else if(this.objCambiarClave.nuevaClave != this.objCambiarClave.repetirNuevaClave){
      this.presentarMensaje("error","Error","Las contraseñas no coinciden");
    }else{
      this.validarLoadingClave = 1;
      this._servicioUsuarios.cambiarClave(this.objCambiarClave).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.objCambiarClave.claveActual = '';
            this.objCambiarClave.nuevaClave = '';
            this.objCambiarClave.repetirNuevaClave = '';
            this.modalCambiarClave.nativeElement.click();
            this.presentarMensaje("success","Correcto","Contraseña guardada exitosamente")
            
          }else{
            this.presentarMensaje("error","Error",data.mensaje)
            
          }
          this.validarLoadingClave = 0;
        } ,
        error: (error) => {
          if(error.status == 0){
            this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
          }else{
            this.presentarMensaje("error","Error","Error interno de la App")
          } 
          this.validarLoadingClave = 0;
        },
      });
    }
  }

  guardarFotoPerfil(){
    if(this.blobImage == null){
      this.presentarMensaje("error","Alerta","Por favor selecciona una foto")
    }else{
      var formData = new FormData();
      formData.append('fotoPerfil', this.blobImage,this.nombreArchivo);   
      formData.append('idUsuario',this.objUsuario.id);
      this.validarLoadingFotoPerfil = 1;
      this._servicioUsuarios.guardarFotoPerfil(formData).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.imgChangeEvt = '';
            this.cropImgPreview = '';
            this.inputFileFotoPerfil.nativeElement.value = '';
            this.modalCambiarFoto.nativeElement.click();
            this.objUsuario.rutaFoto = data.nuevaRutaFoto;
            this._inicioComponent.objUsuario.rutaFoto = data.nuevaRutaFoto;
            sessionStorage.setItem('objUsuario',JSON.stringify(this.objUsuario));
            this.presentarMensaje("success","Correcto","Foto guardada exitosamente")
            
          }else{
            this.presentarMensaje("error","Error",data.mensaje)
            
          }
          this.validarLoadingFotoPerfil = 0;
        } ,
        error: (error) => {
          if(error.status == 0){
            this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
          }else{
            this.presentarMensaje("error","Error","Error interno de la App")
          } 
          this.validarLoadingFotoPerfil = 0;
        },
      });
    }
  }

  limpiarFormulario(){
    this.imgChangeEvt = '';
    this.cropImgPreview = '';
    this.inputFileFotoPerfil.nativeElement.value = '';
  }

  onFileChange(event: any): void {

    this.imgChangeEvt = event;
    var file = event.target.files[0];
    console.log(file)
    this.mimeType = file.type;
    this.nombreArchivo = file.name;
    
    
  }
    
  cropImg(e: ImageCroppedEvent)  {
    this.cropImgPreview = e.base64;
  
    this.base64Image  = this.cropImgPreview.replace(/^data:image\/[a-z]+;base64,/, "");
   // console.log(this.base64Image)
    this.blobImage =  this.base64toBlob(this.base64Image,`${this.mimeType}`);
    console.log(this.blobImage);
  }

  base64toBlob(b64Data:any,contentType = '',sliceSize = 512){
    const byteCharacters  = atob(b64Data);
    const byteArrays = [];
    for(let offset = 0; offset < byteCharacters.length; offset += sliceSize){
      const slice = byteCharacters.slice(offset,offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for(let i = 0; i < slice.length; i++){
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray); 
    }
    const blob = new Blob(byteArrays,{type:contentType});
    return blob;
  }

  
  imgLoad() {

  }
        
    

  initCropper() {

  }
      
  
  
  imgFailed() {

  }

  async presentarMensaje(tipo:any,titulo:string,mensaje:string){
    Swal.fire(
      titulo,
      mensaje,
      tipo,
    )
   }
}
