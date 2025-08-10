import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './views/interceptors/auth.interceptors';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { HeaderComponent } from './views/dashboard/header/header.component';
import { HomeComponent } from './views/dashboard/home/home.component';
import { PacientesComponent } from './views/dashboard/pacientes/pacientes.component';
import { MedicosComponent } from './views/dashboard/medicos/medicos.component';
import { ConsultasComponent } from './views/dashboard/consultas/consultas.component';
import { CpfPipe } from './pipes/cpf.pipe';
import { DatePipe } from './pipes/date.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditarPacienteComponent } from './views/dashboard/pacientes/editar-pacientes/editar-pacientes.component';
import { NgxMaskModule } from 'ngx-mask';
import { ContatosComponent } from './views/contatos/contatos.component';
import { PhoneMaskPipe } from './pipes/phone.pipe';
import { CadastraPacientesComponent } from './views/dashboard/pacientes/cadastrar-pacientes/cadastrar-pacientes.component';
import { DataGridComponent } from './views/dashboard/base/grid/data-grid.component';
import { AlertService } from './views/dashboard/base/alert/alert.service';
import { EditarMedicoComponent } from './views/dashboard/medicos/editar-medicos/editar-medicos.component';
import { UsuarioComponent } from './views/dashboard/usuarios/usuario.component';
import { CadastrarUsuariosComponent } from './views/dashboard/usuarios/cadastrar-usuarios/cadastrar-usuarios.component';
import { EditarUsuariosComponent } from './views/dashboard/usuarios/editar-usuarios/editar-usuarios.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PacienteResumoComponent } from './views/dashboard/pacientes/resumo-paciente/paciente-resumo.component';
import { CadastraMedicosComponent } from './views/dashboard/medicos/cadastrar-medicos/cadastrar-medicos.component';
import { ManterConsultasComponent } from './views/dashboard/consultas/cadastrar-consultas/manter-consulta.component';
import { EnderecoComponent } from './views/endereco/endereco.component';
import { AlergiaPacienteComponent } from './views/dashboard/pacientes/alergia-paciente/alergia-paciente.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CidCadastroComponent } from './views/dashboard/pacientes/cid-cadastro-paciente/cadastro-cid.component';
import { CadastrarAgendamentosComponent } from './views/dashboard/agendamentos/cadastrar-agendamentos/cadastrar-agendamentos.component';
import { AgendamentosComponent } from './views/dashboard/agendamentos/agendamentos.component';
import { EditarAgendamentosComponent } from './views/dashboard/agendamentos/editar-agendamentos/editar-agendamentos.component';
import { DatetimePipe } from './pipes/date-time.pipe';
import { MedicamentoCadastroComponent } from './views/dashboard/consultas/prescricao-medicamento/cadastro-medicamento.component';
import { ExameConsultaComponent } from './views/dashboard/consultas/exame/exame-consulta.component';
import { UploadArquivoComponent } from './views/dashboard/consultas/arquivo/upload-arquivo.component';
import { ResumoComponent } from './views/dashboard/consultas/resumo/resumo.component';
import { PaginationControlComponent } from './views/dashboard/base/pagination/pagination-control.component';
import { FilterComponent } from './views/dashboard/base/filter/filter.component';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RecuperarSenhaRequestComponent } from './views/login/recuperacao-senha/recuperacao-senha.component';
import { AlteracaoSenhaComponent } from './views/login/altercao-senha/alteracao-senha.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    HomeComponent,
    UsuarioComponent,
    DataGridComponent,
    PacientesComponent,
    PacienteResumoComponent,
    AlergiaPacienteComponent,
    ExameConsultaComponent,
    UploadArquivoComponent,
    ResumoComponent,
    PaginationControlComponent,

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
    FilterComponent,

    CpfPipe,
    DatePipe,
    DatetimePipe,
    PhoneMaskPipe,
    ContatosComponent,
    CidCadastroComponent,
    MedicamentoCadastroComponent,

    AgendamentosComponent,
    CadastrarAgendamentosComponent,
    EditarAgendamentosComponent,
    RecuperarSenhaRequestComponent,
    AlteracaoSenhaComponent,

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
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
    , AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
