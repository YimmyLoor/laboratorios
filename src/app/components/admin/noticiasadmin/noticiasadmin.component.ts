import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CKEditorComponent } from 'ng2-ckeditor';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NoticiasService } from 'src/app/servicios/noticias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-noticiasadmin',
  templateUrl: './noticiasadmin.component.html',
  styleUrls: ['./noticiasadmin.component.css']
})
export class NoticiasadminComponent implements OnInit {

/*   ckeditorContent:any = '';
  tituloNoticia:any = '';
  resumenNoticia:any = ''; */
  @ViewChild(CKEditorComponent) ckEditor:CKEditorComponent;


  @ViewChild('inputFileFoto') inputFileFoto: ElementRef;
/*   mimeType: any;
  base64Image: string;
  blobImage: any;
  validarLoading:number = 0;
  nombreArchivo: any;
  imgChangeEvt: any = '';
  cropImgPreview: any = ''; */

  objNoticia:any = {
    id:0,
    ckeditorContent:'',
    tituloNoticia:'',
    resumenNoticia:'',
    mimeType:'',
    base64Image:'',
    blobImage:null,
    validarLoading:0,
    nombreArchivo:'',
    imgChangeEvt:'',
    cropImgPreview:''

  };
  
  arrayNoticias:any[] = [];
  validarLoadingTabla:string = 'block';
  validarTabla:string = 'none';
  constructor(
    private _servicioNoticias:NoticiasService
  ) { }

  ngOnInit(): void {

    this.cargarNoticias();
  }
  ngAfterViewChecked(){
    let editor = this.ckEditor.instance;
    editor.config.height = "400";
  
   //editor.config.toolbarGroups = [];

    editor.config.removeButtons = 'Source,Save,NewPage,DocProps,Print';
  }
  cancelarModificar(){
    this.objNoticia.id = 0;
    this.objNoticia.tituloNoticia = "";
    this.objNoticia.ckeditorContent = "";
    this.objNoticia.resumenNoticia = "";
    this.objNoticia.cropImgPreview = "";
  }
  cargarFormularioModificar(item:any){
    this.objNoticia.id = item.id;
    this.objNoticia.tituloNoticia = item.tituloNoticia;
    this.objNoticia.ckeditorContent = item.contenidoNoticia;
    this.objNoticia.resumenNoticia = item.resumenNoticia;
    this.objNoticia.cropImgPreview = item.rutaFotoNoticia;
/*     objNoticia:any =  {
      id:0,
      ckeditorContent:'',
      tituloNoticia:'',
      resumenNoticia:'',
      mimeType:'',
      base64Image:'',
      blobImage:null,
      validarLoading:0,
      nombreArchivo:'',
      imgChangeEvt:'',
      cropImgPreview:''
  
    }; */
  }

  async presentarMenuEliminar(item:any){
    Swal.fire({
      title: 'Estás segur@ de eliminar '+item.tituloNoticia+'?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Si, quiero eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarNoticia(item);
        
      }
    }) 

  }
  async eliminarNoticia(item:any){
    const indexNoticia = this.arrayNoticias.findIndex(x=>x.id === item.id);
    if(indexNoticia === -1){
      this.presentarMensaje("error","Error","Selecciona una noticia válida")
    }else{
      this._servicioNoticias.eliminarNoticia(item).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
        
            this.arrayNoticias.splice(indexNoticia, 1);
            this.presentarMensaje("success","Correcto",item.tituloNoticia+" eliminada exitosamente")
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
  async cargarNoticias(){
    

    this._servicioNoticias.cargarNoticias().subscribe({
      next: (data:any) =>{
        if(data.validar == true){
          this.arrayNoticias = data.listaNoticias;
          console.log(this.arrayNoticias)
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
 modificarNoticia(){

 }
  guardarNoticia(){
    if(this.objNoticia.tituloNoticia == ''){
      this.presentarMensaje("error","Alerta","Ingresa el título de la noticia");
    }else if(this.objNoticia.resumenNoticia == ''){
      this.presentarMensaje("error","Alerta","Ingresa el resumen de la noticia");
    }else if(this.objNoticia.id == 0 && this.objNoticia.blobImage == null){
      this.presentarMensaje("error","Alerta","Por favor selecciona una foto")
    }else if(this.objNoticia.ckeditorContent == ''){
      this.presentarMensaje("error","Alerta","Ingresa el contenido de la noticia");
    }else {
      var formData = new FormData();
      formData.append('idNoticia',this.objNoticia.id);
      if(this.objNoticia.blobImage != null){
        formData.append('fotoNoticia', this.objNoticia.blobImage,this.objNoticia.nombreArchivo); 
      }
       
      formData.append('tituloNoticia',this.objNoticia.tituloNoticia);
      formData.append('resumenNoticia',this.objNoticia.resumenNoticia);
      formData.append('contenidoNoticia',this.objNoticia.ckeditorContent);
      this.objNoticia.validarLoading = 1;
      this._servicioNoticias.guardarNoticia(formData).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.limpiarFormulario();
            this.cargarNoticias();
            this.presentarMensaje("success","Correcto","Guardado exitosamente")
          }else{
            this.presentarMensaje("error","Error",data.mensaje)
            
          }
          this.objNoticia.validarLoading = 0;
        } ,
        error: (error) => {
          if(error.status == 0){
            this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
          }else{
            this.presentarMensaje("error","Error","Error interno de la App")
          } 
          this.objNoticia.validarLoading = 0;
        },
      });
    }
  }

  limpiarFormulario(){
    this.objNoticia.id = 0;
    this.objNoticia.imgChangeEvt = '';
    this.objNoticia.cropImgPreview = '';
    this.objNoticia.tituloNoticia = '';
    this.objNoticia.resumenNoticia = '';
    this.objNoticia.ckeditorContent = '';
    this.inputFileFoto.nativeElement.value = '';
  }

  onFileChange(event: any): void {

    this.objNoticia.imgChangeEvt = event;
    var file = event.target.files[0];
    console.log(file)
    this.objNoticia.mimeType = file.type;
    this.objNoticia.nombreArchivo = file.name;
    
    
  }
    
  cropImg(e: ImageCroppedEvent)  {
    this.objNoticia.cropImgPreview = e.base64;
  
    this.objNoticia.base64Image  = this.objNoticia.cropImgPreview.replace(/^data:image\/[a-z]+;base64,/, "");
   // console.log(this.base64Image)
    this.objNoticia.blobImage =  this.base64toBlob(this.objNoticia.base64Image,`${this.objNoticia.mimeType}`);
    console.log(this.objNoticia.blobImage);
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
