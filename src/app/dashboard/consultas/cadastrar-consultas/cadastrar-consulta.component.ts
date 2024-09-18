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


    private initializeForm(): void {
        this.consultaForm = this.fb.group({
            idPaciente: ['', Validators.required],
        });
    }

    private carregarPacientes(): void {
        this.pacienteService.getOptionsPaciente().pipe(
            tap(response => {
                this.pacientes = response.data.list;
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


    cancel() {

    }

    onSubmit() {

    }

}
