import { Component, OnInit } from '@angular/core';
import { ConfigurarLaboratorioService } from 'src/app/servicios/configurar-laboratorio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configurarlaboratoriosadmin',
  templateUrl: './configurarlaboratoriosadmin.component.html',
  styleUrls: ['./configurarlaboratoriosadmin.component.css']
})
export class ConfigurarlaboratoriosadminComponent implements OnInit {

  arrayDias:any[] = [];
  arrayUnidades:any[] = [];
  arrayLaboratorios:any[] = [];
  arrayLaboratoriosView:any[] = [];
  arrayConfiguracionView:any = {};
  arrayConfiguracionLaboratorioServidor: any[] = [];
  idUnidad:any = "0";
  idLaboratorio:any = "0";

  horaInicio:any = "00:00";
  horaFin:any = "00:00";
  intervalo:any = "00:00";
  validarReservadoGeneral: boolean = false;
  objUsuario: any;
  objRolUsuario: any;
  validarLoading:any = 0;
  validarLoadingTabla:any = 0;
  constructor(
    private _servicioConfigurarLaboratorio:ConfigurarLaboratorioService
  ) {
    this.objUsuario = JSON.parse(sessionStorage.getItem('objUsuario'));
    this.objRolUsuario = JSON.parse(sessionStorage.getItem('objRolUsuario'));
   }

  ngOnInit(): void {
  }

  ngAfterContentInit(){
    var listaDias:any = sessionStorage.getItem('listaDias');
    this.arrayDias = JSON.parse(listaDias);
    var listaUnidades:any = sessionStorage.getItem('listaUnidades');
    this.arrayUnidades = JSON.parse(listaUnidades);
    var listaLaboratorios:any = sessionStorage.getItem('listaLaboratorios');
    this.arrayLaboratorios = JSON.parse(listaLaboratorios);
    if(this.objRolUsuario.identificadorRol == 3){
      this.arrayLaboratorios = this.arrayLaboratorios.filter((x:any)=>x.activo === 1 && x.idUsuario === this.objUsuario.id);
    }
  }

  noSeleccionarTodoPorDia(event:any){
   /*  var idDia =  event.target.value;
    if(event.target.checked){
      this.arrayConfiguracionView.horasCuerpo.forEach((res:any, indexHorasCuerpo:any) =>{
          const indexHora = this.arrayConfiguracionView.horasCuerpo[indexHorasCuerpo].horas.findIndex((x:any)=>x.id.toString() === idDia.toString());
          if(indexHora != -1){
            this.arrayConfiguracionView.horasCuerpo[indexHorasCuerpo].horas[indexHora].checked = true;
          }
      });
    }else{
      this.arrayConfiguracionView.horasCuerpo.forEach((res:any, indexHorasCuerpo:any) =>{
        const indexHora = this.arrayConfiguracionView.horasCuerpo[indexHorasCuerpo].horas.findIndex((x:any)=>x.id.toString() === idDia.toString());
        if(indexHora != -1){
          this.arrayConfiguracionView.horasCuerpo[indexHorasCuerpo].horas[indexHora].checked = false;
        }
    });
    } */
  }

  seleccionarTodoPorDia(event:any){
    var idDia =  event.target.value;
    if(event.target.checked){
      this.arrayConfiguracionView.horasCuerpo.forEach((res:any, indexHorasCuerpo:any) =>{
          const indexHora = this.arrayConfiguracionView.horasCuerpo[indexHorasCuerpo].horas.findIndex((x:any)=>x.id.toString() === idDia.toString() && x.validarReservado === false);
          if(indexHora != -1){
            this.arrayConfiguracionView.horasCuerpo[indexHorasCuerpo].horas[indexHora].checked = true;
          }
      });
    }else{
      this.arrayConfiguracionView.horasCuerpo.forEach((res:any, indexHorasCuerpo:any) =>{
        const indexHora = this.arrayConfiguracionView.horasCuerpo[indexHorasCuerpo].horas.findIndex((x:any)=>x.id.toString() === idDia.toString() && x.validarReservado === false);
        if(indexHora != -1){
          this.arrayConfiguracionView.horasCuerpo[indexHorasCuerpo].horas[indexHora].checked = false;
        }
    });
    }
  }

