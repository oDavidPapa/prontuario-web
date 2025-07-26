import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { AlertService } from '../../base/alert/alert.service';
import { MedicoService } from '../../../../services/medico.service';
import { MedicoOptions } from '../../../../models/options/medico.option';
import { Medico } from '../../../../models/medico.model';
import { Paciente } from '../../../../models/paciente.model';
import { PacienteOption } from '../../../../models/options/paciente.option';
import { PacienteService } from '../../../../services/paciente.service';
import { AgendamentoCadastroDTO } from '../../../../models/agendamento-cadastro.model';
import { AgendamentoService } from '../../../../services/agendamento.service';

@Component({
    selector: 'app-cadastrar-agendamentos',
    templateUrl: './cadastrar-agendamentos.component.html',
    styleUrls: ['./cadastrar-agendamentos.component.css']
})

export class CadastrarAgendamentosComponent implements OnInit {
    agendamentoForm!: FormGroup;
    agendamentoId!: number;

    medicosOptions: MedicoOptions[] = [];
    medicos: Medico[] = [];

    pacientesOptions: PacienteOption[] = [];
    pacientes: Paciente[] = [];

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private alertService: AlertService,
        private medicoService: MedicoService,
        private pacienteService: PacienteService,
        private agendamentoService: AgendamentoService,

    ) { }

    ngOnInit(): void {
        this.agendamentoId = Number(this.route.snapshot.paramMap.get('id'));
        this.initializeForm();
        this.carregarMedicos();
        this.carregarPacientes();
    }

    cancel(): void {
        this.router.navigate(['/prontuario/agendamentos']);
    }


    onSubmit(): void {
        if (this.agendamentoForm.valid) {
            const agendamentoCadastroDTO = this.createDataForm(this.agendamentoForm);

            this.agendamentoService.cadastrarAgendamento(agendamentoCadastroDTO).pipe(
                tap(response => {
                    const agendamentoId = response.data.id;
                    this.alertService.success('Sucesso!', 'Agendamento cadastrado com sucesso!');
                    this.router.navigate([`/prontuario/agendamentos/editar/${agendamentoId}`]);
                }),
                catchError(error => {
                    this.alertService.error('Erro!', 'Erro ao cadastrar dados do Agendamento.');
                    return of(null);
                })
            ).subscribe();
        }
    }

    private carregarMedicos(): void {
        this.medicoService.getOptionsMedico().pipe(
            tap(response => {
                this.medicos = response.data.list;
                this.medicosOptions = response.data.list.map((medico: any) => {
                    return {
                        id: medico.id,
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

    private carregarPacientes(): void {
        this.pacienteService.getOptionsPaciente().pipe(
            tap(response => {
                this.pacientes = response.data.list;
                this.pacientesOptions = response.data.list.map((paciente: any) => {
                    return {
                        id: paciente.id,
                        nome: `${paciente.pessoa.cpf} - ${paciente.pessoa.nome}`
                    };
                });
            }),
            catchError(error => {
                this.alertService.error('Erro!', 'Erro ao carregar a listagem de pacientes.');
                return of(null);
            })
        ).subscribe();
    }

    private initializeForm(): void {
        this.agendamentoForm = this.fb.group({
            idPaciente: ['', Validators.required],
            idMedico: ['', Validators.required],
            tipoConsulta: ['', Validators.required],
            dataAgendamentoConsulta: ['', [Validators.required]],
            descricao: ['', [Validators.required]],
        });
    }

    createDataForm(form: any): AgendamentoCadastroDTO {
        const agendamentoCadastro: AgendamentoCadastroDTO = {
            idMedico: form.controls.idMedico.value,
            idPaciente: form.controls.idPaciente.value,
            tipoConsulta: form.controls.tipoConsulta.value,
            dataAgendamento: form.controls.dataAgendamentoConsulta.value,
            descricao: form.controls.descricao.value,
        };

        return agendamentoCadastro;
    }
}