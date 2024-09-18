import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { AlertService } from '../../base/alert/alert.service';
import { MedicoService } from '../../../services/medico.service';
import { MedicoOptions } from '../../../options/medico.option';
import { Medico } from '../../../models/medico.model';
import { UsuarioCadastroDTO } from '../../../models/usuario-cadastro';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
    selector: 'app-cadastrar-usuarios',
    templateUrl: './cadastrar-usuarios.component.html',
    styleUrls: ['./cadastrar-usuarios.component.css']
})

export class CadastrarUsuariosComponent implements OnInit {
    usuarioForm!: FormGroup;
    medicoId!: number;

    medicosOptions: MedicoOptions[] = [];
    medicos: Medico[] = [];

    mostrarMedicos = false;

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private usuarioService: UsuarioService,
        private medicoService: MedicoService,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {
        this.medicoId = Number(this.route.snapshot.paramMap.get('id'));
        this.initializeForm();
        this.validarPerfilCadastro();
        this.setInformacoesUsuarioMedico();
    }


    onSubmit(): void {
        if (this.usuarioForm.valid) {
            const usuarioCadastro = this.createDataForm(this.usuarioForm);

            this.usuarioService.cadastrarUsuario(usuarioCadastro).pipe(
                tap(response => {
                    const idUsuario = response.id;
                    this.alertService.success('Sucesso!', 'Usuário cadastrado com sucesso!');
                    this.router.navigate([`/prontuario/usuarios/editar/${idUsuario}`]);
                }),
                catchError(error => {
                    this.alertService.error('Erro!', 'Erro ao cadastrar usuário!');
                    return of(null);
                })
            ).subscribe();
        } else {
            this.markFormGroupTouched(this.usuarioForm);
        }
    }

    cancel(): void {
        this.router.navigate(['/prontuario/usuarios']);
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
                control.markAsDirty({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    private setInformacoesUsuarioMedico() {
        this.usuarioForm.get('idPessoa')?.valueChanges.subscribe(idPessoa => {
            this.onMedicoSelected(idPessoa);
        });
    }

    private validarPerfilCadastro() {
        this.usuarioForm.get('perfil')?.valueChanges.subscribe((perfil) => {
            if (perfil === 'MEDICO') {
                this.mostrarMedicos = true;
                this.carregarMedicos();
                this.desabilitarDadosPessoais();
            } else {
                this.mostrarMedicos = false;
                this.usuarioForm.get('idMedico')?.reset();
                this.habilitarDadosPessoais();
            }
        });
    }

    private initializeForm(): void {
        this.usuarioForm = this.fb.group({
            nome: ['', Validators.required],
            cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
            dataNascimento: ['', Validators.required],
            sexo: [''],
            perfil: ['', [Validators.required]],
            crm: ['',],
            especialidade: ['',],
            login: ['', [Validators.required]],
            senha: ['', [Validators.required]],
            confirmacaoSenha: ['', [Validators.required]],
            idPessoa: [''],
            celular: ['', [Validators.required]],
            email: ['', [Validators.required]],
            telefone: [''],
            tipoContato: ['PRINCIPAL']


        });
    }

    private createDataForm(form: any): UsuarioCadastroDTO {
        const usuarioCadastroDTO: UsuarioCadastroDTO = {
            role: form.controls.perfil.value,
            login: form.controls.login.value,
            senha: form.controls.senha.value,
            idPessoa: form.controls.idPessoa.value,
            pessoaCadastroDTO: {
                nome: form.controls.nome.value,
                cpf: form.controls.cpf.value,
                sexo: form.controls.sexo.value,
                dataNascimento: form.controls.dataNascimento.value
            },
            contatoCadastroDTO: {
                celular: form.controls.celular.value,
                telefone: form.controls.telefone.value,
                email: form.controls.email.value,
                tipoContato: form.controls.tipoContato.value,
            }
        };

        return usuarioCadastroDTO;
    }

    private onMedicoSelected(idPessoa: number): void {
        const medicoSelecionado = this.medicos.find(medico => medico.pessoa.id === +idPessoa);
        this.usuarioForm.get('nome')?.setValue(medicoSelecionado?.pessoa.nome);
        this.usuarioForm.get('cpf')?.setValue(medicoSelecionado?.pessoa.cpf);
        this.usuarioForm.get('dataNascimento')?.setValue(medicoSelecionado?.pessoa.dataNascimento);
        this.usuarioForm.get('sexo')?.setValue(medicoSelecionado?.pessoa.sexo);
        this.usuarioForm.get('especialidade')?.setValue(medicoSelecionado?.especialidade);
        this.usuarioForm.get('crm')?.setValue(medicoSelecionado?.crm);

        this.usuarioForm.get('email')?.setValue(medicoSelecionado?.contato.email);
        this.usuarioForm.get('celular')?.setValue(medicoSelecionado?.contato.celular);
        this.usuarioForm.get('telefone')?.setValue(medicoSelecionado?.contato.telefone);


        this.desabilitarDadosPessoais();

    }

    private desabilitarDadosPessoais() {
        this.usuarioForm.get('nome')?.disable();
        this.usuarioForm.get('cpf')?.disable();
        this.usuarioForm.get('dataNascimento')?.disable();
        this.usuarioForm.get('sexo')?.disable();
        this.usuarioForm.get('especialidade')?.disable();
        this.usuarioForm.get('crm')?.disable();
        this.usuarioForm.get('email')?.disable();
        this.usuarioForm.get('celular')?.disable();
        this.usuarioForm.get('telefone')?.disable();
    }

    private habilitarDadosPessoais() {
        this.usuarioForm.get('nome')?.enable();
        this.usuarioForm.get('cpf')?.enable();
        this.usuarioForm.get('dataNascimento')?.enable();
        this.usuarioForm.get('sexo')?.enable();
        this.usuarioForm.get('especialidade')?.enable();
        this.usuarioForm.get('crm')?.enable();

        this.usuarioForm.get('email')?.enable();
        this.usuarioForm.get('celular')?.enable();
        this.usuarioForm.get('telefone')?.enable();

        this.usuarioForm.get('nome')?.setValue('');
        this.usuarioForm.get('cpf')?.setValue('');
        this.usuarioForm.get('dataNascimento')?.setValue('');
        this.usuarioForm.get('sexo')?.setValue('');
        this.usuarioForm.get('especialidade')?.setValue('');
        this.usuarioForm.get('crm')?.setValue('');
        this.usuarioForm.get('email')?.setValue('');
        this.usuarioForm.get('celular')?.setValue('');
        this.usuarioForm.get('telefone')?.setValue('');
    }

    private carregarMedicos(): void {
        this.medicoService.getOptionsMedico().pipe(
            tap(response => {
                this.medicos = response.data.list;
                this.medicosOptions = response.data.list.map((medico: any) => {
                    return {
                        id: medico.pessoa.id,
                        nome: `${medico.crm} - ${medico.pessoa.nome}`
                    };
                });
            }),
            catchError(error => {
                this.alertService.error('Erro!', 'Erro ao carregar a listagem de medico.');
                return of(null);
            })
        ).subscribe();
    }

}