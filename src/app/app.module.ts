import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { UnidadesadminComponent } from './components/admin/unidadesadmin/unidadesadmin.component';
import { LoginrolComponent } from './components/loginrol/loginrol.component';
import { UsuariosadminComponent } from './components/admin/usuariosadmin/usuariosadmin.component';
import { RolesadminComponent } from './components/admin/rolesadmin/rolesadmin.component';
import { LaboratoriosadminComponent } from './components/admin/laboratoriosadmin/laboratoriosadmin.component';
import { ReservacionesadminComponent } from './components/admin/reservacionesadmin/reservacionesadmin.component';
import { DataTablesModule } from 'angular-datatables';
import { ConfigurarlaboratoriosadminComponent } from './components/admin/configurarlaboratoriosadmin/configurarlaboratoriosadmin.component';
import { ReservacionesdocenteComponent } from './components/docente/reservacionesdocente/reservacionesdocente.component';
import { ImageCropperModule }  from 'ngx-image-cropper';
import { PerfilComponent } from './components/perfil/perfil.component';
import { BanneradminComponent } from './components/admin/banneradmin/banneradmin.component';
import { NoticiasadminComponent } from './components/admin/noticiasadmin/noticiasadmin.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { ReservacionesencargadoComponent } from './components/encargado/reservacionesencargado/reservacionesencargado.component';
import { MaterialesencargadoComponent } from './components/encargado/materialesencargado/materialesencargado.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ReportesadminComponent } from './components/admin/reportesadmin/reportesadmin.component';
import { CarrerasadminComponent } from './components/admin/carrerasadmin/carrerasadmin.component';
import { ArchivosadminComponent } from './components/admin/archivosadmin/archivosadmin.component';
import { DetallereservacionesdocenteComponent } from './components/docente/detallereservacionesdocente/detallereservacionesdocente.component';
import { NgChartsModule } from 'ng2-charts';
import { NgSelectModule } from '@ng-select/ng-select';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
]);


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    UnidadesadminComponent,
    LoginrolComponent,
    UsuariosadminComponent,
    RolesadminComponent,
    LaboratoriosadminComponent,
    ReservacionesadminComponent,
    ConfigurarlaboratoriosadminComponent,
    ReservacionesdocenteComponent,
    PerfilComponent,
    BanneradminComponent,
    NoticiasadminComponent,
    ReservacionesencargadoComponent,
    MaterialesencargadoComponent,
    ReportesadminComponent,
    CarrerasadminComponent,
    ArchivosadminComponent,
    DetallereservacionesdocenteComponent,
  ],
  imports: [
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    ImageCropperModule,
    CKEditorModule,
    FullCalendarModule,
    NgbModule,
    NgChartsModule,
    
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
