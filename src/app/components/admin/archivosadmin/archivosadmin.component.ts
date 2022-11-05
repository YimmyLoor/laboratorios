import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ArchivosService } from 'src/app/servicios/archivos.service';
import { LaboratoriosService } from 'src/app/servicios/laboratorios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-archivosadmin',
  templateUrl: './archivosadmin.component.html',
  styleUrls: ['./archivosadmin.component.css']
})
export class ArchivosadminComponent implements OnInit {

  @ViewChild('inputFile') inputFile: ElementRef;


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  
  mimeType: any;
  nombreArchivo: any;
  validarLoading:any = 0;


  objArchivo:any = {
    idLaboratorio:"0",
    idTipoArchivo:"0",
    nombreArchivo:"",
    descripcionArchivo:"",
    archivo:null

  };


  arrayLaboratorios:any[] = [];
  arrayTipoArchivos:any[] = [];
  arrayArchivos:any[] = [];
  objRolUsuario: any;
  objUsuario: any;
  constructor(
    private _servicioLaboratorio:LaboratoriosService,
    private _servicioArchivos:ArchivosService
  ) {
    this.objRolUsuario = JSON.parse(sessionStorage.getItem('objRolUsuario'));
    this.objUsuario = JSON.parse(sessionStorage.getItem('objUsuario'));

   }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType:'full_numbers',
      pageLength:10
    };

    this.cargarArchivos();
    this.cargarLaboratorios();
    this.cargarTipoArchivos();
  }
  onFileChange(event: any): void {
    var file = event.target.files[0];
    console.log(file)
    this.mimeType = file.type;
    this.nombreArchivo = file.name;
    
    this.objArchivo.archivo = file;
  }

  guardarArchivo(){
    if(this.objArchivo.idLaboratorio == "0"){
      this.presentarMensaje("error","Alerta","Por favor selecciona un laboratorio")
    }else  if(this.objArchivo.idTipoArchivo == "0"){
      this.presentarMensaje("error","Alerta","Por favor selecciona un tipo de archivo")
    }else  if(this.objArchivo.nombreArchivo == ""){
      this.presentarMensaje("error","Alerta","Por favor ingresa el nombre del archivo")
    }else  if(this.objArchivo.descripcionArchivo == ""){
      this.presentarMensaje("error","Alerta","Por favor ingresa una descripción del archivo")
    }else if(this.objArchivo.archivo == null){
        this.presentarMensaje("error","Alerta","Por favor selecciona un archivo")
    }else{
      var listaArchivoFiltro = this.arrayTipoArchivos.filter((x:any)=>x.id.toString() === this.objArchivo.idTipoArchivo);
      var identificador = listaArchivoFiltro[0].identificador;
      var ext = this.nombreArchivo.split('.').pop();
      if(identificador == 1 && ext != "pdf"){
        this.presentarMensaje("error","Alerta","El archivo seleccionado debe ser PDF")
      }else if(identificador == 2 && ext != "doc" && ext != "docx"){
        this.presentarMensaje("error","Alerta","El archivo seleccionado debe ser WORD")
      }else if(identificador == 3 &&  ext != "xls" && ext != "xlsx"){
        this.presentarMensaje("error","Alerta","El archivo seleccionado debe ser EXCEL")
      }else if(identificador == 4 &&  ext != "ppt" && ext != "pptx"){
        this.presentarMensaje("error","Alerta","El archivo seleccionado debe ser POWER POINT")
      }else{


        var formData = new FormData();
        formData.append('archivo', this.objArchivo.archivo,this.nombreArchivo);   
        formData.append('idLaboratorio',this.objArchivo.idLaboratorio);
        formData.append('idTipoArchivo',this.objArchivo.idTipoArchivo);
        formData.append('nombreArchivo',this.objArchivo.nombreArchivo);
        formData.append('descripcionArchivo',this.objArchivo.descripcionArchivo);
        this.validarLoading = 1;
        this._servicioArchivos.guardarArchivo(formData).subscribe({
          next: (data:any) =>{
            console.log(data)
            if(data.validar == true){
              this.objArchivo.idTipoArchivo = "0";
              this.objArchivo.nombreArchivo = "";
              this.objArchivo.descripcionArchivo = "";
              this.inputFile.nativeElement.value = '';
              this.reCargarArchivos();
              this.presentarMensaje("success","Correcto","Archivo guardado exitosamente")
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
  }
  async presentarMenuEliminarArchivo(item:any){
    Swal.fire({
     title: 'Estás segur@ de eliminar el archivo: '+item.nombreArchivo+'?',
     text: "No podrás revertir esto!",
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     cancelButtonText:'Cancelar',
     confirmButtonText: 'Si, quiero eliminar!'
   }).then((result) => {
     if (result.isConfirmed) {
       this.eliminarArchivo(item);
       
     }
   }) 
 
}

  eliminarArchivo(item:any){
    
    const indexArchivo = this.arrayArchivos.findIndex(x=>x.id === item.id);
    if(indexArchivo === -1){
      this.presentarMensaje("error","Error","Selecciona un archivo válido")
    }else{
      this._servicioArchivos.eliminarArchivo(item).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
        
            this.arrayArchivos.splice(indexArchivo, 1);
            this.presentarMensaje("success","Correcto","Archivo eliminado exitosamente")
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


  async reCargarArchivos(){
    
 
    this._servicioArchivos.cargarArchivos().subscribe({
      next: (data:any) =>{
        console.log(data);
        if(data.validar == true){
          console.log(data)
          this.arrayArchivos = data.listaArchivos;
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
  
  async cargarArchivos(){
    
 
    this._servicioArchivos.cargarArchivos().subscribe({
      next: (data:any) =>{
        console.log(data);
        if(data.validar == true){
          console.log(data)
          
          this.arrayArchivos = data.listaArchivos;
          if(this.objRolUsuario.identificadorRol == 3){
            this.arrayArchivos = data.listaArchivos.filter((x:any)=>x.idUsuario === this.objUsuario.id);
          }
          if(this.arrayArchivos.length > 0){
            this.dtTrigger.next(this.arrayArchivos);
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


  async cargarTipoArchivos(){
    
 
    this._servicioArchivos.cargarTipoArchivos().subscribe({
      next: (data:any) =>{
        console.log(data);
        if(data.validar == true){
          console.log(data)
          this.arrayTipoArchivos = data.listaTipoArchivos;
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
