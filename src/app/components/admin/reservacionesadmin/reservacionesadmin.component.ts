import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { LaboratoriosService } from 'src/app/servicios/laboratorios.service';
import { ReservacionesService } from 'src/app/servicios/reservaciones.service';
import Swal from 'sweetalert2';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular'; // useful for typechecking
import {NgbModal, ModalDismissReasons,NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import esLocale from '@fullcalendar/core/locales/es';
@Component({
  selector: 'app-reservacionesadmin',
  templateUrl: './reservacionesadmin.component.html',
  styleUrls: ['./reservacionesadmin.component.css']
})
export class ReservacionesadminComponent implements OnInit {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent; 
  @ViewChild('modalDetalleReserva') modalDetalleReserva: any;
  calendarOptions: CalendarOptions = {
    
    initialView: 'dayGridMonth',
    dateClick: this.seleccionarFecha.bind(this),
    locale:esLocale,
    events: [],
    eventClick:this.presentarModalDetalle.bind(this),
    headerToolbar: {
      right: 'today prev,next,dayGridMonth,timeGridWeek,timeGridDay',
      left: 'title',  
    },
    
 
  };


  arrayDias:any[] = [];
  arrayLaboratorios:any[] = [];

  arrayConfiguracionView:any = {};
  arrayReservaciones:any[] = [];
  arrayConfiguracionLaboratorioServidor: any[] = [];
  objLaboratorioSeleccionado:any = {
    id:0,
    nombreLaboratorio:"",
    descripcionLaboratorio:"",
    rutaFotoLaboratorio:"",
    nombreUnidad:"",
    rutaFotoUnidad:"",
    nombreCarrera:"",
    nombres:"",
    apellidos:"",
    rutaFotoUsuario:"",
  };
/*   objDetalleReserva:any = {
    cedula:"",
    nombres:"",
    apellidos:"",
    correoInstitucional:"",
    carreraDocente:"",
    nombreUnidad:"",
    nombreLaboratorio:"",
    fechaReservacion:"",
    horaInicio:"",
    horaFin:"",
    nombreDia:"",
    nombrePractica:"",
    descripcionPractica:"",
    numeroEstudiantes:"",
    rutaFoto:"",
  }; */
  fechaSeleccionada: any;
  identificadorDia: any;
  objDetalleReservar:any = {
    id:0,
    idCabeceraReservacion:0,
    fecha:"",
    horaInicio:"",
    horaFin:"",
    nombreDia:"",
    nombrePractica:"",
    descripcionPractica:"",
    numeroEstudiantes:0,
    idConfigurarLaboratorio:0,
    cedula:"",
    nombres:"",
    apellidos:"",
    rutaArchivo:""
  }; 
  closeResult: string;
  objRolUsuario: any;
  objUsuario: any;
  validarLoadingTabla:any = 0;
  constructor(
    private _servicioReservaciones:ReservacionesService,
    private _servicioLaboratorio:LaboratoriosService,
    private modalService: NgbModal,
  ) { 
    this.objRolUsuario = JSON.parse(sessionStorage.getItem('objRolUsuario'));
    this.objUsuario = JSON.parse(sessionStorage.getItem('objUsuario'));
  }

  ngOnInit(): void {
    this.cargarLaboratorios();
  }
  ngOnDestroy(): void {

  }

 

 open(content:any) {


  this.modalService.open(content, {
    ariaLabelledBy: 'modal-basic-title',
    backdrop:false,
    size:'lg'

  }).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
  
}

  
private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return  `with: ${reason}`;
  }
}

 presentarModalDetalle(item:any){
  var data = item.event._def.extendedProps.data;
  this.objDetalleReservar.id = data.id;
  this.objDetalleReservar.idCabeceraReservacion = data.idCabeceraReservacion;
  this.objDetalleReservar.fecha = data.fechaReservacion;
  this.objDetalleReservar.horaInicio = data.horaInicio;
  this.objDetalleReservar.horaFin = data.horaFin;
  this.objDetalleReservar.nombreDia = data.nombreDia;
  this.objDetalleReservar.nombrePractica = data.nombrePractica;
  this.objDetalleReservar.descripcionPractica = data.descripcionPractica;
  this.objDetalleReservar.numeroEstudiantes = data.numeroEstudiantes;
  this.objDetalleReservar.idConfigurarLaboratorio = data.idConfigurarLaboratorio;
  this.objDetalleReservar.cedula = data.cedula;
  this.objDetalleReservar.nombres = data.nombres.toUpperCase();
  this.objDetalleReservar.apellidos = data.apellidos.toUpperCase();
  this.objDetalleReservar.rutaArchivo = data.rutaArchivo;
  this.open(this.modalDetalleReserva);
}
 
 seleccionarFecha(item:any){
  this.fechaSeleccionada = item.dateStr;
  this.identificadorDia = item.date.getDay();

 
}


