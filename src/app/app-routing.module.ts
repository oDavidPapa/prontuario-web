import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { UsuarioComponent } from './dashboard/usuarios/usuario.component';
import { SettingsComponent } from './dashboard/configuracao/settings.component';
import { PacientesComponent } from './dashboard/pacientes/pacientes.component';
import { MedicosComponent } from './dashboard/medicos/medicos.component';
import { ConsultasComponent } from './dashboard/consultas/consultas.component';
import { EditarPacienteComponent } from './dashboard/pacientes/editar-pacientes/editar-pacientes.component';
import { CadastraPacientesComponent } from './dashboard/pacientes/cadastrar-pacientes/cadastrar-pacientes.component';
import { EditarMedicoComponent } from './dashboard/medicos/editar-medicos/editar-medicos.component';
import { CadastrarUsuariosComponent } from './dashboard/usuarios/cadastrar-usuarios/cadastrar-usuarios.component';
import { EditarUsuariosComponent } from './dashboard/usuarios/editar-usuarios/editar-usuarios.component';
import { ManterConsultasComponent } from './dashboard/consultas/cadastrar-consultas/manter-consulta.component';
import { CadastraMedicosComponent } from './dashboard/medicos/cadastrar-medicos/cadastrar-medicos.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'prontuario', component: DashboardComponent, children:
      [
        { path: 'home', component: HomeComponent },
        { path: 'usuarios', component: UsuarioComponent },
        { path: 'usuarios/editar/:id', component: EditarUsuariosComponent },
        { path: 'usuarios/cadastrar', component: CadastrarUsuariosComponent },

        { path: 'configuracoes', component: SettingsComponent },

        { path: 'pacientes', component: PacientesComponent },
        { path: 'pacientes/editar/:id', component: EditarPacienteComponent },
        { path: 'pacientes/cadastrar', component: CadastraPacientesComponent },

        { path: 'medicos', component: MedicosComponent },
        { path: 'medicos/editar/:id', component: EditarMedicoComponent },
        { path: 'medicos/cadastrar', component: CadastraMedicosComponent },

        { path: 'consultas', component: ConsultasComponent },
        { path: 'consultas/cadastrar', component: ManterConsultasComponent },
        { path: 'consultas/editar/:id', component: ManterConsultasComponent },

        { path: '', redirectTo: 'home', pathMatch: 'full' }
      ]
  },
  { path: '**', redirectTo: '/login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
