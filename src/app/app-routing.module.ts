import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivosadminComponent } from './components/admin/archivosadmin/archivosadmin.component';
import { BanneradminComponent } from './components/admin/banneradmin/banneradmin.component';
import { CarrerasadminComponent } from './components/admin/carrerasadmin/carrerasadmin.component';
import { ConfigurarlaboratoriosadminComponent } from './components/admin/configurarlaboratoriosadmin/configurarlaboratoriosadmin.component';
import { LaboratoriosadminComponent } from './components/admin/laboratoriosadmin/laboratoriosadmin.component';
import { NoticiasadminComponent } from './components/admin/noticiasadmin/noticiasadmin.component';
import { ReportesadminComponent } from './components/admin/reportesadmin/reportesadmin.component';
import { ReservacionesadminComponent } from './components/admin/reservacionesadmin/reservacionesadmin.component';
import { RolesadminComponent } from './components/admin/rolesadmin/rolesadmin.component';
import { UnidadesadminComponent } from './components/admin/unidadesadmin/unidadesadmin.component';
import { UsuariosadminComponent } from './components/admin/usuariosadmin/usuariosadmin.component';
import { DetallereservacionesdocenteComponent } from './components/docente/detallereservacionesdocente/detallereservacionesdocente.component';
import { ReservacionesdocenteComponent } from './components/docente/reservacionesdocente/reservacionesdocente.component';
import { MaterialesencargadoComponent } from './components/encargado/materialesencargado/materialesencargado.component';
import { ReservacionesencargadoComponent } from './components/encargado/reservacionesencargado/reservacionesencargado.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { LoginrolComponent } from './components/loginrol/loginrol.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { LoginGuard } from './guards/login.guard';
import { LoginrolGuard } from './guards/loginrol.guard';
import { LogoutGuard } from './guards/logout.guard';


const routes: Routes = [
  { 
    path: '', 
    component: LoginComponent,
    canActivate:[LogoutGuard]
  },
  { 
    path: 'login', component: LoginComponent,
    canActivate:[LogoutGuard]
  
  },
  { 
    path: 'loginrol', component: LoginrolComponent,
    canActivate:[LoginrolGuard]
  
  },
  { 
    path: 'unidadesadmin', component: UnidadesadminComponent,
    canActivate:[LoginGuard]
  },
  { 
    path: 'inicio', 
    component: InicioComponent,
    canActivate:[LoginGuard],
    children: [
      {
        path:'unidadesadmin', component: UnidadesadminComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'usuariosadmin', component: UsuariosadminComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'rolesadmin', component: RolesadminComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'laboratoriosadmin', component: LaboratoriosadminComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'configurarlaboratoriosadmin', component: ConfigurarlaboratoriosadminComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'reservacionesadmin', component: ReservacionesadminComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'reservacionesdocente', component: ReservacionesdocenteComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'perfil', component: PerfilComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'banneradmin', component: BanneradminComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'noticiasadmin', component: NoticiasadminComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'reservacionesencargado', component: ReservacionesencargadoComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'materialesencargado', component: MaterialesencargadoComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'reportesadmin', component: ReportesadminComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'carrerasadmin', component: CarrerasadminComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'archivosadmin', component: ArchivosadminComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'detallereservacionesdocente', component: DetallereservacionesdocenteComponent,
        canActivate:[LoginGuard]
      },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
