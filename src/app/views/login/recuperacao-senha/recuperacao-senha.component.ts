import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-recuperacao-senha',
    templateUrl: './recuperacao-senha.component.html',
    styleUrls: ['./recuperacao-senha.component.css']
})
export class RecuperarSenhaRequestComponent {
    email: string = '';
    message: string | null = null;
    error: string | null = null;

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        this.message = null;
        this.error = null;

        this.authService.requestPasswordReset(this.email).pipe(
            catchError(err => {
                this.error = 'Erro ao enviar o link. Tente novamente.';
                return of(null);
            })
        ).subscribe(response => {
            if (response?.success) {
                this.message = 'Se o e-mail estiver cadastrado em nossa base, você receberá um link para redefinir sua senha.';
            } else {
                this.error = 'Não foi possível processar sua solicitação. Por favor, tente novamente mais tarde.';
            }
        });
    }

    goBack() {
        this.router.navigate(['/login']);
    }
}