async cargarEventosCalendario(){


  var arrayEventos = [];
  var arrayReservacionFiltro = this.arrayReservaciones.filter((x:any)=>x.idLaboratorio === this.objLaboratorioSeleccionado.id);
  console.log(arrayReservacionFiltro)
  arrayReservacionFiltro.forEach((res:any)=>{

    var fechaHora = res.fechaReservacion+" "+res.horaInicio;
    var nombrePractica:string = res.nombrePractica;
    var objEvento = {
      title: nombrePractica, 
      date: fechaHora,
      color: "#00972B",
      data:res,
    };
    arrayEventos.push(objEvento);
    
  });
  this.calendarOptions.events = arrayEventos;
}

async cargarReservaciones(){
  this._servicioReservaciones.cargarReservacionesAdmin(this.objLaboratorioSeleccionado.id).subscribe({
    next: (data:any) =>{
      console.log(data);
      if(data.validar == true){
        this.arrayReservaciones =  data.listaReservaciones;
        
        this.arrayConfiguracionLaboratorioServidor = data.listaConfigurarLaboratorio;
        this.cargarEventosCalendario();
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

seleccionarLaboratorio(item:any){
  var arrayLaboratorioSeleccionado = this.arrayLaboratorios.filter((x:any)=>x.seleccionado === true);
  if(arrayLaboratorioSeleccionado.length > 0){
    const index = this.arrayLaboratorios.findIndex((x:any)=>x.seleccionado === true);
    if(index != -1){
      this.arrayLaboratorios[index].seleccionado = false;
      this.arrayLaboratorios[index].color = '';
    }
  }
  var anterior = document.getElementsByClassName("fc-daygrid-day");
  for(var i = 0; i < anterior.length; i++){
    anterior[i].removeAttribute("style"); 
  }
  item.seleccionado = true;
  item.color = "#CEFFD8";
  this.arrayConfiguracionView = [];
  this.objLaboratorioSeleccionado.id = item.id;
  this.objLaboratorioSeleccionado.nombreLaboratorio = item.nombreLaboratorio;
  this.objLaboratorioSeleccionado.descripcionLaboratorio = item.descripcionLaboratorio,
  this.objLaboratorioSeleccionado.rutaFotoLaboratorio = item.rutaFotoLaboratorio,
  this.objLaboratorioSeleccionado.nombreUnidad = item.nombreUnidad;
  this.objLaboratorioSeleccionado.rutaFotoUnidad = item.rutaFotoUnidad;
  this.objLaboratorioSeleccionado.nombreCarrera = item.nombreCarrera;
  this.objLaboratorioSeleccionado.nombres = item.nombres;
  this.objLaboratorioSeleccionado.apellidos = item.apellidos;
  this.objLaboratorioSeleccionado.rutaFotoUsuario = item.rutaFotoUsuario;
  this.cargarReservaciones();
}


 async cargarLaboratorios(){
    
  this.validarLoadingTabla = 1;
  this._servicioLaboratorio.cargarLaboratoriosReporte().subscribe({
    next: (data:any) =>{
      console.log(data);
      if(data.validar == true){
        this.arrayLaboratorios = data.listaLaboratorios;
        if(this.objRolUsuario.identificadorRol == 3){
          this.arrayLaboratorios = data.listaLaboratorios.filter((x:any)=>x.idUsuario === this.objUsuario.id);
        }
       
      }else{
        this.presentarMensaje("error","Error",data.mensaje)
      }
      this.validarLoadingTabla = 0;
    } ,
    error: (error) => {
      this.validarLoadingTabla = 0;
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
