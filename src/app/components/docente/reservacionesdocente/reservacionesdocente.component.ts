import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfigurarLaboratorioService } from 'src/app/servicios/configurar-laboratorio.service';
import { LaboratoriosService } from 'src/app/servicios/laboratorios.service';
import { ReservacionesService } from 'src/app/servicios/reservaciones.service';
import Swal from 'sweetalert2';

import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
pdfMake.vfs = pdfFonts.pdfMake.vfs;  

import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular'; // useful for typechecking
import {NgbModal, ModalDismissReasons,NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Observable, Observer, zip } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import esLocale from '@fullcalendar/core/locales/es';
import { environment } from 'src/environments/environment.prod';
    


@Component({
  selector: 'app-reservacionesdocente',
  templateUrl: './reservacionesdocente.component.html',
  styleUrls: ['./reservacionesdocente.component.css']
})
export class ReservacionesdocenteComponent implements OnInit {

@ViewChild('inputFile') inputFile: ElementRef;


@ViewChild('calendar') calendarComponent: FullCalendarComponent; 


@ViewChild('mymodal') mymodal: any;
@ViewChild('modalDetalleReserva') modalDetalleReserva: any;

title = 'appBootstrap';
  
closeResult: string = '';
  rutaLogoEspam:string = 'assets/admin/app/logo-espam.png';
  rutaLogoUnidad:string = 'assets/admin/app/logo-unidad.jpg';
  calendarOptions: CalendarOptions = {
    
    initialView: 'dayGridMonth',
    dateClick: this.seleccionarFecha.bind(this),
    locale:esLocale,
    events: [
      
    ],
    eventClick:this.presentarModalDetalle.bind(this),
    customButtons:{
      myCustomButton: {
        text: 'Nueva reserva',
        click: ()=>{
          this.open(this.mymodal,1);
        }
      }
    },
    headerToolbar: {
      right: 'today prev,next,dayGridMonth',
      left: 'title',
      center:'myCustomButton',
  
    },
 
  };


