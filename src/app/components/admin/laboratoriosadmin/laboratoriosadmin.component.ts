import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subject } from 'rxjs';
import { LaboratoriosService } from 'src/app/servicios/laboratorios.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-laboratoriosadmin',
  templateUrl: './laboratoriosadmin.component.html',
  styleUrls: ['./laboratoriosadmin.component.css']
})
export class LaboratoriosadminComponent implements OnDestroy,OnInit {
  imgChangeEvt: any = '';
  cropImgPreview: any = '';

  mimeType: any;
  base64Image: string;
  blobImage: any;
  validarLoadingFoto:number = 0;
  nombreArchivo: any;
  objLaboratorioFoto: any;



  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
 
  @ViewChild('modalModificar') modalModificar: ElementRef;
  @ViewChild('inputFileFoto') inputFileFoto: ElementRef;
  @ViewChild('modalFoto') modalFoto: ElementRef;
  arrayUnidades:any[] = [];
  arrayLaboratorios:any[] = [];
  arrayUsuarios:any[] = [];
  idUnidad:any = "0";
  idUsuario:any = null;
  nombreLaboratorio:any = "";
  descripcionLaboratorio:any = "";
  validarLoading:number = 0;
  objModificarLaboratorio:any = {
    id:0,
    idUnidad:"0",
    idUsuario:null,
    nombreLaboratorio:"",
    descripcionLaboratorio:"",
    nombreUnidad:"",
    nombreCarrera:"",
    validarLoading:0,
    razonDesactivar:"",
    tipoModificar:1
  };
  validarLoadingTabla:string = 'block';
  validarTabla:string = 'none';
  constructor(
    private _servicioLaboratorio:LaboratoriosService,
    private _servicioUsuarios:UsuariosService
    //private _servicioUnidad:UnidadesService,
  ) { 
    
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType:'full_numbers',
      pageLength:10
    };
   this.cargarLaboratorios();
   this.cargarUsuarios();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  ngAfterContentInit(){
    var listaUnidades:any = sessionStorage.getItem('listaUnidades');
    this.arrayUnidades = JSON.parse(listaUnidades);
  }

