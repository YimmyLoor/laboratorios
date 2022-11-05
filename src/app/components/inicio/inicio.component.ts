import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { SincronizarService } from 'src/app/servicios/sincronizar.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  objUsuario: any = null;
  arrayModulos:any[] = [];
  anchoPagina:any = 830;
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private appComponent:AppComponent
  ) { 
    this.anchoPagina = window.screen.width;
    console.log(this.anchoPagina)
    var listaUsuario:any = sessionStorage.getItem('objUsuario');
    this.objUsuario = JSON.parse(listaUsuario);
    var listaModulos:any = sessionStorage.getItem('listaModulos');
    var arrayModulos = JSON.parse(listaModulos);
    this.cargarNuevaListaModulos(arrayModulos);
   
    this.appComponent.sincronizar(this.objUsuario);
  }


  cargarNuevaListaModulos(arrayModulos:any[]){
    var arrayModulosTemp = [];
    var arrayModulosFiltroSinSubMenu = arrayModulos.filter((x:any)=>x.identificador != 4 && x.identificador != 5 && x.identificador != 11 && x.identificador != 14)
    var arrayModulosFiltroSubMenu = arrayModulos.filter((x:any)=>x.identificador == 4 || x.identificador == 5 || x.identificador == 11 || x.identificador == 14)

    arrayModulosFiltroSinSubMenu.forEach((res:any)=>{
      var objModulo = {
        descripcionModulo:res.descripcionModulo,
        orden:res.orden,
        ruta:res.ruta,
        icono:res.icono,
        arraySubMenu:[]
      };
      arrayModulosTemp.push(objModulo);
    });
    var arraySubMenuLaboratorio = [];
    arrayModulosFiltroSubMenu.forEach((res:any)=>{
      var objModulo = {
        descripcionModulo:res.descripcionModulo,
        orden:res.orden,
        ruta:res.ruta,
        icono:res.icono,
        arraySubMenu:[]
      };
      arraySubMenuLaboratorio.push(objModulo);
    });
    arraySubMenuLaboratorio.sort((a,b) =>a.orden - b.orden);
    if(arraySubMenuLaboratorio.length > 0){
      var objModulo = {
        descripcionModulo:"Laboratorios",
        orden:4,
        ruta:"#",
        icono:"fas fa-angle-left",
        arraySubMenu:arraySubMenuLaboratorio
      };
      arrayModulosTemp.push(objModulo);
    }
    arrayModulosTemp.sort((a,b) =>a.orden - b.orden);
    this.arrayModulos = arrayModulosTemp;
    console.log(this.arrayModulos)
    
  }
  

  ngOnInit(): void {
  }

  navegarLocal(ruta:any){
    this.router.navigate([ruta], {relativeTo:this.route});
    
  }

  navegar(item:any){
    console.log(item)
    this.router.navigate([item.ruta], {relativeTo:this.route});
    
  }

  cerrarSesion(){
    sessionStorage.removeItem('rolesAsignados');
    sessionStorage.removeItem('objUsuario');
    sessionStorage.removeItem('listaModulos');
    sessionStorage.removeItem('objRolUsuario');

    sessionStorage.removeItem('listaUnidades');
    sessionStorage.removeItem('listaLaboratorios');
    sessionStorage.removeItem('listaCarreras');
    sessionStorage.removeItem('listaDias');

    this.router.navigate(['login']);
  }


}
