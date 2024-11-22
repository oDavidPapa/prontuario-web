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
import { EditarMedicoComponent } from './dashboard/medicos/editar-medicos/editar-medicos.component';
import { UsuarioComponent } from './dashboard/usuarios/usuario.component';
import { CadastrarUsuariosComponent } from './dashboard/usuarios/cadastrar-usuarios/cadastrar-usuarios.component';
import { EditarUsuariosComponent } from './dashboard/usuarios/editar-usuarios/editar-usuarios.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PacienteResumoComponent } from './dashboard/pacientes/resumo-paciente/paciente-resumo.component';
import { CadastraMedicosComponent } from './dashboard/medicos/cadastrar-medicos/cadastrar-medicos.component';
import { ManterConsultasComponent } from './dashboard/consultas/cadastrar-consultas/manter-consulta.component';
import { EnderecoComponent } from './endereco/endereco.component';
import { AlergiaPacienteComponent } from './dashboard/pacientes/alergia-paciente/alergia-paciente.component';


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
    PacienteResumoComponent,
    AlergiaPacienteComponent,
    
    MedicosComponent,

    ConsultasComponent,
    ManterConsultasComponent,

    EditarPacienteComponent,
    CadastraPacientesComponent,

    CadastraMedicosComponent,
    EditarMedicoComponent,

    UsuarioComponent,
    CadastrarUsuariosComponent,
    EditarUsuariosComponent,

    EnderecoComponent,

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
    NgxMaskModule.forRoot(),
    NgSelectModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
