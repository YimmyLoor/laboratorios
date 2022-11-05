import { Component, OnInit } from '@angular/core';
import { ReservacionesService } from 'src/app/servicios/reservaciones.service';
import Swal from 'sweetalert2';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import { Observable, Observer } from 'rxjs';
pdfMake.vfs = pdfFonts.pdfMake.vfs;  
@Component({
  selector: 'app-detallereservacionesdocente',
  templateUrl: './detallereservacionesdocente.component.html',
  styleUrls: ['./detallereservacionesdocente.component.css']
})
export class DetallereservacionesdocenteComponent implements OnInit {

  arrayReservaciones:any[] = [];
  validarLoadingTabla:string = 'block';
  validarTabla:string = 'none';
  rutaLogoEspam:string = 'assets/admin/app/logo-espam.png';
  rutaLogoEspamBase64:string = '';
  objUsuario: any;
  constructor(
    private _servicioReservaciones:ReservacionesService
  ) { 
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    this.getBase64ImageFromURL(this.rutaLogoEspam).subscribe(base64data => {
   
      var base64Image = "data:image/jpg;base64," + base64data;
      this.rutaLogoEspamBase64 = base64Image;
    });
  }

  ngOnInit(): void {
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
  

  async descargarComprobante(item:any){
    console.log(item)
   // var arrayConfigurarLaboratorio = this.arrayConfiguracionView.filter((x:any)=>x.checked === true);
    var arrayConfigurarLaboratorio = item.arrayReserva;
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
 
  var fechaReservaTemp = new Date(item.fechaReservacion);
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var nombreMes = meses[fechaReservaTemp.getMonth()];;
  const dias = ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"];
  var nombreDia = dias[fechaReservaTemp.getDay()];
  console.log(fechaReservaTemp.getDay())
  var numeroDia = item.fechaReservacion.substring(item.fechaReservacion.length-2, item.fechaReservacion.length)
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
                image: this.rutaLogoEspamBase64,
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
        text: item.nombreUnidad,
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
                text: item.nombreLaboratorio,
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
                text: item.encargadoLaboratorio.toUpperCase(), 
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
                text: item.descripcionLaboratorio, 
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
            text: item.nombreLaboratorio.toUpperCase(), 
            fontSize: 14,
            color:colorTexto,
            //bold: true
          },
          ' está reservado por el/la docente ',
          { 
            text: this.objUsuario.apellidos.toUpperCase()+' '+this.objUsuario.nombres.toUpperCase(), 
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
            text: item.numeroEstudiantes, 
            fontSize: 14,
            color:colorTexto,
           // bold: true
          },
          ' estudiantes y se va realizar la práctica de ',
          { 
            text: item.descripcionPractica, 
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
    pdf.download('reserva_'+item.nombreLaboratorio+'.pdf');
  }

  async cargarReservaciones(){
    
 
    this._servicioReservaciones.cargarDetalleReservacionesDocente().subscribe({
      next: (data:any) =>{
        
        if(data.validar == true){
          this.arrayReservaciones =  data.listaReservaciones;
        //  this.arrayConfiguracionLaboratorioServidor = data.listaConfigurarLaboratorio;
          console.log(data);
        
        
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
