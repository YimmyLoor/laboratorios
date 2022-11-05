import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UnidadesService } from 'src/app/servicios/unidades.service';
import Swal from 'sweetalert2';
import { DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import  {ImageCroppedEvent}  from 'ngx-image-cropper';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-unidadesadmin',
  templateUrl: './unidadesadmin.component.html',
  styleUrls: ['./unidadesadmin.component.css']
})
export class UnidadesadminComponent implements OnDestroy, OnInit {

  imgChangeEvt: any = '';
  cropImgPreview: any = '';

  idRelacionAscpecto:any ="1";
  alto:any = 1;
  ancho:any = 1;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  @ViewChild('modalModificar') modalModificar: ElementRef;
  @ViewChild('modalLogo') modalLogo: ElementRef;
  @ViewChild('inputFileLogo') inputFileLogo: ElementRef;
  arrayCarreras:any[] = [];
  arrayUnidades:any[] = [];
  arrayUsuarios:any[] = [];
  idUsuario:any;
  idCarrera:any = "0";
  nombreUnidad:any = "";
  descripcionUnidad:any = "";
  validarLoading:number = 0;
  objModificarUnidad:any = {
    id:0,
    idUsuario:null,
    idCarrera:"0",
    nombreUnidad:"",
    descripcionUnidad:"",
    nombreCarrera:""
  };
  mimeType: any;
  base64Image: string;
  blobImage: any;
  validarLoadingLogo:number = 0;
  nombreArchivo: any;
  objUnidadLogo: any;
  arrayRedesSociales: any[] = [];
  arrayRedesSocialesView:any = [];
  objRedSocial:any = {
    id:"0",
    idUnidad:"0",
    urlRedSocial:"",
    validarLoadingLogo:0
  };

