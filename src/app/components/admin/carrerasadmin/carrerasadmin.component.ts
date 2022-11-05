import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { CarrerasService } from 'src/app/servicios/carreras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrerasadmin',
  templateUrl: './carrerasadmin.component.html',
  styleUrls: ['./carrerasadmin.component.css']
})
export class CarrerasadminComponent implements OnInit {


  @ViewChild('modalModificar') modalModificar: ElementRef;
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  
  nombreCarrera: string = "";
  validarLoading: number = 0;
  arrayCarreras:any[] = [];

  objModificarCarrera:any = {
    id:0,
    nombreCarrera:""
  }
  validarLoadingTabla:string = 'block';
  validarTabla:string = 'none';
  constructor(
    private _servicioCarreras:CarrerasService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType:'full_numbers',
      pageLength:10
    };
    this.cargarCarreras();
  }

  modificarCarrera(){
    
    const indexCarrera = this.arrayCarreras.findIndex(x=>x.id === this.objModificarCarrera.id);
    if(indexCarrera === -1){
      this.presentarMensaje("error","Error","Selecciona una carrera válida")
    }else if(this.objModificarCarrera.nombreCarrera == ""){
      this.presentarMensaje("error","Error","Ingresa el nombre de la carrera")
    }else {
      this._servicioCarreras.modificarCarrera(this.objModificarCarrera).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.modalModificar.nativeElement.click();
            this.arrayCarreras[indexCarrera] = data.objCarrera;
            sessionStorage.setItem('listaCarreras',JSON.stringify(this.arrayCarreras));
            this.presentarMensaje("success","Correcto","Carrera modificada exitosamente")
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


  
  async presentarFormularioModificar(item:any){
    console.log(item)
    this.objModificarCarrera.id = item.id;
    this.objModificarCarrera.nombreCarrera = item.nombreCarrera;
  }

  eliminarCarrera(item:any){
    
    const indexCarrera = this.arrayCarreras.findIndex(x=>x.id === item.id);
    if(indexCarrera === -1){
      this.presentarMensaje("error","Error","Selecciona una carrera válida")
    }else{
      this._servicioCarreras.eliminarCarrera(item).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
        
            this.arrayCarreras.splice(indexCarrera, 1);
            sessionStorage.setItem('listaCarreras',JSON.stringify(this.arrayCarreras));
            this.presentarMensaje("success","Correcto",item.nombreCarrera+" eliminada exitosamente")
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

  async presentarMenuEliminarCarrera(item:any){
    Swal.fire({
     title: 'Estás segur@ de eliminar '+item.nombreCarrera+'?',
     text: "No podrás revertir esto!",
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     cancelButtonText:'Cancelar',
     confirmButtonText: 'Si, quiero eliminar!'
   }).then((result) => {
     if (result.isConfirmed) {
       this.eliminarCarrera(item);
       
     }
   }) 
 }

  
  async guardarCarrera(){
    
    if(this.nombreCarrera == ""){
      this.presentarMensaje("error","Error","Ingresa el nombre de la carrera")
    }else {
      this.validarLoading = 1;
      this._servicioCarreras.guardarCarrera(this.nombreCarrera).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.arrayCarreras.unshift(data.objCarrera);
            if(this.arrayCarreras.length == 1){
              this.dtTrigger.next(this.arrayCarreras);
            }
            sessionStorage.setItem('listaCarreras',JSON.stringify(this.arrayCarreras));
           
            this.validarLoading = 0;
            this.nombreCarrera ="";
            this.presentarMensaje("success","Correcto","Carrera guardada exitosamente")
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

 async cargarCarreras(){
    

  this._servicioCarreras.cargarCarreras().subscribe({
    next: (data:any) =>{
      if(data.validar == true){
        this.arrayCarreras = data.listaCarreras;
        if(this.arrayCarreras.length > 0){
          this.dtTrigger.next(this.arrayCarreras);
        }
        sessionStorage.setItem('listaCarreras',JSON.stringify(this.arrayCarreras));
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



  async presentarMensaje(tipo:any,titulo:string,mensaje:string){
    Swal.fire(
      titulo,
      mensaje,
      tipo,
    )
   }

}
