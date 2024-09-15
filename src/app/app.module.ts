import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Necessário para ngModel
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';  // Corrigir o nome e a exportação
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptors';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './dashboard/header/header.component';
import { HomeComponent } from './dashboard/home/home.component';
import { SettingsComponent } from './dashboard/configuracao/settings.component';
import { PacientesComponent } from './dashboard/pacientes/pacientes.component';
import { MedicosComponent } from './dashboard/medicos/medicos.component';
import { ConsultasComponent } from './dashboard/consultas/consultas.component';
import { CpfPipe } from './pipes/cpf.pipe';
import { DatePipe } from './pipes/date.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditarPacienteComponent } from './dashboard/pacientes/editar-pacientes/editar-pacientes.component';
import { NgxMaskModule } from 'ngx-mask';
import { ContatosComponent } from './contatos/contatos.component';
import { PhoneMaskPipe } from './pipes/phone.pipe';
import { CadastraPacientesComponent } from './dashboard/pacientes/cadastrar-pacientes/cadastrar-pacientes.component';
import { DataGridComponent } from './dashboard/base/grid/data-grid.component';
import { AlertService } from './dashboard/base/alert/alert.service';
import { CadastraMedicosComponent } from './dashboard/medicos/cadastrar-medicos/cadastrar-medicos.component';
import { EditarMedicoComponent } from './dashboard/medicos/editar-medicos/editar-medicos.component';
import { UsuarioComponent } from './dashboard/usuarios/usuario.component';
import { CadastrarUsuariosComponent } from './dashboard/usuarios/cadastrar-usuarios/cadastrar-usuarios.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    HomeComponent,
    UsuarioComponent,
    SettingsComponent,
    DataGridComponent,
    PacientesComponent,
    MedicosComponent,
    ConsultasComponent,

    EditarPacienteComponent,
    CadastraPacientesComponent,

    CadastraMedicosComponent,
    EditarMedicoComponent,

    UsuarioComponent,
    CadastrarUsuariosComponent,

    CpfPipe,
    DatePipe,
    PhoneMaskPipe,
    ContatosComponent
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
