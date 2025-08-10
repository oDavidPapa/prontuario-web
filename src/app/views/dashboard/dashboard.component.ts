import { Component } from '@angular/core';
import { JwtPayload } from '../interceptors/jwt-payload';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private router: Router) { }

  roles: string[] = [];
  nomeUsuario: string = ''
  loginUsuario: string = ''

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      this.roles = decoded.roles || [];
      this.loginUsuario = decoded.sub || '';
      this.nomeUsuario = decoded.nome || '';
    }
  }

  hasRole(...roles: string[]): boolean {
    return roles.some(role => this.roles.includes(role));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    this.router.navigate(['/login']);
  }

  editarPerfil() {
    this.router.navigate(['/prontuario/editar-perfil']);
  }
}