  async guardarFotoLaboratorio(){
    const indexLaboratorio = this.arrayLaboratorios.findIndex(x=>x.id === this.objLaboratorioFoto.id);
    if(indexLaboratorio === -1){
      this.presentarMensaje("error","Error","Selecciona laboratorio válido")
    }else if(this.blobImage == null){
      this.presentarMensaje("error","Alerta","Por favor selecciona una foto")
    }else{
      var formData = new FormData();
      formData.append('foto', this.blobImage,this.nombreArchivo);   
      formData.append('idLaboratorio',this.objLaboratorioFoto.id);
      this.validarLoadingFoto = 1;
      this._servicioLaboratorio.guardarFotoLaboratorio(formData).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.imgChangeEvt = '';
            this.cropImgPreview = '';
            this.inputFileFoto.nativeElement.value = '';
            this.modalFoto.nativeElement.click();
            this.arrayLaboratorios[indexLaboratorio].rutaFotoLaboratorio = data.nuevaRutaFoto;
            sessionStorage.setItem('listaLaboratorios',JSON.stringify(this.arrayLaboratorios));
            this.presentarMensaje("success","Correcto","Foto guardada exitosamente")
          }else{
            this.presentarMensaje("error","Error",data.mensaje)
            
          }
          this.validarLoadingFoto = 0;
        } ,
        error: (error) => {
          if(error.status == 0){
            this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
          }else{
            this.presentarMensaje("error","Error","Error interno de la App")
          } 
          this.validarLoadingFoto = 0;
        },
      });
    }
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
  presentarFormularioFoto(item:any){
    console.log(item);
    this.imgChangeEvt = '';
    this.cropImgPreview = '';
    
    this.objLaboratorioFoto = item;
    this.inputFileFoto.nativeElement.value = '';
  }

  

  async presentarFormularioModificar(item:any){
    console.log(item)
    this.objModificarLaboratorio.id = item.id;
    this.objModificarLaboratorio.idUnidad = item.idUnidad;
    this.objModificarLaboratorio.idUsuario = item.idUsuario;
    this.objModificarLaboratorio.nombreLaboratorio = item.nombreLaboratorio;
    this.objModificarLaboratorio.descripcionLaboratorio = item.descripcionLaboratorio;
    this.objModificarLaboratorio.nombreCarrera = item.nombreCarrera;
    this.objModificarLaboratorio.nombreUnidad = item.nombreUnidad;
    this.objModificarLaboratorio.activo = item.activo;
    this.objModificarLaboratorio.tipoModificar = 1;
  }

  eliminarLaboratorio(item:any){
    
    const indexLaboratorio = this.arrayLaboratorios.findIndex(x=>x.id === item.id);
    if(indexLaboratorio === -1){
      this.presentarMensaje("error","Error","Selecciona un laboratorio válido")
    }else{
      this._servicioLaboratorio.eliminarLaboratorio(item).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
        
            this.arrayLaboratorios.splice(indexLaboratorio, 1);
            sessionStorage.setItem('listaLaboratorios',JSON.stringify(this.arrayLaboratorios));
            this.presentarMensaje("success","Correcto",item.nombreLaboratorio+" eliminado exitosamente")
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
  modificarLaboratorio(){
    
    const indexLaboratorio = this.arrayLaboratorios.findIndex(x=>x.id === this.objModificarLaboratorio.id);
    if(indexLaboratorio === -1){
      this.presentarMensaje("error","Error","Selecciona una unidad válida")
    }else if(this.objModificarLaboratorio.idUnidad == "0"){
      this.presentarMensaje("error","Error","Selecciona una carrera")
    }else if(this.objModificarLaboratorio.idUsuario == null || this.objModificarLaboratorio.idUsuario == "" || this.objModificarLaboratorio.idUsuario == "0"){
      this.presentarMensaje("error","Error","Selecciona un responsable")
    }else if(this.objModificarLaboratorio.nombreLaboratorio == ""){
      this.presentarMensaje("error","Error","Ingresa el nombre de la unidad")
    }else if(this.objModificarLaboratorio.descripcionLaboratorio == ""){
      this.presentarMensaje("error","Error","Ingrese una descripción de la unidad")
    }else{
      if(this.objModificarLaboratorio.tipoModificar == 2){
        Swal.fire({
          title: 'Por favor espera!',
          html: 'Enviando correo a los usuarios que tenían <b>reservaciones</b>.',
          didOpen: () => {
            Swal.showLoading();
           
          },
        });
      }
      this.objModificarLaboratorio.validarLoading = 1;
      this._servicioLaboratorio.modificarLaboratorio(this.objModificarLaboratorio).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            if(this.objModificarLaboratorio.tipoModificar == 1){
              this.modalModificar.nativeElement.click();
            }
            if(this.objModificarLaboratorio.tipoModificar == 2){
              Swal.close();
            }
            this.arrayLaboratorios[indexLaboratorio] = data.objLaboratorio;
            sessionStorage.setItem('listaLaboratorios',JSON.stringify(this.arrayLaboratorios));
            this.presentarMensaje("success","Correcto","Laboratorio modificado exitosamente")
          }else{
            if(this.objModificarLaboratorio.tipoModificar == 2){
              Swal.close();
            }
            this.presentarMensaje("error","Error",data.mensaje)
            
          }
          this.objModificarLaboratorio.validarLoading = 0;
        } ,
        error: (error) => {
          if(this.objModificarLaboratorio.tipoModificar == 2){
            Swal.close();
          }
          this.objModificarLaboratorio.validarLoading = 0;
          if(error.status == 0){
            this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
          }else{
            this.presentarMensaje("error","Error","Error interno de la App")
          } 
        },
      });
      
    } 
  }
  async presentarMenuModificar(item:any){
    console.log(item)
   var activo = true;
    var texto = "activar";
    var texto2 = "El laboratorio aparecerá como disponible!";
    if(item.activo == true){
      activo = false;
      texto = "desactivar";
      var texto2 = "El laboratorio no aparecerá como disponible!\nEscribe un motivo";
    }
    Swal.fire({
    title: 'Estás segur@ de '+texto+' '+item.nombreLaboratorio+'?',
    input: 'text',
    
    inputAttributes: {
      autocapitalize: 'off',
    },
     text: texto2,
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     cancelButtonText:'Cancelar',
     confirmButtonText: 'Si, quiero '+texto+'!' 
   }).then((result) => {
    console.log(result);
      if (result.isConfirmed) {
        var razonDesactivar = "";
        if(item.activo == true && result.value == ""){
          this.presentarMensaje("error","Error","Escribe un motivo de la desactivación del laboratorio")
        }else{
          if(item.activo == true){
            razonDesactivar = result.value;
          }
          
          this.objModificarLaboratorio.id = item.id;
          this.objModificarLaboratorio.idUnidad = item.idUnidad;
          this.objModificarLaboratorio.idUsuario = item.idUsuario;
          this.objModificarLaboratorio.nombreLaboratorio = item.nombreLaboratorio;
          this.objModificarLaboratorio.descripcionLaboratorio = item.descripcionLaboratorio;
          this.objModificarLaboratorio.nombreCarrera = item.nombreCarrera;
          this.objModificarLaboratorio.nombreUnidad = item.nombreUnidad;
          this.objModificarLaboratorio.activo = activo;
          this.objModificarLaboratorio.razonDesactivar = razonDesactivar;
          this.objModificarLaboratorio.tipoModificar = 2;
        
          this.modificarLaboratorio();
        }
       
     } 
   })  
 }

  async presentarMenuEliminarLaboratorio(item:any){
     Swal.fire({
      title: 'Estás segur@ de eliminar '+item.nombreLaboratorio+'?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Si, quiero eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarLaboratorio(item);
        
      }
    })  
  }

  async cargarUsuarios(){
    
 
    this._servicioUsuarios.cargarUsuarios().subscribe({
      next: (data:any) =>{
        console.log(data)
        if(data.validar == true){
          /* var arrayUsuariosTemp = [];
          data.listaUsuarios.forEach((res:any) => {
            var fullName = res.apellidos +' '+ res.nombres;
            console.log(fullName)
            var obj = {
              ...res,
              fullName:fullName
            };
            arrayUsuariosTemp.push(obj);
          });
          var arrayUsuarios = arrayUsuariosTemp; */



          var arrayUsuarios = data.listaUsuarios;
          var arrayUsuariosTemp = [];
          arrayUsuarios.forEach((res:any) => {
            
            const indexUsuario = arrayUsuarios.findIndex((x:any)=>x.id === res.id);
            if(indexUsuario != -1){
              var arrayUsuariosFiltro = arrayUsuarios[indexUsuario].roles.filter((x:any)=>x.identificadorRol === 3);
              if(arrayUsuariosFiltro.length > 0){
                var fullName = res.apellidos +' '+ res.nombres;
                console.log(fullName)
                var obj = {
                  ...arrayUsuarios[indexUsuario],
                  fullName:fullName
                };
                arrayUsuariosTemp.push(obj);
                //this.arrayUsuarios.push(arrayUsuarios[indexUsuario]);
              }
            }
          });
          this.arrayUsuarios = arrayUsuariosTemp;
          console.log(this.arrayUsuarios);
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


  async cargarLaboratorios(){
    
    
    this._servicioLaboratorio.cargarLaboratorios().subscribe({
      next: (data:any) =>{
        if(data.validar == true){
          this.arrayLaboratorios = data.listaLaboratorios;
          if(this.arrayLaboratorios.length > 0){
            this.dtTrigger.next(this.arrayLaboratorios);
          }
          
          sessionStorage.setItem('listaLaboratorios',JSON.stringify(this.arrayLaboratorios));
        }else{
          this.presentarMensaje("error","Error",data.mensaje)
        }
        this.validarLoadingTabla = 'none';
        this.validarTabla = 'block';
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

  async guardarLaboratorio(){
    
    if(this.idUnidad == "0"){
      this.presentarMensaje("error","Error","Selecciona una unidad")
    }else if(this.idUsuario == "0"){
      this.presentarMensaje("error","Error","Selecciona un responsable")
    }else if(this.nombreLaboratorio == ""){
      this.presentarMensaje("error","Error","Ingresa el nombre del laboratorio")
    }else if(this.descripcionLaboratorio == ""){
      this.presentarMensaje("error","Error","Ingrese una descripción del laboratorio")
    }else{
      this.validarLoading = 1;
      this._servicioLaboratorio.guardarLaboratorio(this.idUnidad,this.idUsuario,this.nombreLaboratorio,this.descripcionLaboratorio).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.arrayLaboratorios.unshift(data.objLaboratorio);
            if(this.arrayLaboratorios.length == 1){
              this.dtTrigger.next(this.arrayLaboratorios);
            }
            sessionStorage.setItem('listaLaboratorios',JSON.stringify(this.arrayLaboratorios));
      
            this.validarLoading = 0;
            this.idUsuario = "0";
            this.nombreLaboratorio ="";
            this.descripcionLaboratorio = "";
            this.presentarMensaje("success","Correcto","Laboratorio guardado exitosamente")
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

 async presentarMensaje(tipo:any,titulo:string,mensaje:string){
  Swal.fire(
    titulo,
    mensaje,
    tipo,
  )
 }


}
