import { Component, Input, input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "../../base/alert/alert.service";
import { PacienteService } from "../../../../services/paciente.service";
import { PacienteOption } from "../../../../models/options/paciente.option";
import { Paciente } from "../../../../models/paciente.model";
import { catchError, of, tap } from "rxjs";
import { ConsultaService } from "../../../../services/consulta.service";
import { ConsultaCadastroDTO } from "../../../../models/consulta-cadastro.model";
import { DiagnosticoService } from "../../../../services/diagnostico.service";
import { ConsultaTabs } from "../../../../models/enum/consulta-tabs.enum";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Cid } from "../../../../models/cid.model";

@Component({
    selector: 'app-manter-consulta',
    templateUrl: './manter-consulta.component.html',
    styleUrls: ['./manter-consulta.component.css']
})
export class ManterConsultasComponent implements OnInit {

    consultaForm!: FormGroup;
    diagnosticoForm!: FormGroup;
    idPaciente!: any;

    pacientesOptions: PacienteOption[] = [];
    filteredPacientes: PacienteOption[] = []; // Nova lista para pacientes filtrados
    pacientes: Paciente[] = [];
    isEditing: boolean = false;
    idConsulta: any;
    idDiagnostico: any;


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

    selectedCid: any = null;
    diagnosticoCids: any[] = [];

