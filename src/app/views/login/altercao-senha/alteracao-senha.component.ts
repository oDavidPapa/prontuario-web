import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../dashboard/base/alert/alert.service';

@Component({
    selector: 'app-alteracao-senha',
    templateUrl: './alteracao-senha.component.html',
    styleUrls: ['./alteracao-senha.component.css']
})
export class AlteracaoSenhaComponent implements OnInit {
    passwordForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private alertService: AlertService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordsMatch });
    }

    private passwordsMatch(control: AbstractControl): ValidationErrors | null {
        const newPassword = control.get('newPassword')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
        return newPassword === confirmPassword ? null : { passwordMismatch: true };
    }

    onSubmit(): void {
        if (this.passwordForm.invalid) {
            if (this.passwordForm.errors?.['passwordMismatch']) {
                this.alertService.error('Erro!', 'As senhas não conferem.');
            } else {
                this.alertService.error('Erro!', 'Por favor, preencha todos os campos corretamente.');
            }
            return;
        }
        const { currentPassword, newPassword } = this.passwordForm.value;
        this.authService.changePassword({ currentPassword, newPassword }).pipe(
            tap(() => {
                this.alertService.success('Sucesso!', 'Senha alterada com sucesso!');
                this.passwordForm.reset();
                setTimeout(() => this.router.navigate(['/login']), 2000);
            }),
            catchError(() => {
                this.alertService.error('Erro!', 'Não foi possível alterar a senha. Verifique seus dados e tente novamente.');
                return of(null);
            })
        ).subscribe();
    }
}
