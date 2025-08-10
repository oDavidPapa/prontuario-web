import { Component } from '@angular/core';
import { JwtPayload } from '../interceptors/jwt-payload';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  roles: string[] = [];

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      this.roles = decoded.roles || [];
    }
  }
  
  hasRole(...roles: string[]): boolean {
    return roles.some(role => this.roles.includes(role));
  }
}