    cidsAdicionados: Cid[] = [];
    @Input() cids: Cid[] = [];


    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private pacienteService: PacienteService,
        private alertService: AlertService,
        private consultaService: ConsultaService,
        private diagnosticoService: DiagnosticoService
    ) { }

    ngOnInit(): void {
        this.initializeForm();
        this.carregarPacientes();

        this.idConsulta = this.route.snapshot.paramMap.get('id');
        if (this.idConsulta) {
            this.isEditing = true;
        }
    }

    adicionarCid() {
        if (this.selectedCid && !this.diagnosticoCids.includes(this.selectedCid)) {
            this.diagnosticoCids.push(this.selectedCid);
            this.selectedCid = null; // Reseta a seleção
        }
    }

    // Remove um CID da lista de CIDs associados
    removerCid(cid: any) {
        this.diagnosticoCids = this.diagnosticoCids.filter(item => item !== cid);
    }


    onPacienteChange(event: any): void {
        this.selectedPaciente = this.pacientes.find(p => p.id == event.value.id);
        this.searchTerm = ''; // Limpa o campo de pesquisa ao selecionar um paciente
        this.idPaciente = this.selectedPaciente?.id;
    }

    private carregarPaciente(id: string): void {
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
                } else {
                    this.alertService.error('Erro!', 'Falha ao carregar a consulta.');
                }
            }),
            catchError(() => {
                this.alertService.error('Erro!', 'Erro ao carregar a consulta.');
                return of(null);
            })
        ).subscribe();
    }


    private carregarAnamnese(id: string): void {
        this.consultaService.getConsultaById(+id).pipe(
            tap(response => {
                if (response.success) {
                    const consulta = response.data;
                    if (consulta) {
                        this.anamnese = consulta.anamnese || '';
                    }
                } else {
                    this.alertService.error('Erro!', 'Falha ao carregar a anamnése.');
                }
            }),
            catchError(() => {
                this.alertService.error('Erro!', 'Erro ao carregar a anamnése.');
                return of(null);
            })
        ).subscribe();
    }

    private carregarDiagnostico(id: string): void {
        this.diagnosticoService.getDiagnostico(+id).pipe(
            tap(response => {
                if (response.success) {
                    const diagnostico = response.data;
                    if (diagnostico) {
                        this.diagnostico = diagnostico.diagnostico || '';
                        this.idConsulta = diagnostico.idConsulta;
                        this.idDiagnostico = diagnostico.id;
                    }
                } else {
                    this.alertService.error('Erro!', 'Falha ao carregar a diagnóstico.');
                }
            }),
            catchError((error) => {
                this.alertService.error('Erro!', 'Erro ao carregar a diagnóstico.');
                return of(null);
            })
        ).subscribe();
    }

    private initializeForm(): void {

        // ABA PACIENTE e ANAMNESE:
        this.consultaForm = this.fb.group({
            idPaciente: ['', Validators.required],
            tipoConsulta: [''],
            anamnese: ['']
        });

        // ABA DIAGNOSTICO:
        this.diagnosticoForm = this.fb.group({
            id: [],
            idConsulta: ['', Validators.required],
            diagnostico: ['']
        });

    }

    private carregarPacientes(): void {
        this.pacienteService.getOptionsPaciente().pipe(
            tap(response => {
                this.pacientes = response.data.list.map((paciente: any) => ({
                    ...paciente
                }));

                this.pacientesOptions = response.data.list.map((paciente: any) => {
                    this.idPaciente = paciente.id;
                    return {
                        id: paciente.id,
                        nome: `${paciente.pessoa.cpf} - ${paciente.pessoa.nome}`
                    };
                });

                // Inicializa a lista filtrada com todos os pacientes
                this.filteredPacientes = this.pacientesOptions;
            }),
            catchError((error) => {
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

    criarConsulta(): void {
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
                        idPaciente: this.selectedPaciente?.id,
                    };

                    // Chama o serviço para salvar a consulta após a confirmação
                    this.consultaService.salvarConsulta(consultaData).pipe(
                        tap(response => {
                            if (response.success) {
                                this.alertService.success('Sucesso!', 'Consulta salva com sucesso.');
                                this.isEditing = true;
                                this.idConsulta = response.data.id;
                            } else {
                                this.alertService.error('Erro!', 'Falha ao salvar a consulta.');
                            }
                        }),
                        catchError(() => {
                            this.alertService.error('Erro!', 'Erro ao salvar a consulta.');
                            return of(null);
                        })
                    ).subscribe();
                }
            });
    }

    manterConsulta(): void {
        if (!this.selectedPaciente || !this.tipoConsulta) {
            this.alertService.error('Erro!', 'Selecione um paciente e um tipo de consulta.');
            return;
        }

        const consultaData: ConsultaCadastroDTO = {
            tipo: this.tipoConsulta ?? '',
            idPaciente: this.selectedPaciente?.id,
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

    salvarDiagnostico(): void {
        if (this.idConsulta && this.diagnostico) {
            const diagnosticoData = {
                idConsulta: this.idConsulta,
                diagnostico: this.diagnostico
            };

            if (this.idDiagnostico) {
                this.diagnosticoService.updateDiagnostico(this.idDiagnostico, diagnosticoData).pipe(
                    tap(response => {
                        if (response.success) {
                            this.alertService.success('Sucesso!', 'Diagnóstico salvo com sucesso.');
                            this.isEditing = true;
                            this.idConsulta = response.data.idConsulta;
                            this.idDiagnostico = response.data.id;
                        } else {
                            this.alertService.error('Erro!', 'Falha ao salvar o diagnostico.');
                        }
                    }),
                    catchError(() => {
                        this.alertService.error('Erro!', 'Erro ao salvar o diagnóstico.');
                        return of(null);
                    })
                ).subscribe();
            } else {
                this.diagnosticoService.salvarDiagnostico(diagnosticoData).pipe(
                    tap(response => {
                        if (response.success) {
                            this.alertService.success('Sucesso!', 'Diagnóstico salvo com sucesso.');
                            this.isEditing = true;
                            this.idConsulta = response.data.idConsulta;
                            this.idDiagnostico = response.data.id;
                        } else {
                            this.alertService.error('Erro!', 'Falha ao salvar o diagnostico.');
                        }
                    }),
                    catchError(() => {
                        this.alertService.error('Erro!', 'Erro ao salvar o diagnóstico.');
                        return of(null);
                    })
                ).subscribe();
            }
        }
    }


    cancel(): void {
        this.router.navigate(['/prontuario/consultas']);
    }

    onTabChange(event: MatTabChangeEvent): void {

        if (!this.isEditing) {
            return;
        }

        const selectedTabIndex = event.index;

        switch (selectedTabIndex) {
            case ConsultaTabs.RESUMO:
                this.loadResumo();
                break;
            case ConsultaTabs.PACIENTE:
                this.loadPaciente();
                break;
            case ConsultaTabs.ANAMNESE:
                this.loadAnamnese();
                break;
            case ConsultaTabs.DIAGNOSTICO:
                this.loadDiagnostico();
                break;
            case ConsultaTabs.EXAME:
                this.loadExame();
                break;
            case ConsultaTabs.PRESCRICAO:
                this.loadPrescricao();
                break;
            case ConsultaTabs.TRATAMENTO:
                this.loadTratamento();
                break;
            case ConsultaTabs.ALERGIA:
                this.loadAlergia();
                break;
            case ConsultaTabs.ARQUIVO:
                this.loadArquivo();
                break;
            default:
                break;
        }
    }

    loadResumo(): void {
        console.log("RESUMO");
    }

    loadPaciente(): void {
        console.log("PACIENTE");
        this.carregarPaciente(this.idConsulta);
    }

    loadAnamnese(): void {
        console.log("ANAMNESE");
        this.carregarPaciente(this.idConsulta);
        this.carregarAnamnese(this.idConsulta);
    }

    loadDiagnostico(): void {
        console.log("DIAGNOSTICO");
        this.carregarDiagnostico(this.idConsulta);

    }

    loadExame(): void {
        console.log("EXAME");

    }

    loadPrescricao(): void {
        console.log("PRESCRICAO");

    }

    loadTratamento(): void {
        console.log("TRATAMENTO");

    }

    loadAlergia(): void {
        this.idPaciente = this.selectedPaciente?.id;
        console.log("ALERGIA");

    }

    loadArquivo(): void {
        console.log("ARQUIVO");

    }

    onCidAdicionado(event: any): void {
        console.log('CID Adicionado:', event);
        //this.cidsAdicionados.push(cid);  // Adiciona o CID ao array de CIDs
    }

    onCidRemovido(event: any): void {
        console.log('CID Removido:', event);
        //this.cidsAdicionados = this.cidsAdicionados.filter(c => c.codigo !== cid.codigo);
    }
}
