import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { PacientesComponent } from './dashboard/pacientes/pacientes.component';
import { MedicosComponent } from './dashboard/medicos/medicos.component';
import { ConsultasComponent } from './dashboard/consultas/consultas.component';
import { EditarPacienteComponent } from './dashboard/pacientes/editar-pacientes/editar-pacientes.component';
import { CadastraPacientesComponent } from './dashboard/pacientes/cadatrar-pacientes/cadastrar-pacientes.component';
import { CadastraMedicosComponent } from './dashboard/medicos/cadastrar-medicos/cadastrar-medicos.component';
import { EditarMedicoComponent } from './dashboard/medicos/editar-medicos/editar-medicos.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'prontuario', component: DashboardComponent, children:
      [
        { path: 'home', component: HomeComponent },
        { path: 'profile', component: ProfileComponent },
        { path: 'settings', component: SettingsComponent },

        { path: 'pacientes', component: PacientesComponent },
        { path: 'pacientes/editar/:id', component: EditarPacienteComponent },
        { path: 'pacientes/cadastrar', component: CadastraPacientesComponent }, 
        
        { path: 'medicos', component: MedicosComponent },
        { path: 'medicos/editar/:id', component: EditarMedicoComponent },
        { path: 'medicos/cadastrar', component: CadastraMedicosComponent }, 

        { path: 'consultas', component: ConsultasComponent },
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
