import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UsuarioService } from "../../../services/usuario.service";
import { AlertService } from "../../base/alert/alert.service";
import { PacienteService } from "../../../services/paciente.service";
import { PacienteOption } from "../../../options/paciente.option";
import { Paciente } from "../../../models/paciente.model";
import { catchError, of, tap } from "rxjs";
import { ConsultaService } from "../../../services/consulta.service";
import { ConsultaCadastroDTO } from "../../../models/consulta-cadastro.model";

@Component({
    selector: 'app-manter-consulta',
    templateUrl: './manter-consulta.component.html',
    styleUrls: ['./manter-consulta.component.css']
})
export class ManterConsultasComponent implements OnInit {

    consultaForm!: FormGroup;
    pacientesOptions: PacienteOption[] = [];
    filteredPacientes: PacienteOption[] = []; // Nova lista para pacientes filtrados
    pacientes: Paciente[] = [];
    isEditing: boolean = false;
    idConsulta: any;

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

        this.idConsulta = this.route.snapshot.paramMap.get('id');
        if (this.idConsulta) {
            this.isEditing = true;
            this.carregarConsulta(this.idConsulta);
        }
    }

    onPacienteChange(event: any): void {
        this.selectedPaciente = this.pacientes.find(p => p.id == event.value.id);
        console.log(this.selectedPaciente);

        this.searchTerm = ''; // Limpa o campo de pesquisa ao selecionar um paciente
    }

    private carregarConsulta(id: string): void {
        this.consultaService.getConsultaById(+id).pipe(
            tap(response => {
                if (response.success) {
                    const consulta = response.data;

                    this.tipoConsulta = consulta.tipoEnum;
                    this.selectedPaciente = this.pacientes.find(p => p.id === consulta.paciente.id);
                    this.optionSelect = this.pacientesOptions.find(p => p.id === consulta.paciente.id);

                    this.consultaForm.patchValue({
                        idPaciente: consulta.paciente.id,
                        tipoConsulta: consulta.tipoEnum
                    });

                    this.anamnese = consulta.anamnese || '';
                    this.tratamento = consulta.tratamento || '';
                    this.examesSolicitados = consulta.examesSolicitados || '';
                    this.prescricoesMedicas = consulta.prescricoesMedicas || '';
                    this.diagnostico = consulta.diagnostico || '';
                    this.alergia = consulta.alergia || '';
                    this.arquivo = consulta.arquivo || '';

                } else {
                    this.alertService.error('Erro!', 'Falha ao carregar a consulta.');
                }
            }),
            catchError(error => {
                this.alertService.error('Erro!', 'Erro ao carregar a consulta.');
                return of(null);
            })
        ).subscribe();
    }

    private initializeForm(): void {
        this.consultaForm = this.fb.group({
            idPaciente: ['', Validators.required],
            tipoConsulta: [''],
            anamnese: ['']
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

        // Chama o método de confirmação do AlertService
        this.alertService.confirm('Confirmação', 'Após a confirmação o paciente não poderá ser alterado. Deseja prosseguir?')
            .then((confirmacao) => {
                if (confirmacao) {
                    const consultaData: ConsultaCadastroDTO = {
                        tipo: this.tipoConsulta ?? '',
                        idPaciente: this.selectedPaciente?.id ?? 0
                    };

                    // Chama o serviço para salvar a consulta após a confirmação
                    this.consultaService.salvarConsulta(consultaData).pipe(
                        tap(response => {
                            if (response.success) {
                                this.alertService.success('Sucesso!', 'Consulta salva com sucesso.');
                                this.isEditing = true;
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
                // Se o usuário clicar em "Não", nada acontece
            });
    }

    manterConsulta(): void {
        if (!this.selectedPaciente || !this.tipoConsulta) {
            this.alertService.error('Erro!', 'Selecione um paciente e um tipo de consulta.');
            return;
        }

        // Chama o método de confirmação do AlertService


        const consultaData: ConsultaCadastroDTO = {
            tipo: this.tipoConsulta ?? '',
            idPaciente: this.selectedPaciente?.id ?? 0,
            anamnese: this.anamnese
        };

        // Chama o serviço para salvar a consulta após a confirmação
        this.consultaService.updateConsulta(this.idConsulta, consultaData).pipe(
            tap(response => {
                if (response.success) {
                    this.alertService.success('Sucesso!', 'Operação realizada com sucesso.');
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
    }
}
