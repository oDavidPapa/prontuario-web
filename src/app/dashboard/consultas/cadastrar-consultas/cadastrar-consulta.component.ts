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
import { ConsultaService } from "../../../services/consulta.service";
import { ConsultaCadastroDTO } from "../../../models/consulta-cadastro.model";

@Component({
    selector: 'app-cadastrar-consulta',
    templateUrl: './cadastrar-consulta.component.html',
    styleUrls: ['./cadastrar-consulta.component.css']
})
export class CadastrarConsultasComponent implements OnInit {

    consultaForm!: FormGroup;
    pacientesOptions: PacienteOption[] = [];
    filteredPacientes: PacienteOption[] = []; // Nova lista para pacientes filtrados
    pacientes: Paciente[] = [];
    isEditing: boolean = false;

    selectedPaciente?: Paciente;
    optionSelect?: PacienteOption;
    searchTerm: string = ''; // Para armazenar o termo de pesquisa

    detalhes: string = '';
    anamnese: string = '';
    tratamento: string = '';
    examesSolicitados: string = '';
    prescricoesMedicas: string = '';
    diagnostico: string = '';
    alergia: string = '';
    arquivo: string = '';
    tipoConsulta: string = '';


    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private usuarioService: UsuarioService,
        private pacienteService: PacienteService,
        private alertService: AlertService,
        private consultaService: ConsultaService
    ) { }

    ngOnInit(): void {
        this.initializeForm();
        this.carregarPacientes();
    }

    onPacienteChange(event: any): void {
        this.selectedPaciente = this.pacientes.find(p => p.id == event.value.id);
        console.log(this.selectedPaciente);

        this.searchTerm = ''; // Limpa o campo de pesquisa ao selecionar um paciente

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
                        id: paciente.id,
                        nome: `${paciente.pessoa.cpf} - ${paciente.pessoa.nome}`
                    };
                });

                // Inicializa a lista filtrada com todos os pacientes
                this.filteredPacientes = this.pacientesOptions;
            }),
            catchError(error => {
                this.alertService.error('Erro!', 'Erro ao carregar a listagem de pacientes.');
                return of(null);
            })
        ).subscribe();
    }

    // Método para filtrar os pacientes com base no termo de pesquisa
    filterPacientes(): void {
        const term = this.searchTerm.toLowerCase();
        this.filteredPacientes = this.pacientesOptions.filter(paciente =>
            paciente.nome.toLowerCase().includes(term)
        );
    }

    salvarPaciente(): void {
        if (!this.selectedPaciente || !this.tipoConsulta) {
            this.alertService.error('Erro!', 'Selecione um paciente e um tipo de consulta.');
            return;
        }

        const consultaData: ConsultaCadastroDTO = {
            tipo: this.tipoConsulta, 
            idPaciente: this.selectedPaciente.id, 
        };

        // Chama o serviço para salvar a consulta
        this.consultaService.salvarConsulta(consultaData).pipe(
            tap(response => {
                if (response.success) {
                    this.alertService.success('Sucesso!', 'Consulta salva com sucesso.');
                    this.router.navigate(['/prontuario/pacientes']); // Navega para outra página após salvar
                } else {
                    this.alertService.error('Erro!', 'Falha ao salvar a consulta.');
                }
            }),
            catchError(error => {
                this.alertService.error('Erro!', 'Erro ao salvar a consulta.');
                return of(null);
            })
        ).subscribe();
    }

    cancel(): void {
        if (!this.selectedPaciente) {
            this.alertService.error('Erro!', 'Nenhum paciente foi selecionado.');
            return;
        }

        this.router.navigate(['/prontuario/pacientes']);
    }
}
