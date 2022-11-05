import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { LaboratoriosService } from 'src/app/servicios/laboratorios.service';
import { MaterialesService } from 'src/app/servicios/materiales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-materialesencargado',
  templateUrl: './materialesencargado.component.html',
  styleUrls: ['./materialesencargado.component.css']
})
export class MaterialesencargadoComponent implements OnInit {

  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('inputFileModificar') inputFileModificar: ElementRef;
  objUsuario: any;
  arrayLaboratorios:any[] = [];
  arrayMateriales:any[] = [];
  idLaboratorio:any = "0";
  nombreMaterial:any = "";
  descripcionMaterial:any = "";
  stockMaterial:any = 0;

  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  mimeType: any;
  base64Image: string;
  blobImage: any;
  nombreArchivo: any;
  validarLoading:any = 0;

  
  objCondicion:any = {
    id:0,
    stock:0,
    arrayCondicion:[],
  };

  objModificar:any = {
    id:0,
    idLaboratorio:0,
    nombreMaterial:"",
    descripcionMaterial:"",
    imgChangeEvt:'',
    cropImgPreview:'',
    mimeType:'',
    base64Image:'',
    blobImage:null,
    nombreArchivo:'',
    validarLoading:0,
    rutaFoto:''
  };
  objRolUsuario: any;
  validarLoadingTabla:any = 0;
  constructor(
    private _servicioLaboratorio:LaboratoriosService,
    private _servicioMateriales:MaterialesService
  ) {
    this.objRolUsuario = JSON.parse(sessionStorage.getItem('objRolUsuario'));
    this.objUsuario = JSON.parse(sessionStorage.getItem('objUsuario'));
   }

