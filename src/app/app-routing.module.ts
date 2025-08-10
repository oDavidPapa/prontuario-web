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
import { roleGuard } from './views/interceptors/role-guard';
import { RecuperarSenhaRequestComponent } from './views/login/recuperacao-senha/recuperacao-senha.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaRequestComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'prontuario', component: DashboardComponent, children:
      [
        { path: 'home', component: HomeComponent, canActivate: [roleGuard], data: { roles: ['MEDICO', 'ADMINISTRATIVO'] } },
        { path: 'usuarios', component: UsuarioComponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRATIVO'] } },
        { path: 'usuarios/editar/:id', component: EditarUsuariosComponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRATIVO'] } },
        { path: 'usuarios/cadastrar', component: CadastrarUsuariosComponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRATIVO'] } },

        { path: 'pacientes', component: PacientesComponent, canActivate: [roleGuard], data: { roles: ['MEDICO', 'ADMINISTRATIVO'] } },
        { path: 'pacientes/editar/:id', component: EditarPacienteComponent, canActivate: [roleGuard], data: { roles: ['MEDICO', 'ADMINISTRATIVO'] } },
        { path: 'pacientes/cadastrar', component: CadastraPacientesComponent, canActivate: [roleGuard], data: { roles: ['MEDICO', 'ADMINISTRATIVO'] } },

        { path: 'medicos', component: MedicosComponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRATIVO'] } },
        { path: 'medicos/editar/:id', component: EditarMedicoComponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRATIVO'] } },
        { path: 'medicos/cadastrar', component: CadastraMedicosComponent, canActivate: [roleGuard], data: { roles: ['ADMINISTRATIVO'] } },

        { path: 'agendamentos', component: AgendamentosComponent, canActivate: [roleGuard], data: { roles: ['MEDICO', 'ADMINISTRATIVO'] } },
        { path: 'agendamentos/editar/:id', component: EditarAgendamentosComponent, canActivate: [roleGuard], data: { roles: ['MEDICO', 'ADMINISTRATIVO'] } },
        { path: 'agendamentos/cadastrar', component: CadastrarAgendamentosComponent, canActivate: [roleGuard], data: { roles: ['MEDICO', 'ADMINISTRATIVO'] } },

        { path: 'consultas', component: ConsultasComponent, canActivate: [roleGuard], data: { roles: ['MEDICO',] } },
        { path: 'consultas/cadastrar', component: ManterConsultasComponent, canActivate: [roleGuard], data: { roles: ['MEDICO',] } },
        { path: 'consultas/editar/:id', component: ManterConsultasComponent, canActivate: [roleGuard], data: { roles: ['MEDICO',] } },

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
