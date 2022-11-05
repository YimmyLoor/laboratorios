import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReportesService } from 'src/app/servicios/reportes.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal from 'sweetalert2';
import { ChartConfiguration } from 'chart.js';
import { LaboratoriosService } from 'src/app/servicios/laboratorios.service';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import { Observable, Observer } from 'rxjs';
pdfMake.vfs = pdfFonts.pdfMake.vfs;  

@Component({
  selector: 'app-reportesadmin',
  templateUrl: './reportesadmin.component.html',
  styleUrls: ['./reportesadmin.component.css']
})
export class ReportesadminComponent implements OnInit {

  @ViewChild('canvasReservas') canvasReservas:ElementRef

  public barChartLegend = true;
  public barChartPlugins = [];



  arrayChartReservas:any = null;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    
    responsive: true,
    maintainAspectRatio:false,
    plugins:{
      title:{
        display:true,
        text:"RESERVACIÓN DE LABORATORIO",
        
      },
    
    },
    
  };






  idReporte:any = "0";
  idCarrera:any = "0";
  idLaboratorio:any = "0";
  selectedCarreras:any[] = [];
  arrayReportes:any[] = [];
  arrayUsuarios:any[] = [];
  arrayLaboratorios:any = [];
  arrayCarreras: any[] = [];
  arrayReservas: any[] = [];
  arrayMateriales:any[] = [];
  fechaInicio: any = "";
  fechaFin: any = "";
  objRolUsuario: any;
  objUsuario: any;
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
  rutaLogoEspam:string = 'assets/admin/app/logo-espam.png';
  rutaLogoUnidad:string = 'assets/admin/app/logo-unidad.jpg';

  validarLoadingTabla:string = 'none';
  validarTabla:string = 'none';
  constructor(
    private _servicioUsuarios:UsuariosService,
    private _servicioReportes:ReportesService,
    private _servicioLaboratorios:LaboratoriosService
  ) {
    this.objUsuario = JSON.parse(sessionStorage.getItem('objUsuario'));
    this.objRolUsuario = JSON.parse(sessionStorage.getItem('objRolUsuario'));
    if(this.objRolUsuario.identificadorRol == 1){
     /*  var obj = {
        idReporte:"1",
        nombreReporte:"LISTADO DE USUARIOS"
      }
      this.arrayReportes.push(obj); */
    }
      
    
    this.arrayReportes.push({
      idReporte:"2",
      nombreReporte:"LISTADO DE RESERVAS POR CARRERA"
    });
    this.arrayReportes.push({
      idReporte:"3",
      nombreReporte:"REPORTE DE MATERIALES"
    });
  

  
    
   }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarLaboratorios();
    var listaCarreras:any = sessionStorage.getItem('listaCarreras');
    this.arrayCarreras = JSON.parse(listaCarreras);
  }

  seleccionarReporte(){
    this.idLaboratorio = "0";
    this.objLaboratorioSeleccionado = {
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
  }


  cargarReporteMateriales(){
    if(this.idLaboratorio == "0"){
      this.arrayMateriales = [];
    }else{
      var listaLaboratorioFiltro = this.arrayLaboratorios.filter((x:any)=>x.id.toString() === this.idLaboratorio)[0];
      this.objLaboratorioSeleccionado.id = listaLaboratorioFiltro.id;
      this.objLaboratorioSeleccionado.nombreLaboratorio = listaLaboratorioFiltro.nombreLaboratorio;
      this.objLaboratorioSeleccionado.descripcionLaboratorio = listaLaboratorioFiltro.descripcionLaboratorio,
      this.objLaboratorioSeleccionado.rutaFotoLaboratorio = listaLaboratorioFiltro.rutaFotoLaboratorio,
      this.objLaboratorioSeleccionado.nombreUnidad = listaLaboratorioFiltro.nombreUnidad;
      this.objLaboratorioSeleccionado.rutaFotoUnidad = listaLaboratorioFiltro.rutaFotoUnidad;
      this.objLaboratorioSeleccionado.nombreCarrera = listaLaboratorioFiltro.nombreCarrera;
      this.objLaboratorioSeleccionado.nombres = listaLaboratorioFiltro.nombres;
      this.objLaboratorioSeleccionado.apellidos = listaLaboratorioFiltro.apellidos;
      this.objLaboratorioSeleccionado.rutaFotoUsuario = listaLaboratorioFiltro.rutaFotoUsuario;
      this.arrayMateriales = listaLaboratorioFiltro.arrayMateriales;
      if(this.arrayMateriales.length == 0){
        this.presentarMensaje("error","Alerta","El laboratorio seleccionado no tiene materiales registrados")
      }
      this.getBase64ImageFromURL(this.rutaLogoEspam).subscribe(base64data => {
   
        var base64Image = "data:image/jpg;base64," + base64data;
        this.objLaboratorioSeleccionado.rutaLogoEspam = base64Image;
      });
      this.getBase64ImageFromURL(this.rutaLogoUnidad).subscribe(base64data=>{
        var base64Image = "data:image/jpg;base64," + base64data;
        this.objLaboratorioSeleccionado.rutaLogoUnidad = base64Image;
      });
    }
   
    
  }

  imprimirReporteMateriales(){

    var arrayFila = [];
    var obj = [
      { text: "Cantidad", bold: false,fontSize:10,alignment:"center" },
      { text: "Material", bold: false,fontSize:10,alignment:"center" },
      { text: "Estado", bold: false,fontSize:10,alignment:"center" }
    ];
    arrayFila.push(obj);
    console.log(arrayFila)

    this.arrayMateriales.forEach((resMaterial:any)=>{
      var estado = "";
    
      resMaterial.arrayCondicion.forEach((resCondicion:any) => {

        estado = estado+resCondicion.condicion +" ("+resCondicion.cantidad+")\n";
      });
      var objMaterial = [
        { text: resMaterial.stock, bold: false,fontSize:10,alignment:"center" },
        { text: resMaterial.nombreMaterial, bold: false,fontSize:10,alignment:"center" },
        { text: estado, bold: false,fontSize:10,alignment:"left" }
      ];
      arrayFila.push(objMaterial);

    });






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
                  //height:70
                },
                /* {
                  image: this.objLaboratorioSeleccionado.rutaLogoUnidad,
                  alignment:"left",
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
          text: '\n',
        },
        {
          text: 'REPORTE DE MATERIALES',
          fontSize:16,
          alignment:'left',
          bold: true
        },
        {
          text: '\n',
        },
        {
            table: {
            headerRows: 1,
            widths: [ '*', '*'],
            border:true,
            body: [
              [ 
                {
                  text: "Nombre del Laboratorio: ",
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
                  text: "Responsable del Laboratorio: ",
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
            ]
            
          }
        },
        {
          text: '\n\n',
        },
        {
          text: [
            'El laboratorio de',
            { 
              text: this.objLaboratorioSeleccionado.nombreLaboratorio.toUpperCase(), 
              fontSize: 14,
              color:colorTexto,
            },
            'presenta los materiales detallados a continuación en la siguiente tabla: ',
          ],
          fontSize:14,
          alignment:'justify',
          lineHeight:1.5
        },
        {
          text: '\n\n',
        },
        {
          
         // layout: 'lightHorizontalLines', // optional
          
          table: {
            headerRows: 1,
            widths: ['*','*','*'],
    
            body: arrayFila
            
          }
        },
      ]
    };
   
   
      const pdf = pdfMake.createPdf(docDefinition);
      pdf.open();
  }

  imprimirReporteReservas(){
    var arrayFilaTemp = [];
    var arrayFila = [];
    var widthsTabla = []; 
    widthsTabla.push('*');
    widthsTabla.push('*');
    var obj = { text: "MESES", bold: true,fontSize:7,alignment:"center" };
    arrayFilaTemp.push(obj);
    this.arrayChartReservas.barChartData.labels.forEach((resLabels:any) => {
      obj = { text: resLabels, bold: true,fontSize:7,alignment:"center" };
      arrayFilaTemp.push(obj);
      widthsTabla.push('*');
    });
    var obj = { text: "TOTAL", bold: true,fontSize:7,alignment:"center" };
    arrayFilaTemp.push(obj);


    var objCabecera = [
      ...arrayFilaTemp,
    ];
    arrayFila.push(objCabecera);


 
    this.arrayChartReservas.barChartData.datasets.forEach((resData:any) => {
    
      var arrayDataTemp = [];
      var obj = { text: resData.label, bold: false,fontSize:7,alignment:"left" };
      arrayDataTemp.push(obj);
      var totalEstudiantes = 0;
      resData.data.forEach((resNumero) => {
        totalEstudiantes = totalEstudiantes + resNumero;
        obj = { text: resNumero, bold: false,fontSize:7,alignment:"center" };
        arrayDataTemp.push(obj);
      });
      obj = { text: totalEstudiantes, bold: false,fontSize:7,alignment:"center" };
      arrayDataTemp.push(obj);
      var objData = [
        ...arrayDataTemp,
      ];
      arrayFila.push(objData);
    });
    


    console.log(arrayFila);

    var image = new Image();
    image.src = this.canvasReservas.nativeElement.toDataURL("image/png", 1.0); 
    var rutaFotoChart = image.src;
 
    var colorTexto = "#000000";
    //var colorTexto = "#870089";
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
                alignment:"left",
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
        text: '\n',
      },
      {
        text: 'REPORTE DE RESERVACIÓN DE LABORATORIO',
        fontSize:16,
        alignment:'left',
        bold: true
      },
      {
        text: '\n',
      },
      {
          table: {
          headerRows: 1,
          widths: [ '*', '*'],
          border:true,
          body: [
            [ 
              {
                text: "Nombre del Laboratorio: ",
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
                text: "Responsable del Laboratorio: ",
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
          },
          ' fue reservado mensualmente por la cantidad de estudiantes detallados en el siguiente gráfico:',
        ],
        fontSize:14,
        alignment:'justify',
        lineHeight:1.5
      },
      {
        
        layout: 'lightHorizontalLines', // optional
        
        table: {
          headerRows: 1,
          widths: ['*'],
  
          body: [
            [ 
              
              {
                image: rutaFotoChart,
                alignment:"center",
                width:400,
                //height:70
              },
            ]
          ]
          
        }
      },
      {
        text: '\n\n',
      },
      {
        
        //layout: 'lightHorizontalLines', // optional
        
        table: {
          
          headerRows: 1,
          widths:widthsTabla,
          body: arrayFila
          
        }
      }


     
    ]
  };
 
 
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.open();
  }


  cargarChart(arrayReservaciones:any){
  
 
    this.arrayChartReservas = [];

      var labels = arrayReservaciones.arrayLabel;
      var data = [];
     
      arrayReservaciones.meses.forEach((meses:any) => {
        var arrayNumeroEstudiantes = [];
        var totalReservas = 0;
        meses.carrera.forEach((carrera:any) => {
      
          arrayNumeroEstudiantes.push(carrera.numeroEstudiantes);
          totalReservas = totalReservas+parseInt(carrera.numeroEstudiantes);
        });
        
        var objCarrera = {
          data:arrayNumeroEstudiantes,
          label:meses.nombreMes,
          totalReservas:totalReservas,
        };
        data.push(objCarrera);

      });

     
      var barChartData: ChartConfiguration<'bar'>['data'] = {
        labels: labels,
        datasets: data,
        
      };

      this.arrayChartReservas = {
        barChartData:barChartData
      };
      console.log(this.arrayChartReservas)
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

  async cargarReporteReservaciones(){
    console.log(this.selectedCarreras)
    console.log(this.fechaInicio)
    this.objLaboratorioSeleccionado = {
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
    
    if(this.fechaInicio == null || this.fechaInicio == ""){
      this.presentarMensaje("error","Alerta","Selecciona la fecha inicio")
    }else if(this.fechaFin == null || this.fechaFin == ""){
      this.presentarMensaje("error","Alerta","Selecciona la fecha fín")
    }else if(this.fechaInicio > this.fechaFin){
      this.presentarMensaje("error","Alerta","La fecha inicio no puede ser mayor a la fecha fín")
    }else if(this.selectedCarreras.length == 0){
      this.presentarMensaje("error","Alerta","Selecciona al menos una opción en carreras")
    }else if(this.idLaboratorio == "0"){
      this.presentarMensaje("error","Alerta","Selecciona un laboratorio")
    }else {
      var listaLaboratorioFiltro = this.arrayLaboratorios.filter((x:any)=>x.id.toString() === this.idLaboratorio)[0];
      this.objLaboratorioSeleccionado.id = listaLaboratorioFiltro.id;
      this.objLaboratorioSeleccionado.nombreLaboratorio = listaLaboratorioFiltro.nombreLaboratorio;
      this.objLaboratorioSeleccionado.descripcionLaboratorio = listaLaboratorioFiltro.descripcionLaboratorio,
      this.objLaboratorioSeleccionado.rutaFotoLaboratorio = listaLaboratorioFiltro.rutaFotoLaboratorio,
      this.objLaboratorioSeleccionado.nombreUnidad = listaLaboratorioFiltro.nombreUnidad;
      this.objLaboratorioSeleccionado.rutaFotoUnidad = listaLaboratorioFiltro.rutaFotoUnidad;
      this.objLaboratorioSeleccionado.nombreCarrera = listaLaboratorioFiltro.nombreCarrera;
      this.objLaboratorioSeleccionado.nombres = listaLaboratorioFiltro.nombres;
      this.objLaboratorioSeleccionado.apellidos = listaLaboratorioFiltro.apellidos;
      this.objLaboratorioSeleccionado.rutaFotoUsuario = listaLaboratorioFiltro.rutaFotoUsuario;
      this.getBase64ImageFromURL(this.rutaLogoEspam).subscribe(base64data => {
   
        var base64Image = "data:image/jpg;base64," + base64data;
        this.objLaboratorioSeleccionado.rutaLogoEspam = base64Image;
      });
      this.getBase64ImageFromURL(this.rutaLogoUnidad).subscribe(base64data=>{
        var base64Image = "data:image/jpg;base64," + base64data;
        this.objLaboratorioSeleccionado.rutaLogoUnidad = base64Image;
      });
      console.log(this.objLaboratorioSeleccionado)
      this.validarLoadingTabla = 'block';
      this.validarTabla = 'none';
     this._servicioReportes.cargarReporteReservaciones(this.selectedCarreras,this.fechaInicio,this.fechaFin,this.idLaboratorio).subscribe({
      next: (data:any) =>{
        if(data.validar == true){
          console.log(data.listaReservaciones)
          this.cargarChart(data.listaReservaciones);
        }else{
          this.presentarMensaje("error","Error",data.mensaje)
        }
        this.validarLoadingTabla = 'none';
        this.validarTabla = 'block';
      } ,
      error: (error) => {
        if(error.status == 0){
          this.validarLoadingTabla = 'none';
          this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
        }else{
          this.presentarMensaje("error","Error","Error interno de la App")
        } 
        
      },
    });
  }
 }


  async cargarUsuarios(){
    
    this._servicioUsuarios.cargarUsuarios().subscribe({
      next: (data:any) =>{
        if(data.validar == true){
          console.log(data)
          this.arrayUsuarios = data.listaUsuarios;
          this.arrayUsuarios.sort(function(a, b){
            if(a.apellidos < b.apellidos) { return -1; }
            if(a.apellidos > b.apellidos) { return 1; }
            return 0;
        })
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
    
 
  this._servicioLaboratorios.cargarLaboratoriosReporte().subscribe({
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
