import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRequest } from '../models/authentication-request';
import { AuthService } from '../services/auth.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router,
    private authService: AuthService
  ) { 
    localStorage.removeItem('token'); // Substitua 'token' pelo nome da chave usada
  }

  onSubmit() {
    const authRequest: AuthRequest = {
      login: this.username,
      senha: this.password
    };

    this.authService.login(authRequest).pipe(
      catchError(error => {
        console.error(error)
        return of(null);
      })
    ).subscribe(response => {
      if (response.token) {
        this.storeToken(response.token);
        this.redirectToDashboard();
      }
    })
  }

  private redirectToDashboard(): void {
    this.router.navigate(['/prontuario']);
  }

  private storeToken(token: string): void {
    localStorage.setItem('token', token);
    console.log('Token armazenado:', token);
  }
}
