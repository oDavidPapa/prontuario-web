import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { AlertService } from '../../base/alert/alert.service';
import { MedicoCadastroDTO } from '../../../models/medico-cadastro.model';
import { MedicoService } from '../../../services/medico.service';
import { MedicoOptions } from '../../../options/medico.option';
import { Medico } from '../../../models/medico.model';
import { UsuarioCadastroDTO } from '../../../models/usuario-cadastro';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
    selector: 'app-editar-usuarios',
    templateUrl: './editar-usuarios.component.html',
    styleUrls: ['./editar-usuarios.component.css']
})

export class EditarUsuariosComponent implements OnInit {
    usuarioForm!: FormGroup;
    idUsuario!: number;

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
        this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));

        this.initializeForm();
        this.loadUsuario();
        this.validarPerfilCadastro();

    }

    private loadUsuario(): void {
        this.usuarioService.getUsuarioById(this.idUsuario).pipe(
            tap(response => {
                if (response.success) {
                    const usuario = response.data;
                    this.usuarioForm.patchValue({
                        nome: usuario.pessoa.nome,
                        cpf: usuario.pessoa.cpf,
                        dataNascimento: usuario.pessoa.dataNascimento,
                        especialidade: '',
                        crm: '',
                        sexo: usuario.pessoa.sexo,
                        login: usuario.login,
                        perfil: usuario.role,
                        email: usuario.contato.email,
                        telefone: usuario.contato.telefone,
                        celular: usuario.contato.celular,
                        idPessoa: usuario.pessoa.id
                    });

                    console.log(response);

                } else {
                    console.error('Erro ao carregar dados do usuário');
                }
            }),
            catchError(error => {
                console.error('Erro ao carregar dados do usuário', error);
                return of(null); // Retorna um Observable vazio em caso de erro
            })
        ).subscribe(); // Apenas para garantir que a pipe seja executada
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
        }
    }

    cancel(): void {
        this.router.navigate(['/prontuario/usuarios']);
    }


    private validarPerfilCadastro() {

        const perfil = this.usuarioForm.get('perfil')?.valueChanges.subscribe((perfil) => {
            if (perfil === 'MEDICO') {
                this.mostrarMedicos = true;
                this.carregarMedicos();
                this.desabilitarDadosPessoais();
            } else {
                this.mostrarMedicos = false;
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
        this.usuarioForm.get('login')?.disable();
        this.usuarioForm.get('perfil')?.disable({ emitEvent: false });
        this.usuarioForm.get('idPessoa')?.disable({ emitEvent: false });

    }

    private habilitarDadosPessoais() {
        this.usuarioForm.get('nome')?.enable();
        this.usuarioForm.get('cpf')?.enable();
        this.usuarioForm.get('dataNascimento')?.enable();
        this.usuarioForm.get('sexo')?.enable();

        this.usuarioForm.get('perfil')?.disable({ emitEvent: false });


        this.usuarioForm.get('email')?.enable();
        this.usuarioForm.get('celular')?.enable();
        this.usuarioForm.get('telefone')?.enable();

        this.usuarioForm.get('especialidade')?.setValue('');
        this.usuarioForm.get('crm')?.setValue('');

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