  arrayConfiguracionLaboratorioServidor: any[] = [];
  arrayMateriales: any[] = [];
  arrayLaboratorios:any[] = [];
  arrayReservaciones:any[] = [];
  arrayConfiguracionView:any = {};
  
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
    rutaLogoEspam:"",
    rutaLogoUnidad:""
  };

  objReservar:any = {
    id:0,
    fecha:"",
    nombreDia:"",
    nombrePractica:"",
    descripcionPractica:"",
    numeroEstudiantes:0,
    idConfigurarLaboratorio:0
  }; 
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
    motivoCancelar:""
  }; 

  validarMensaje:boolean = false;
  validarLoadingReservar:any = 0;
  fechaSeleccionada: any;
  identificadorDia: any;
  objUsuario: any;
  nombreUsuario: string;
  //base64Image: string;
  fechaActual: string;
  horaActual: string;
  mimeType: any;
  nombreArchivo: any;
  archivo: any;
  totalSeleccionados:number = 0;
  
  validarLoadingTabla:any = 0;
  constructor(
    private _servicioLaboratorio:LaboratoriosService,
    private _servicioConfigurarLaboratorio:ConfigurarLaboratorioService,
    private _servicioReservaciones:ReservacionesService,
    private modalService: NgbModal,
    private http:HttpClient,

  ) {
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    console.log(this.objUsuario)
    this.nombreUsuario = this.objUsuario.apellidos.toUpperCase()+" "+this.objUsuario.nombres.toUpperCase();
   /*  var fechaActualTemp = new Date();
    var hora = "00";
    var minuto = "00";
    if(fechaActualTemp.getHours().toString().length == 1){
      hora = "0"+fechaActualTemp.getHours().toString();
    }else{
      hora = fechaActualTemp.getHours().toString();
    }
    if(fechaActualTemp.getMinutes().toString().length == 1){
      minuto = "0"+fechaActualTemp.getMinutes().toString();
    }else{
      minuto = fechaActualTemp.getMinutes().toString();
    }
    
    this.horaActual = hora + ':' + minuto;

    this.fechaActual = fechaActualTemp.toISOString().split('T').slice(0, -1).join('.');

    this.calendarOptions.initialDate = this.fechaActual; */
    
  }

  ngOnInit(): void {
    this.cargarLaboratorios();
    this.cargarReservaciones();
  }

  ngAfterContentInit(){

  }
  validarHorarioChecked(){
    this.totalSeleccionados = this.arrayConfiguracionView.filter((x:any)=>x.checked == true).length;
  }



  onFileChange(event: any): void {
    var file = event.target.files[0];
    console.log(file)
    this.mimeType = file.type;
    this.nombreArchivo = file.name;
    this.archivo = file;
  }







  open(content:any,idModal:any) {

    if(idModal === 1 && this.objReservar.fecha == ""){
      this.presentarMensaje("error","Error","Para hacer una reserva primero selecciona una fecha en el calendario")
    }else if(idModal === 1 && this.objReservar.fecha < this.fechaActual){
      this.presentarMensaje("error","Error","Solo puedes reservar en una fecha mayor o igual a la actual")
    }else{
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



  seleccionarFecha(item:any){
    this.fechaSeleccionada = item.dateStr;
    this.identificadorDia = item.date.getDay();
    var anterior = document.getElementsByClassName("fc-daygrid-day");
    for(var i = 0; i < anterior.length; i++){
      anterior[i].removeAttribute("style"); 
    }
    item.dayEl.style.backgroundColor = "#CDFFC4";
    this.cargarConfiguracionLaboratorio();
   
  }

  cargarConfiguracionLaboratorio(){
    if(this.fechaSeleccionada != ""){
      this.objReservar.fecha=this.fechaSeleccionada;
      var arrayConfiguracionViewTemp = this.arrayConfiguracionLaboratorioServidor.filter((x:any)=>x.identificadorDia === this.identificadorDia && x.idLaboratorio === this.objLaboratorioSeleccionado.id);
      if(this.fechaActual == this.fechaSeleccionada){
     
        arrayConfiguracionViewTemp = this.arrayConfiguracionLaboratorioServidor.filter((x:any)=>x.identificadorDia === this.identificadorDia && x.idLaboratorio === this.objLaboratorioSeleccionado.id && x.horaInicio > this.horaActual);
       console.log(this.horaActual)
      }
      
      this.arrayConfiguracionView = [];
     
      arrayConfiguracionViewTemp.forEach((res:any)=>{
        var listaReservacionesFiltro = this.arrayReservaciones.filter((x:any)=>x.idConfigurarLaboratorio === res.id && x.fechaReservacion === this.fechaSeleccionada);
        if(listaReservacionesFiltro.length == 0){
          var obj = {
            checked:false,
            ...res
          }
          this.arrayConfiguracionView.push(obj);
        }
      });
    }
  }

  presentarModalDetalle(item:any){
   
    var data = item.event._def.extendedProps.data;
    console.log(data)
    if(data.validarReservadoDocente == 1){
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
      this.objDetalleReservar.rutaArchivo = data.rutaArchivo;
      
      this.open(this.modalDetalleReserva,2);
    }
  }

presentarFormularioEliminarReserva(item:any){
  console.log(item)
  if(item.motivoCancelar == ""){
    this.presentarMensaje("error","Alerta","Ingresa el motivo por el cual liberas este horario");
  }else{
    Swal.fire({
      title: 'Estás segur@ de eliminar la reservacion en la fecha '+item.fecha+' de '+item.horaInicio+' a '+item.horaFin+'?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Si, quiero eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarReservacion(item);
        
      }
    })
  } 
}

eliminarReservacion(item:any){
    this._servicioReservaciones.eliminarReservacionDocente(item).subscribe({
      next: (data:any) =>{
      
        if(data.validar == true){
          this.presentarMensaje("success","Correcto"," Eliminada exitosamente");
          this.cargarReservaciones();
          this.modalService.dismissAll("fin");
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







generatePDF() {  

  var arrayConfigurarLaboratorio = this.arrayConfiguracionView.filter((x:any)=>x.checked === true);
 
  var arrayFila = [];
  arrayFila.push(['Hora inicio', 'Hora fín' ]);
  var horario = "";
  if(arrayConfigurarLaboratorio.length == 0){
    arrayFila.push(['N/A', 'N/A']);
  }else{
    arrayConfigurarLaboratorio.map((res) => {
      arrayFila.push([
          { text: res.horaInicio},
          { text: res.horaFin }
      ]);
      horario = horario + res.horaInicio+ " - " +res.horaFin+', ';
    });
  }
  horario = horario.trim().substring(0, horario.length - 1);
 
  var fechaReservaTemp = new Date(this.objReservar.fecha);
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var nombreMes = meses[fechaReservaTemp.getMonth()];;
  const dias = ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"];
  var nombreDia = dias[fechaReservaTemp.getDay()];
  console.log(fechaReservaTemp.getDay())
  var numeroDia = this.objReservar.fecha.substring(this.objReservar.fecha.length-2, this.objReservar.fecha.length)
  var anio = fechaReservaTemp.getFullYear();
  var fechaMostrar = nombreDia+' '+numeroDia+' de '+nombreMes+' de '+anio;
  console.log(fechaMostrar)


  var colorTexto = "#000000";
  let docDefinition = {
    pageSize: 'A4',
    pageMargins: [ 80, 60, 80, 60 ],
    content: [
      {
        text: '\n\n',
      },
      {
        
        layout: 'lightHorizontalLines', // optional
        
        table: {
          headerRows: 1,
          widths: [ '*'],
  
          body: [
            [ 
              {
                image: this.objLaboratorioSeleccionado.rutaLogoEspam,
                alignment:"center",
                width:400,
               // height:70
              },
              /* {
                image: this.objLaboratorioSeleccionado.rutaLogoUnidad,
                alignment:"center",
                width:140,
                height:70
              }, */
            ]
          ]
          
        }
      },
      {
        text: '\n',
      },
      {
        text: this.objLaboratorioSeleccionado.nombreUnidad,
        fontSize:18,
        alignment:'center',
        bold: true
      },
      {
        text: '\n\n',
      },
      {
          table: {
          headerRows: 1,
          widths: [ '*', '*'],
          border:true,
          body: [
            [ 
              {
                text: "Nombre del laboratorio",
                fontSize:12,
                alignment:'left',
                bold: true
              },
              {
                text: this.objLaboratorioSeleccionado.nombreLaboratorio,
                fontSize:10,
                alignment:'left',
                bold: true
              },
            ],
            [ 
              {
                text: "Responsable del laboratorio",
                fontSize:12,
                alignment:'left',
                bold: true
              },
              { 
                text: this.objLaboratorioSeleccionado.apellidos.toUpperCase()+' '+this.objLaboratorioSeleccionado.nombres.toUpperCase(), 
                fontSize: 10,
                alignment:'left',
                bold: true
              },
            ],
            [ 
              {
                text: "Descripción",
                fontSize:12,
                alignment:'left',
                bold: true
              },
              { 
                text: this.objLaboratorioSeleccionado.descripcionLaboratorio, 
                fontSize: 12,
                alignment:'left',
                bold: true
              },
            ]
          ]
          
        }
      },
      {
        text: '\n\n',
      },
      {
        text: [
          'El laboratorio de ',
          { 
            text: this.objLaboratorioSeleccionado.nombreLaboratorio.toUpperCase(), 
            fontSize: 14,
            color:colorTexto,
            //bold: true
          },
          ' está reservado por el/la docente ',
          { 
            text: this.objLaboratorioSeleccionado.apellidos.toUpperCase()+' '+this.objLaboratorioSeleccionado.nombres.toUpperCase(), 
            fontSize: 14,
            color:colorTexto,
            //bold: true
          },
          ' el día ',
          { 
            text: fechaMostrar, 
            fontSize: 14,
            color:colorTexto,
            //bold: true
          },
          ' en los siguientes horarios ',
          { 
            text: horario, 
            fontSize: 14,
            color:colorTexto,
           // bold: true
          },
          ' con la cantidad de ',
          { 
            text: this.objReservar.numeroEstudiantes, 
            fontSize: 14,
            color:colorTexto,
           // bold: true
          },
          ' estudiantes y se va realizar la práctica de ',
          { 
            text: this.objReservar.descripcionPractica, 
            fontSize: 14,
            color:colorTexto,
           // bold: true
          },
          '.'
        ],
        fontSize:14,
        alignment:'justify',
        lineHeight:1.5
      },
    ]
  };
 
 
 const pdf = pdfMake.createPdf(docDefinition);
// pdf.open();
 pdf.download('reserva_'+this.objLaboratorioSeleccionado.nombreLaboratorio+'.pdf');
 
}  

limpiarFormulario(){
  this.objReservar.nombrePractica = "";
  this.objReservar.descripcionPractica="";
  this.objReservar.numeroEstudiantes=0;
  this.totalSeleccionados = 0;
  this.archivo = null;
  
}

reservarLaboratorio(){
  var arrayConfigurarLaboratorio = this.arrayConfiguracionView.filter((x:any)=>x.checked === true);
  if(arrayConfigurarLaboratorio.length == 0){
    this.presentarMensaje("error","Error","Selecciona al menos un horario")
  }else if(this.objReservar.nombrePractica == ""){
    this.presentarMensaje("error","Error","Ingresa el nombre de la práctica")
  }else if(this.objReservar.descripcionPractica == ""){
    this.presentarMensaje("error","Error","Ingresa la descripción de la practica")
  }else if(this.objReservar.numeroEstudiantes <= 0){
    this.presentarMensaje("error","Error","Ingresa el número de estudiantes")
  }else  if(this.archivo == null){
    this.presentarMensaje("error","Alerta","Por favor selecciona un archivo PDF")
  }else{
    //var objusuario = sessionStorage.getItem('objUsuario');
    this.validarLoadingReservar = 1;
    var formData = new FormData();
    formData.append('archivo', this.archivo,this.nombreArchivo);   
    formData.append('arrayConfigurarLaboratorio',JSON.stringify(arrayConfigurarLaboratorio));
    formData.append('tokenApp',environment.tokenApp);
    formData.append('objUsuario', JSON.stringify(this.objUsuario));
    formData.append('arrayReservacion',JSON.stringify(this.objReservar));
    formData.append('objLaboratorio',JSON.stringify(this.objLaboratorioSeleccionado));
    
    this._servicioReservaciones.guardarReservacionDocente(formData).subscribe({
      next: (data:any) =>{
        console.log(data);
        if(data.validar == true){
          
          this.presentarMensaje("success","Correcto","Reservado exitosamente")
          this.cargarReservaciones();   
          this.modalService.dismissAll("fin");
          
   
          this.generatePDF();
          this.limpiarFormulario();
        }else{
          this.presentarMensaje("error","Error",data.mensaje)
        }
        this.validarLoadingReservar = 0;
      } ,
      error: (error) => {
        if(error.status == 0){
          this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
        }else{
          this.presentarMensaje("error","Error","Error interno de la App")
        } 
        this.validarLoadingReservar = 0;
        
      },
    }); 
  }
}

seleccionarLaboratorio(item:any){
  console.log(item)
  var arrayLaboratorioSeleccionado = this.arrayLaboratorios.filter((x:any)=>x.seleccionado === true);
  if(arrayLaboratorioSeleccionado.length > 0){
    const index = this.arrayLaboratorios.findIndex((x:any)=>x.seleccionado === true);
    if(index != -1){
      this.arrayLaboratorios[index].seleccionado = false;
      this.arrayLaboratorios[index].color = '';
    }
  }
  this.objReservar.fecha = "";
  var anterior = document.getElementsByClassName("fc-daygrid-day");
  for(var i = 0; i < anterior.length; i++){
    anterior[i].removeAttribute("style"); 
  }
  item.seleccionado = true;
  item.color = "#CEFFD8";
  this.arrayConfiguracionView = [];
  this.arrayMateriales = [];
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

  
  this.getBase64ImageFromURL(this.rutaLogoEspam).subscribe(base64data => {
   
    var base64Image = "data:image/jpg;base64," + base64data;
    this.objLaboratorioSeleccionado.rutaLogoEspam = base64Image;
  });
  this.getBase64ImageFromURL(this.rutaLogoUnidad).subscribe(base64data=>{
    var base64Image = "data:image/jpg;base64," + base64data;
    this.objLaboratorioSeleccionado.rutaLogoUnidad = base64Image;
  });
  this.cargarReservaciones();
  
}
getBase64ImageFromURL(url: string) {
  return Observable.create((observer: Observer<string>) => {
    const img: HTMLImageElement = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    if (!img.complete) {
      img.onload = () => {
        observer.next(this.getBase64Image(img));
        observer.complete();
      };
      img.onerror = err => {
        observer.error(err);
      };
    } else {
      observer.next(this.getBase64Image(img));
      observer.complete();
    }
  });
}
getBase64Image(img: HTMLImageElement) {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const dataURL: string = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

async cargarEventosCalendario(){


  var arrayEventos = [];
  var arrayReservacionFiltro = this.arrayReservaciones.filter((x:any)=>x.idLaboratorio === this.objLaboratorioSeleccionado.id)
  arrayReservacionFiltro.forEach((res:any)=>{
    if(res.validarReservadoDocente == 0){
      var fechaHora = res.fechaReservacion+" "+res.horaInicio;
      var nombrePractica:string = "NO DISPONIBLE";
      var objEvento = {
          title: nombrePractica, 
          date: fechaHora,
          color: "#C5C202",
          data:res
          
      };
      arrayEventos.push(objEvento);
      
    }else if(res.validarReservadoDocente == 1){
      var fechaHora = res.fechaReservacion+" "+res.horaInicio;
      var nombrePractica:string = res.nombrePractica;
      var objEvento = {
        title: nombrePractica, 
        date: fechaHora,
        color: "#00972B",
        data:res,
        
      };
      arrayEventos.push(objEvento);
    }
  });
  this.calendarOptions.events = arrayEventos;
}

async cargarReservaciones(){
    
 
  this._servicioReservaciones.cargarReservacionesDocente().subscribe({
    next: (data:any) =>{
      
      if(data.validar == true){
        this.arrayReservaciones =  data.listaReservaciones;
        this.arrayConfiguracionLaboratorioServidor = data.listaConfigurarLaboratorio;
        this.fechaActual = data.fechaActual;
        this.horaActual = data.horaActual;
        console.log(data);
        this.cargarEventosCalendario();
        this.cargarConfiguracionLaboratorio();

      
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
    
    this.validarLoadingTabla = 1;
    this._servicioLaboratorio.cargarLaboratorios().subscribe({
      next: (data:any) =>{
      
        if(data.validar == true){
          var arrayLaboratorios =  data.listaLaboratorios.filter((x:any)=>x.activo === 1);
          arrayLaboratorios.forEach((res:any) => {
            var obj = {
              ...res,
              seleccionado:false,
              color:""
            };
            this.arrayLaboratorios.push(obj);
          });
       
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
 }

  async presentarMensaje(tipo:any,titulo:string,mensaje:string){
    Swal.fire(
      titulo,
      mensaje,
      tipo,
    )
   }

}
