import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { HomeComponent } from './views/dashboard/home/home.component';
import { UsuarioComponent } from './views/dashboard/usuarios/usuario.component';
import { PacientesComponent } from './views/dashboard/pacientes/pacientes.component';
import { MedicosComponent } from './views/dashboard/medicos/medicos.component';
import { ConsultasComponent } from './views/dashboard/consultas/consultas.component';
import { EditarPacienteComponent } from './views/dashboard/pacientes/editar-pacientes/editar-pacientes.component';
import { CadastraPacientesComponent } from './views/dashboard/pacientes/cadastrar-pacientes/cadastrar-pacientes.component';
import { EditarMedicoComponent } from './views/dashboard/medicos/editar-medicos/editar-medicos.component';
import { CadastrarUsuariosComponent } from './views/dashboard/usuarios/cadastrar-usuarios/cadastrar-usuarios.component';
import { EditarUsuariosComponent } from './views/dashboard/usuarios/editar-usuarios/editar-usuarios.component';
import { ManterConsultasComponent } from './views/dashboard/consultas/cadastrar-consultas/manter-consulta.component';
import { CadastraMedicosComponent } from './views/dashboard/medicos/cadastrar-medicos/cadastrar-medicos.component';
import { AgendamentosComponent } from './views/dashboard/agendamentos/agendamentos.component';
import { CadastrarAgendamentosComponent } from './views/dashboard/agendamentos/cadastrar-agendamentos/cadastrar-agendamentos.component';
import { EditarAgendamentosComponent } from './views/dashboard/agendamentos/editar-agendamentos/editar-agendamentos.component';

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

        { path: 'pacientes', component: PacientesComponent },
        { path: 'pacientes/editar/:id', component: EditarPacienteComponent },
        { path: 'pacientes/cadastrar', component: CadastraPacientesComponent },

        { path: 'medicos', component: MedicosComponent },
        { path: 'medicos/editar/:id', component: EditarMedicoComponent },
        { path: 'medicos/cadastrar', component: CadastraMedicosComponent },

        { path: 'agendamentos', component: AgendamentosComponent },
        { path: 'agendamentos/editar/:id', component: EditarAgendamentosComponent },
        { path: 'agendamentos/cadastrar', component: CadastrarAgendamentosComponent },

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