  validarLoadingTabla:string = 'block';
  validarTabla:string = 'none';
  constructor(
    private _servicioUnidad:UnidadesService,
    private _servicioUsuarios:UsuariosService
  ) { 
    
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType:'full_numbers',
      pageLength:10
    };
   this.cargarUnidades();
   this.cargarUsuarios();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  ngAfterContentInit(){
    var listaCarreras:any = sessionStorage.getItem('listaCarreras');
    this.arrayCarreras = JSON.parse(listaCarreras);
  }
  presentarMenuEliminarRedSocial(item:any,itemRedSocial:any){
    Swal.fire({
      title: 'Estás segur@ de eliminar la red social '+itemRedSocial.nombreRedSocial+'?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Si, quiero eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarRedSocialUnidad(item,itemRedSocial);
        
      }
    }) 
  }
  eliminarRedSocialUnidad(item:any,itemRedSocial:any){
    
    const indexUnidad = this.arrayUnidades.findIndex(x=>x.id === item.id);
    if(indexUnidad === -1){
      this.presentarMensaje("error","Error","Selecciona una unidad válida")
    }else{
      this._servicioUnidad.eliminarRedSocialUnidad(itemRedSocial).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.arrayUnidades[indexUnidad] = data.objUnidad;
            sessionStorage.setItem('listaUnidades',JSON.stringify(this.arrayUnidades));
            this.cargarRedesFormulario(data.objUnidad);
            this.presentarMensaje("success","Correcto","Eliminada exitosamente");
            
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

  presentarFormularioRedSocial(item:any){
    this.cargarRedesFormulario(item);
  }
  cargarRedesFormulario(item:any){

    this.arrayRedesSocialesView = [];
    this.objRedSocial.idUnidad = item.id;
    this.arrayRedesSociales.forEach((res:any)=>{
      var listaRedesFiltro = item.listaRedSocialUnidad.filter((x:any)=>x.id === res.id);
      if(listaRedesFiltro.length == 0){
        var obj = {
          idRedSocialUnidad:0,
          agregada:'block',
          ...res
        };
        this.arrayRedesSocialesView.push(obj);
      }else{
        var obj = {
          idRedSocialUnidad:listaRedesFiltro[0].id,
          agregada:'none',
          ...res
        };
        this.arrayRedesSocialesView.push(obj);
      }
    });
  }
  guardarRedSocial(){
    console.log(this.objRedSocial)
    const indexUnidad = this.arrayUnidades.findIndex(x=>x.id === this.objRedSocial.idUnidad);
    
    if(indexUnidad === -1){
      this.presentarMensaje("error","Error","Selecciona una unidad");
    }else if(this.objRedSocial.id == "0"){
      this.presentarMensaje("error","Error","Selecciona una red social");
    }else if(this.objRedSocial.idUnidad == "0"){
      this.presentarMensaje("error","Error","Selecciona una unidad");
    }else if(this.objRedSocial.urlRedSocial == ""){
      this.presentarMensaje("error","Error","Ingrese la url de la red social");
    }else{
      this.objRedSocial.validarLoadingLogo = 1;
      this._servicioUnidad.guardarRedSocialUnidad(this.objRedSocial).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.objRedSocial.id = "0";
            this.objRedSocial.urlRedSocial = "";
            this.arrayUnidades[indexUnidad] = data.objUnidad;
            sessionStorage.setItem('listaUnidades',JSON.stringify(this.arrayUnidades));
            this.cargarRedesFormulario(data.objUnidad);
            this.presentarMensaje("success","Correcto","Guardada exitosamente");
            
          }else{
            this.presentarMensaje("error","Error",data.mensaje)
            
          }
          this.objRedSocial.validarLoadingLogo = 0;
        } ,
        error: (error) => {
          this.objRedSocial.validarLoadingLogo = 0;
          if(error.status == 0){
            this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
          }else{
            this.presentarMensaje("error","Error","Error interno de la App")
          } 
        },
      });
    }
    //console.log(this.objRedSocial)
  }


  cambiarRelacionAspecto(){
    if(this.idRelacionAscpecto == "1"){
      this.alto = 1;
      this.ancho = 1;
    }else if(this.idRelacionAscpecto == "2"){
      this.alto = 3;
      this.ancho = 4;
    }else if(this.idRelacionAscpecto == "3"){
      this.alto = 1;
      this.ancho = 3;
    }else  if(this.idRelacionAscpecto == "4"){
      this.alto = 1;
      this.ancho = 4;
    }else {
      this.alto = 1;
      this.ancho = 1;
    }
  }

  async guardarLogoUnidad(){
    const indexUnidad = this.arrayUnidades.findIndex(x=>x.id === this.objUnidadLogo.id);
    if(indexUnidad === -1){
      this.presentarMensaje("error","Error","Selecciona una unidad válida")
    }else if(this.blobImage == null){
      this.presentarMensaje("error","Alerta","Por favor selecciona una foto")
    }else{
      var formData = new FormData();
      formData.append('fotoLogo', this.blobImage,this.nombreArchivo);   
      formData.append('idUnidad',this.objUnidadLogo.id);
      this.validarLoadingLogo = 1;
      this._servicioUnidad.guardarLogoUnidad(formData).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.imgChangeEvt = '';
            this.cropImgPreview = '';
            this.inputFileLogo.nativeElement.value = '';
            this.modalLogo.nativeElement.click();
            this.arrayUnidades[indexUnidad].rutaLogo = data.nuevaRutaLogo;
            sessionStorage.setItem('listaUnidades',JSON.stringify(this.arrayUnidades));
            this.presentarMensaje("success","Correcto","Logo guardado exitosamente")
          }else{
            this.presentarMensaje("error","Error",data.mensaje)
            
          }
          this.validarLoadingLogo = 0;
        } ,
        error: (error) => {
          if(error.status == 0){
            this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
          }else{
            this.presentarMensaje("error","Error","Error interno de la App")
          } 
          this.validarLoadingLogo = 0;
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




  presentarFormularioLogo(item:any){
    console.log(item);
    this.imgChangeEvt = '';
    this.cropImgPreview = '';
    
    this.objUnidadLogo = item;
    this.inputFileLogo.nativeElement.value = '';
  }

  async presentarFormularioModificar(item:any){
    console.log(item)
    this.objModificarUnidad.id = item.id;
    this.objModificarUnidad.idUsuario = item.idUsuario;
    this.objModificarUnidad.idCarrera = item.idCarrera;
    this.objModificarUnidad.nombreUnidad = item.nombreUnidad;
    this.objModificarUnidad.descripcionUnidad = item.descripcionUnidad;
    this.objModificarUnidad.nombreCarrera = item.nombreCarrera;
  }

  eliminarUnidad(item:any){
    
    const indexUnidad = this.arrayUnidades.findIndex(x=>x.id === item.id);
    if(indexUnidad === -1){
      this.presentarMensaje("error","Error","Selecciona una unidad válida")
    }else{
      this._servicioUnidad.eliminarUnidad(item).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
        
            this.arrayUnidades.splice(indexUnidad, 1);
            sessionStorage.setItem('listaUnidades',JSON.stringify(this.arrayUnidades));
            this.presentarMensaje("success","Correcto",item.nombreUnidad+" eliminada exitosamente")
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
  modificarUnidad(){
    
    const indexUnidad = this.arrayUnidades.findIndex(x=>x.id === this.objModificarUnidad.id);
    if(indexUnidad === -1){
      this.presentarMensaje("error","Error","Selecciona una unidad válida")
    }else if(this.objModificarUnidad.idUsuario == null || this.objModificarUnidad.idUsuario == "" || this.objModificarUnidad.idUsuario == "0"){
      this.presentarMensaje("error","Error","Selecciona un usuario")
    }else if(this.objModificarUnidad.idCarrera == "0"){
      this.presentarMensaje("error","Error","Selecciona una carrera")
    }else if(this.objModificarUnidad.nombreUnidad == ""){
      this.presentarMensaje("error","Error","Ingresa el nombre de la unidad")
    }else if(this.objModificarUnidad.descripcionUnidad == ""){
      this.presentarMensaje("error","Error","Ingrese una descripción de la unidad")
    }else{
      this._servicioUnidad.modificarUnidad(this.objModificarUnidad).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.modalModificar.nativeElement.click();
            this.arrayUnidades[indexUnidad] = data.objUnidad;
            sessionStorage.setItem('listaUnidades',JSON.stringify(this.arrayUnidades));
            this.presentarMensaje("success","Correcto","Unidad modificada exitosamente")
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

  async presentarMenuEliminarUnidad(item:any){
     Swal.fire({
      title: 'Estás segur@ de eliminar '+item.nombreUnidad+'?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Si, quiero eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarUnidad(item);
        
      }
    }) 
  }
  async cargarUnidades(){
    
   
    this._servicioUnidad.cargarUnidades().subscribe({
      next: (data:any) =>{
        if(data.validar == true){
          console.log(data)
          this.arrayRedesSociales = data.listaRedesSociales;
          this.arrayUnidades = data.listaUnidades;
          if(this.arrayUnidades.length > 0){
            this.dtTrigger.next(this.arrayUnidades);
          }
          
          sessionStorage.setItem('listaUnidades',JSON.stringify(this.arrayUnidades));
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

  async guardarUnidad(){
    
    if(this.idUsuario == null || this.idUsuario == "" || this.idUsuario == "0"){
      this.presentarMensaje("error","Error","Selecciona un responsable")
    }else if(this.idCarrera == "0"){
      this.presentarMensaje("error","Error","Selecciona una carrera")
    }else if(this.nombreUnidad == ""){
      this.presentarMensaje("error","Error","Ingresa el nombre de la unidad")
    }else if(this.descripcionUnidad == ""){
      this.presentarMensaje("error","Error","Ingrese una descripción de la unidad")
    }else{
      this.validarLoading = 1;
      this._servicioUnidad.guardarUnidad(this.idUsuario,this.idCarrera,this.nombreUnidad,this.descripcionUnidad).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.arrayUnidades.unshift(data.objUnidad);
            if(this.arrayUnidades.length == 1){
              this.dtTrigger.next(this.arrayUnidades);
            }
            sessionStorage.setItem('listaUnidades',JSON.stringify(this.arrayUnidades));
  
            this.validarLoading = 0;
            this.idUsuario = "0";
            this.idCarrera = "0";
            this.nombreUnidad ="";
            this.descripcionUnidad = "";
            this.presentarMensaje("success","Correcto","Unidad guardada exitosamente")
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

 async cargarUsuarios(){
    
 
  this._servicioUsuarios.cargarUsuarios().subscribe({
    next: (data:any) =>{
      console.log(data)
      if(data.validar == true){
     //   this.arrayUsuarios = data.listaUsuarios;
      var arrayUsuariosTemp = [];
        data.listaUsuarios.forEach((res:any) => {
          var fullName = res.apellidos +' '+ res.nombres;
          console.log(fullName)
          var obj = {
            ...res,
            fullName:fullName
          };
          arrayUsuariosTemp.push(obj);
        });
        this.arrayUsuarios = arrayUsuariosTemp;
        this.arrayUsuarios.sort((a, b) => {
          let fa = a.fullName.toLowerCase(),
              fb = b.fullName.toLowerCase();
      
          if (fa < fb) {
              return -1;
          }
          if (fa > fb) {
              return 1;
          }
          return 0;
        });
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

 async presentarMensaje(tipo:any,titulo:string,mensaje:string){
  Swal.fire(
    titulo,
    mensaje,
    tipo,
  )
 }

}
