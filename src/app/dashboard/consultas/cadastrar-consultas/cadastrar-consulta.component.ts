import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UsuarioService } from "../../../services/usuario.service";
import { MedicoService } from "../../../services/medico.service";
import { AlertService } from "../../base/alert/alert.service";
import { PacienteService } from "../../../services/paciente.service";
import { PacienteOption } from "../../../options/paciente.option";
import { Paciente } from "../../../models/paciente.model";
import { catchError, of, tap } from "rxjs";

@Component({
    selector: 'app-cadastrar-consulta',
    templateUrl: './cadastrar-consulta.component.html',
    styleUrls: ['./cadastrar-consulta.component.css']
})

export class CadastrarConsultasComponent implements OnInit {

    consultaForm!: FormGroup;
    pacientesOptions: PacienteOption[] = [];
    pacientes: Paciente[] = [];
    isEditing: boolean = false;

    selectedPaciente?: Paciente;
    optionSelect?: PacienteOption;

    detalhes: string = ''
    anamnese: string = '';
    tratamento: string = '';
    examesSolicitados: string = '';
    prescricoesMedicas: string = '';
    diagnostico: string = '';

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private usuarioService: UsuarioService,
        private pacienteService: PacienteService,
        private alertService: AlertService
    ) { }


    ngOnInit(): void {
        this.initializeForm();
        this.carregarPacientes();
    }
    onPacienteChange(event: any): void {
        this.selectedPaciente = this.pacientes.find(p => p.pessoa.id == event.value.id);
        console.log(this.selectedPaciente)
    }

    private initializeForm(): void {
        this.consultaForm = this.fb.group({
            idPaciente: ['', Validators.required],
        });
    }

    private carregarPacientes(): void {
        this.pacienteService.getOptionsPaciente().pipe(
            tap(response => {
                this.pacientes = response.data.list.map((paciente: any) => ({
                    ...paciente,
                    endereco: {
                        rua: 'Rua Exemplo',
                        numero: '456',
                        complemento: 'Apto 12',
                        cidade: 'Cidade Exemplo',
                        cep: '12345-678',
                        estado: 'EX',
                        pais: 'Brasil'
                    }
                }));
                
                this.pacientesOptions = response.data.list.map((paciente: any) => {
                    return {
                        id: paciente.pessoa.id,
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
}

