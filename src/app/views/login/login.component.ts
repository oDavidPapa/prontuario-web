import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRequest } from '../../models/authentication-request';
import { AuthService } from '../../services/auth.service';
import { catchError, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string | null = null; 


  constructor(private router: Router,
    private authService: AuthService
  ) {
    localStorage.removeItem('token');
  }

  onSubmit() {
    const authRequest: AuthRequest = {
      login: this.username,
      senha: this.password
    };

    this.authService.login(authRequest).pipe(
      tap(response => {
        if (response?.token) {
          this.storeToken(response.token);

          const decoded: any = jwtDecode(response.token);
          localStorage.setItem('roles', JSON.stringify(decoded.roles || decoded.authorities || []));

          this.redirectToDashboard();
        } else {
          this.loginError = 'Usuário ou senha incorretos.';
        }
      }),
      catchError(error => {
        // Em caso de erro (ex: 401)
        this.loginError = 'Usuário ou senha incorretos.';
        return of(null);
      })
    ).subscribe();
  }

  private redirectToDashboard(): void {
    this.router.navigate(['/prontuario']);
  }

  private storeToken(token: string): void {
    localStorage.setItem('token', token);
  }
}