  async guardarConfiguracionLaboratorio(){
    var arrayConfiguracionGuardar:any[] = [];
    this.arrayConfiguracionView.horasCuerpo.forEach((res:any)=>{
      var arrayFiltro = res.horas.filter((x:any)=>x.checked === true);
      if(arrayFiltro.length > 0){
        var objGuardar = {
          horasChekeadas:arrayFiltro
        };
        arrayConfiguracionGuardar.push(objGuardar);
      }
      

    });
    if(this.idLaboratorio == "0"){
      this.presentarMensaje("error","Error","Selecciona un laboratorio")
    }else if(arrayConfiguracionGuardar.length == 0){
      this.presentarMensaje("error","Error","Selecciona al menos 1 horario")
    }else{
      this.validarLoading = 1;
      this._servicioConfigurarLaboratorio.guardarConfigurarLaboratorio(this.idLaboratorio,this.horaInicio,this.horaFin,this.intervalo,arrayConfiguracionGuardar).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            this.arrayConfiguracionLaboratorioServidor = data.listaConfigurarLaboratorio;
            this.cargarHorarioConfigurarLaboratorio(this.arrayConfiguracionLaboratorioServidor);
            this.presentarMensaje("success","Correcto","Laboratorio guardado exitosamente")
          }else{
            this.presentarMensaje("error","Error",data.mensaje)
            
          }
          this.validarLoading = 0;
        } ,
        error: (error) => {
          this.validarLoading = 0;
          if(error.status == 0){
            this.presentarMensaje("error","Error","No se puede comunicar con el servidor")
          }else{
            this.presentarMensaje("error","Error","Error interno de la App")
          } 
        },
      });
      
    } 
 }

  async filtrarConfiguracionLaboratorio(){
    
    if(this.idLaboratorio == "0"){
      this.validarLoadingTabla = 0;
      this.arrayConfiguracionView = [];
      this.horaInicio = "00:00";
      this.horaFin = "00:00";
      this.intervalo = "00:00";
     // this.presentarMensaje("error","Error","Selecciona un laboratorio")
    }else{
      this.validarLoadingTabla = 1;
      this._servicioConfigurarLaboratorio.filtrarConfigurarLaboratorio(this.idLaboratorio).subscribe({
        next: (data:any) =>{
          console.log(data)
          if(data.validar == true){
            if(data.listaCabeceraConfigurarLaboratorio != null){
              this.validarReservadoGeneral = data.validarReservadoGeneral;
              this.horaInicio = data.listaCabeceraConfigurarLaboratorio.horaInicio;
              this.horaFin = data.listaCabeceraConfigurarLaboratorio.horaFin;
              this.intervalo = data.listaCabeceraConfigurarLaboratorio.intervalo;
              this.arrayConfiguracionLaboratorioServidor = data.listaConfigurarLaboratorio;
              this.cargarHorarioConfigurarLaboratorio(this.arrayConfiguracionLaboratorioServidor);
            }else{
              this.validarReservadoGeneral = data.validarReservadoGeneral;
              this.arrayConfiguracionLaboratorioServidor = [];
              this.arrayConfiguracionView = [];
              this.horaInicio = "00:00";
              this.horaFin = "00:00";
              this.intervalo = "00:00";
              //this.cargarHorarioConfigurarLaboratorio(this.arrayConfiguracionLaboratorioServidor);
            }
            //this.presentarMensaje("success","Correcto","Laboratorio guardado exitosamente")
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
 }





  filtrarLaboratorios(){
    this.idLaboratorio = "0";
    this.arrayLaboratoriosView = this.arrayLaboratorios.filter(x=>x.idUnidad.toString() === this.idUnidad.toString());
    this.arrayConfiguracionView = [];
   

  }

  cargarHorarioConfigurarLaboratorio(arrayConfigurarLaboratorioServidor:any[]){
    this.arrayConfiguracionView = [];
    console.log(arrayConfigurarLaboratorioServidor);
    if(sessionStorage.getItem('listaConfigurarLaboratorios')){

    }else{
      var horaInicioComparar = this.horaInicio.replace(":","");
      var horaFinComparar = this.horaFin.replace(":","");
      if(this.horaInicio == null || this.horaInicio == "" || this.horaInicio == "00:00"){
        this.presentarMensaje("error","Alerta","Ingresa la hora inicio");
      }else if(this.horaFin == null || this.horaFin == "" || this.horaFin == "00:00"){
        this.presentarMensaje("error","Alerta","Ingresa la hora fín");
      }else  if(this.intervalo == null || this.intervalo == "" || this.intervalo == "00:00"){
        this.presentarMensaje("error","Alerta","Ingresa el intérvalo");
      }else if(horaInicioComparar >= horaFinComparar){
        this.presentarMensaje("error","Alerta","La hora inicio no debe ser mayor o igual a la hora fin");
      }else{
        var horaInicioTemp = this.horaInicio.split(':');
        var inicioH = parseInt(horaInicioTemp[0]);
        var inicioM = parseInt(horaInicioTemp[1]);
        var horaFinTemp = this.horaFin.split(':');
        var finH = parseInt(horaFinTemp[0]);
        var finM = parseInt(horaFinTemp[1]);

        var horaIntervaloTemp = this.intervalo.split(':');
        var intervaloH = parseInt(horaIntervaloTemp[0]);
        var intervaloM = parseInt(horaIntervaloTemp[1]);

        var horaInicioSegundos = inicioH*60*60;
        var minutosInicioSegundos = inicioM * 60;
        var totalSegundosInicio = horaInicioSegundos + minutosInicioSegundos;
        //hora fin segundos
        var horaFinSegundos = finH*60*60;
        var minutosFinSegundos = finM * 60;
        var totalSegundosFin = horaFinSegundos + minutosFinSegundos;
        //var hora = 3600;
        var horaIntervaloSegundos = intervaloH*60*60;
        var minutosIntervaloSegundos = intervaloM * 60;
        var totalSegundosIntervalo = horaIntervaloSegundos + minutosIntervaloSegundos;
        //var totalSegundosSumar = totalSegundosInicio + totalSegundosIntervalo;
        var sumatoriaSegundos = 0;
        var sumatoriaSegundosFin = totalSegundosInicio;
        //for (let i = inicioH; i <= finH; i=i+intervaloH) {
        var i = 0;
        var arrayHoras:any[] = [];
        
        while (sumatoriaSegundos < totalSegundosFin) {
          if(i == 0){
            sumatoriaSegundos = totalSegundosInicio;
          }else{
            sumatoriaSegundos = sumatoriaSegundos + (totalSegundosIntervalo);
          }
          sumatoriaSegundosFin = sumatoriaSegundosFin + (totalSegundosIntervalo);

          var hora = parseInt( (sumatoriaSegundos / 3600).toString() ) % 24;
          var minutos = parseInt( (sumatoriaSegundos / 60).toString() ) % 60;
 

          var horaFin = parseInt( (sumatoriaSegundosFin / 3600).toString() ) % 24;
          var minutosFin = parseInt( (sumatoriaSegundosFin / 60).toString() ) % 60;
         

          var horaInicio = "00";
          var minutoInicio = "00";
          if(hora.toString().length == 1){
            horaInicio = "0"+hora.toString();
          }else{
            horaInicio = hora.toString();
          }
          if(minutos.toString().length == 1){
            minutoInicio = "0"+minutos.toString();
          }else{
            minutoInicio = minutos.toString();
          }


          var horaFin2 = "00";
          var minutosFin2 = "00";
          if(horaFin.toString().length == 1){
            horaFin2 = "0"+horaFin.toString();
          }else{
            horaFin2 = horaFin.toString();
          }
          if(minutosFin.toString().length == 1){
            minutosFin2 = "0"+minutosFin.toString();
          }else{
            minutosFin2 = minutosFin.toString();
          }

          var horaInicioFinal = horaInicio+':'+minutoInicio;
          var horaFinFinal = horaFin2+':'+minutosFin2;

          var arrayHorasTemp:any = [];
          var checkedDias = false;
          if(arrayConfigurarLaboratorioServidor.length > 0){
            this.arrayDias.forEach(res=>{
              var checked = false;
              var colorFondo = "#FFFFFF";
              var listaConfigurarLaboratorioFiltro = arrayConfigurarLaboratorioServidor.filter((x:any)=>x.idDia.toString() === res.id.toString() && x.horaInicio === horaInicioFinal && x.horaFin === horaFinFinal);
              var validarReservado = false;
              if(listaConfigurarLaboratorioFiltro.length > 0){
               
                var listaConfigurarLaboratorioReservado = listaConfigurarLaboratorioFiltro.filter((x:any)=>x.validarReservado == true);
                if(listaConfigurarLaboratorioReservado.length > 0){
                  console.log(listaConfigurarLaboratorioFiltro);
                  validarReservado = true;
                }
                checked = true;
                colorFondo = "#CEE3FF";
              }
              var objHora = {
                ...res,
                horaInicio:horaInicioFinal,
                horaFin:horaFinFinal,
                checked:checked,
                colorFondo:colorFondo,
                validarReservado:validarReservado
              }
              arrayHorasTemp.push(objHora)
            });
          }else{
            checkedDias = true;
            this.arrayDias.forEach(res=>{
              var checked = true;
              var colorFondo = "#FFFFFF";
              if(res.identificadorDia == 6 || res.identificadorDia == 0){
                checked = false;
              }
              var objHora = {
                ...res,
                horaInicio:horaInicioFinal,
                horaFin:horaFinFinal,
                checked:checked,
                colorFondo:colorFondo,
                validarReservado:false
              }
              arrayHorasTemp.push(objHora)
            });
          }
          


          var objGuardar = {
            horas:arrayHorasTemp
          };
          arrayHoras.push(objGuardar);

          i++;
        }
        var totalRegistrosChecked = arrayHoras.length;
     
        
        


        var arrayDias2:any[] = [];
        this.arrayDias.forEach((res:any)=>{
          if(this.arrayConfiguracionLaboratorioServidor.length == 0){
            checkedDias = true;
            if(res.identificadorDia == 6 || res.identificadorDia == 0){
              checkedDias = false;
            } 
          }else{
            var listaPorDiaServidor = this.arrayConfiguracionLaboratorioServidor.filter((x:any)=>x.idDia.toString() === res.id.toString());
            var totalRegistrosCheckedServidor = listaPorDiaServidor.length;
    

            if(totalRegistrosCheckedServidor == totalRegistrosChecked){
              checkedDias = true;
            }else{
              checkedDias = false;
            }
          }
          
          var objGuardarDias = {
              ...res,  
              checked:checkedDias
            };
            arrayDias2.push(objGuardarDias);
          
        });

        this.arrayConfiguracionView ={
          diasCabecera:arrayDias2,
          horasCuerpo:arrayHoras
        };  
      } 
    }
   
  }


  async presentarMensaje(tipo:any,titulo:string,mensaje:string){
    Swal.fire(
      titulo,
      mensaje,
      tipo,
    )
   }
}