  ngOnInit(): void {
    this.cargarLaboratorios();
    this.cargarMateriales();
  }
  verMaterial(item:any){

  }
  eliminarMaterial(item:any){
    const indexMaterial = this.arrayMateriales.findIndex(x=>x.id === item.id);
    if(indexMaterial === -1){
      this.presentarMensaje("error","Error","Selecciona un material válido")
    }else{
      this._servicioMateriales.eliminarMaterial(item).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.arrayMateriales.splice(indexMaterial, 1);
            this.presentarMensaje("success","Correcto",item.nombreMaterial+" eliminada exitosamente")
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
  presentarMenuEliminarMaterial(item:any){
    Swal.fire({
      title: 'Estás segur@ de eliminar '+item.nombreMaterial+'?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Si, quiero eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarMaterial(item);
        
      }
    }) 
  }

  guardarMaterial(){
    if(this.idLaboratorio == '0'){
      this.presentarMensaje("error","Alerta","Selecciona un laboratorio");
    }else if(this.nombreMaterial == ''){
      this.presentarMensaje("error","Alerta","Ingresa el nombre del material");
    }else if(this.descripcionMaterial == ''){
      this.presentarMensaje("error","Alerta","Ingresa una descripción del material");
    }else if(this.stockMaterial == '' || this.stockMaterial <= 0){
      this.presentarMensaje("error","Alerta","Ingresa el stock del material");
    }else if(this.blobImage == null){
      this.presentarMensaje("error","Alerta","Por favor selecciona una foto");
    }else{
      var formData = new FormData();
      formData.append('fotoMaterial', this.blobImage,this.nombreArchivo);   
      formData.append('idLaboratorio',this.idLaboratorio);
      formData.append('nombreMaterial',this.nombreMaterial);
      formData.append('descripcionMaterial',this.descripcionMaterial);
      formData.append('stockMaterial',this.stockMaterial);
      this.validarLoading = 1;
      this._servicioMateriales.guardarMaterial(formData).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.imgChangeEvt = '';
            this.cropImgPreview = '';
            this.inputFile.nativeElement.value = '';
            this.nombreMaterial = '';
            this.descripcionMaterial = '';
            this.stockMaterial = 0;
            this.cargarMateriales();
            this.presentarMensaje("success","Correcto","Material guardado exitosamente")
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

  modificarMaterial(){
    if(this.objModificar.nombreMaterial == ''){
      this.presentarMensaje("error","Alerta","Ingresa el nombre del material");
    }else if(this.objModificar.descripcionMaterial == ''){
      this.presentarMensaje("error","Alerta","Ingresa una descripción del material");
    }else{
      
      var formData = new FormData();
      if(this.objModificar.blobImage != null){
        formData.append('fotoMaterial', this.objModificar.blobImage,this.objModificar.nombreArchivo);
      }
      formData.append('idLaboratorio',this.objModificar.idLaboratorio);
      formData.append('idMaterial',this.objModificar.id);
      formData.append('nombreMaterial',this.objModificar.nombreMaterial);
      formData.append('descripcionMaterial',this.objModificar.descripcionMaterial);
      this.objModificar.validarLoading = 1;
      this._servicioMateriales.modificarMaterial(formData).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.objModificar.imgChangeEvt = '';
            this.objModificar.cropImgPreview = '';
            this.inputFileModificar.nativeElement.value = '';
           // this.objModificar.nombreMaterial = '';
           // this.objModificar.descripcionMaterial = '';
           if(data.nuevaRutaFoto != ''){
            this.objModificar.rutaFoto = data.nuevaRutaFoto;
           }
           
            this.cargarMateriales();
            this.presentarMensaje("success","Correcto","Material guardado exitosamente")
          }else{
            this.presentarMensaje("error","Error",data.mensaje)
            
          }
          this.objModificar.validarLoading = 0;
        } ,
        error: (error) => {
          if(error.status == 0){
            this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
          }else{
            this.presentarMensaje("error","Error","Error interno de la App")
          } 
          this.objModificar.validarLoading = 0;
        },
      });
    }
  }

  presentarFormularioModificar(item:any){
    console.log(item)
    this.objModificar.id = item.id;
    this.objModificar.idLaboratorio = this.idLaboratorio;
    this.objModificar.nombreMaterial = item.nombreMaterial;
    this.objModificar.descripcionMaterial = item.descripcionMaterial;
    this.objModificar.rutaFoto = item.rutaFoto;

  }
  onFileChangeModificar(event: any): void {
    this.objModificar.imgChangeEvt = event;
    var file = event.target.files[0];
    console.log(file)
    this.objModificar.mimeType = file.type;
    this.objModificar.nombreArchivo = file.name;
  }
  cropImgModificar(e: ImageCroppedEvent)  {
    this.objModificar.cropImgPreview = e.base64;
    this.objModificar.base64Image  = this.objModificar.cropImgPreview.replace(/^data:image\/[a-z]+;base64,/, "");
    this.objModificar.blobImage =  this.base64toBlob(this.objModificar.base64Image,`${this.objModificar.mimeType}`);
    console.log(this.objModificar.blobImage);
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



  modificarCondicion(){
    var stock = this.objCondicion.stock;
    var sumaCondicion = 0;
    this.objCondicion.arrayCondicion.forEach((res:any) => {
      console.log(res)
      sumaCondicion = sumaCondicion + res.cantidad;
    });
    if(stock != sumaCondicion){
      this.presentarMensaje("error","Error","El stock no coincide con la suma de las condiciones");
    }else if(this.objCondicion.id == "0"){
      this.presentarMensaje("error","Error","Selecciona un laboratorio");
    }else{
    
      
      this._servicioMateriales.modificarCodicionMaterial(this.objCondicion).subscribe({
        next: (data:any) =>{
          console.log(data);
          if(data.validar == true){
            this.cargarMateriales();
            this.presentarMensaje("success","Correcto","Modificado exitosamente")
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
  presentarFormularioCondicion(item:any){
    console.log(item)
    this.objCondicion.id = item.id;
    this.objCondicion.stock = item.stock;
    this.objCondicion.arrayCondicion = item.arrayCondicion;
  }









  cargarMateriales(){
    //if(this.idLaboratorio == "0"){
      //this.arrayMateriales = [];
   // }else{
    console.log(this.idLaboratorio)
    this.validarLoadingTabla = 1;
      this._servicioMateriales.cargarMateriales(this.idLaboratorio).subscribe({
        next: (data:any) =>{
          console.log(data);
          if(data.validar == true){
            this.arrayMateriales = data.listaMateriales;
            if(this.objRolUsuario.identificadorRol == 3){
              this.arrayMateriales = data.listaMateriales.filter((x:any)=>x.idUsuario === this.objUsuario.id);
            }
            console.log(this.arrayMateriales)
            //this.arrayLaboratorios = data.listaLaboratorios.filter((x:any)=>x.activo === 1 && x.idUsuario === this.objUsuario.id);
          }else{
            this.presentarMensaje("error","Error",data.mensaje)
          }
          this.validarLoadingTabla = 0;
        } ,
        error: (error) => {
          if(error.status == 0){
            this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
          }else{
            this.presentarMensaje("error","Error","Error interno de la App")
          } 
          this.validarLoadingTabla = 0;
          
        },
      }); 
   // }
  }


  async cargarLaboratorios(){
    this._servicioLaboratorio.cargarLaboratorios().subscribe({
      next: (data:any) =>{
        console.log(data);
        if(data.validar == true){
          this.arrayLaboratorios = data.listaLaboratorios.filter((x:any)=>x.activo === 1);
          if(this.objRolUsuario.identificadorRol == 3){
            this.arrayLaboratorios = data.listaLaboratorios.filter((x:any)=>x.activo === 1 && x.idUsuario === this.objUsuario.id);
          }
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
