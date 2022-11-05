import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subject } from 'rxjs';
import { BannerService } from 'src/app/servicios/banner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-banneradmin',
  templateUrl: './banneradmin.component.html',
  styleUrls: ['./banneradmin.component.css']
})
export class BanneradminComponent implements OnInit {
  @ViewChild('inputFileBanner') inputFileBanner: ElementRef;



  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  mimeType: any;
  base64Image: string;
  blobImage: any;
  nombreArchivo: any;
  linkBanner:string = "";
  validarLoading:any = 0;

  arrayBanners:any[] = [];
  rutaBannerSeleccionado:string = "";

  validarLoadingTabla:string = 'block';
  validarTabla:string = 'none';
  constructor(
    private _serivicioBanner:BannerService
  ) { }

  ngOnInit(): void {
   this.cargarBanners();
  }
  eliminarBanner(item:any){
    
    const indexBanner = this.arrayBanners.findIndex(x=>x.id === item.id);
    if(indexBanner === -1){
      this.presentarMensaje("error","Error","Selecciona un banner válido")
    }else{
      this._serivicioBanner.eliminarBanner(item).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
        
            this.arrayBanners.splice(indexBanner, 1);
            this.presentarMensaje("success","Correcto","Banner eliminado exitosamente")
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


  async presentarMenuEliminarBanner(item:any){
      Swal.fire({
       title: 'Estás segur@ de eliminar el banner?',
       text: "No podrás revertir esto!",
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       cancelButtonText:'Cancelar',
       confirmButtonText: 'Si, quiero eliminar!'
     }).then((result) => {
       if (result.isConfirmed) {
         this.eliminarBanner(item);
         
       }
     }) 
   
  }



  verBanner(item:any){
    this.rutaBannerSeleccionado = item.rutaBanner;
  }

  async cargarBanners(){
    

    this._serivicioBanner.cargarBanners().subscribe({
      next: (data:any) =>{
        if(data.validar == true){
          this.arrayBanners = data.listaBanners;
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

  guardarBanner(){
    if(this.blobImage == null){
      this.presentarMensaje("error","Alerta","Por favor selecciona una foto")
    }else{
      var formData = new FormData();
      formData.append('fotoBanner', this.blobImage,this.nombreArchivo);   
      formData.append('link',this.linkBanner);
      this.validarLoading = 1;
      this._serivicioBanner.guardarBanner(formData).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.imgChangeEvt = '';
            this.cropImgPreview = '';
            this.inputFileBanner.nativeElement.value = '';
            this.linkBanner = '';
           
            this.cargarBanners();
            this.presentarMensaje("success","Correcto","Banner guardado exitosamente")
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
