import { Component, Input, input, OnInit, ViewChild } from "@angular/core";
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
import { TratamentoService } from "../../../../services/tratamento.service";
import { PrescricaoConsultaService } from "../../../../services/prescricao-consulta.service";
import { UploadArquivoComponent } from "../arquivo/upload-arquivo.component";
import { ResumoComponent } from "../resumo/resumo.component";

@Component({
    selector: 'app-manter-consulta',
    templateUrl: './manter-consulta.component.html',
    styleUrls: ['./manter-consulta.component.css']
})
export class ManterConsultasComponent implements OnInit {

    @ViewChild(UploadArquivoComponent) uploadArquivoComponent!: UploadArquivoComponent;
    @ViewChild(ResumoComponent) resumoComponent!: ResumoComponent;


    consultaForm!: FormGroup;
    diagnosticoForm!: FormGroup;
    idPaciente!: any;

    pacientesOptions: PacienteOption[] = [];
    filteredPacientes: PacienteOption[] = []; // Nova lista para pacientes filtrados
    pacientes: Paciente[] = [];
    isEditing: boolean = false;

    idConsulta: any;
    idDiagnostico: any;
    idTratamento: any;
    idPrescricaoConsulta: any;


    selectedPaciente?: Paciente;
    optionSelect?: PacienteOption;
    searchTerm: string = '';
    detalhes: string = '';
    anamnese: string = '';
    tratamento: string = '';
    examesSolicitados: string = '';
    prescricao: string = '';
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
        private diagnosticoService: DiagnosticoService,
        private tratamentoService: TratamentoService,
        private prescricaoConsultaService: PrescricaoConsultaService
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
            this.selectedCid = null; 
        }
    }

    removerCid(cid: any) {
        this.diagnosticoCids = this.diagnosticoCids.filter(item => item !== cid);
    }


    onPacienteChange(event: any): void {
        this.selectedPaciente = this.pacientes.find(p => p.id == event.value.id);
        this.searchTerm = ''; 
        this.idPaciente = this.selectedPaciente?.id;
    }

    private carregarPaciente(): void {
        this.reloadConsultaId();
        this.consultaService.getConsultaById(this.idConsulta).pipe(
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


    private carregarAnamnese(): void {
        this.reloadConsultaId();
        this.consultaService.getConsultaById(this.idConsulta).pipe(
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

    private carregarDiagnostico(): void {
        this.reloadConsultaId();
        this.diagnosticoService.getDiagnostico(this.idConsulta).pipe(
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

    private carregarTratamento(): void {
        this.reloadConsultaId();
        this.tratamentoService.getTratamento(this.idConsulta).pipe(
            tap(response => {
                if (response.success) {
                    const tratamento = response.data;
                    if (tratamento) {
                        this.tratamento = tratamento.tratamento || '';
                        this.idConsulta = tratamento.idConsulta;
                        this.idTratamento = tratamento.id;
                    }
                } else {
                    this.alertService.error('Erro!', 'Falha ao carregar a tratamento.');
                }
            }),
            catchError((error) => {
                this.alertService.error('Erro!', 'Erro ao carregar a tratamento.');
                return of(null);
            })
        ).subscribe();
    }

    private carregarPrescricao(): void {
        this.reloadConsultaId();
        this.prescricaoConsultaService.getPrescricaoConsulta(this.idConsulta).pipe(
            tap(response => {
                if (response.success) {
                    const prescricao = response.data;
                    if (prescricao) {
                        this.prescricao = prescricao.descricao || '';
                        this.idConsulta = prescricao.idConsulta;
                        this.idPrescricaoConsulta = prescricao.id;
                    }
                } else {
                    this.alertService.error('Erro!', 'Falha ao carregar a prescrição.');
                }
            }),
            catchError((error) => {
                this.alertService.error('Erro!', 'Erro ao carregar a prescrição.');
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

                this.filteredPacientes = this.pacientesOptions;
            }),
            catchError((error) => {
                this.alertService.error('Erro!', 'Erro ao carregar a listagem de pacientes.');
                return of(null);
            })
        ).subscribe();
    }

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

        this.alertService.confirm('Confirmação', 'Após a confirmação o paciente não poderá ser alterado. Deseja prosseguir?')
            .then((confirmacao) => {
                if (confirmacao) {
                    const consultaData: ConsultaCadastroDTO = {
                        tipo: this.tipoConsulta ?? '',
                        idPaciente: this.selectedPaciente?.id,
                    };

                    this.consultaService.salvarConsulta(consultaData).pipe(
                        tap(response => {
                            if (response.success) {
                                this.alertService.success('Sucesso!', 'Consulta salva com sucesso.');
                                this.isEditing = true;
                                this.idConsulta = response.data.id;
                                this.router.navigate([`/prontuario/consultas/editar/${this.idConsulta}`]);

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
        this.reloadConsultaId();

        if (!this.selectedPaciente || !this.tipoConsulta) {
            this.alertService.error('Erro!', 'Selecione um paciente e um tipo de consulta.');
            return;
        }

        const consultaData: ConsultaCadastroDTO = {
            tipo: this.tipoConsulta ?? '',
            idPaciente: this.selectedPaciente?.id,
            anamnese: this.anamnese
        };

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
        this.reloadConsultaId();
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

    salvarTratamento(): void {
        this.reloadConsultaId();
        if (this.idConsulta && this.tratamento) {
            const tratamentoData = {
                idConsulta: this.idConsulta,
                tratamento: this.tratamento
            };

            if (this.idTratamento) {
                this.tratamentoService.updateTratamento(this.idTratamento, tratamentoData).pipe(
                    tap(response => {
                        if (response.success) {
                            this.alertService.success('Sucesso!', 'Tratamento salvo com sucesso.');
                            this.isEditing = true;
                            this.idConsulta = response.data.idConsulta;
                            this.idTratamento = response.data.id;
                        } else {
                            this.alertService.error('Erro!', 'Falha ao salvar o tratamento.');
                        }
                    }),
                    catchError(() => {
                        this.alertService.error('Erro!', 'Erro ao salvar o tratamento.');
                        return of(null);
                    })
                ).subscribe();
            } else {
                this.tratamentoService.salvarTratamento(tratamentoData).pipe(
                    tap(response => {
                        if (response.success) {
                            this.alertService.success('Sucesso!', 'Tratamento salvo com sucesso.');
                            this.isEditing = true;
                            this.idConsulta = response.data.idConsulta;
                            this.idTratamento = response.data.id;
                        } else {
                            this.alertService.error('Erro!', 'Falha ao salvar o Tratamento.');
                        }
                    }),
                    catchError(() => {
                        this.alertService.error('Erro!', 'Erro ao salvar o Tratamento.');
                        return of(null);
                    })
                ).subscribe();
            }
        }
    }

    salvarPrescricao(): void {
        this.reloadConsultaId();
        if (this.idConsulta && this.prescricao) {
            const prescricaoData = {
                idConsulta: this.idConsulta,
                descricao: this.prescricao
            };

            if (this.idPrescricaoConsulta) {
                this.prescricaoConsultaService.updatePrescricaoConsulta(this.idPrescricaoConsulta, prescricaoData).pipe(
                    tap(response => {
                        if (response.success) {
                            this.alertService.success('Sucesso!', 'Prescrição salvo com sucesso.');
                            this.isEditing = true;
                            this.idConsulta = response.data.idConsulta;
                            this.idPrescricaoConsulta = response.data.id;
                        } else {
                            this.alertService.error('Erro!', 'Falha ao salvar o Prescrição.');
                        }
                    }),
                    catchError(() => {
                        this.alertService.error('Erro!', 'Erro ao salvar o Prescrição.');
                        return of(null);
                    })
                ).subscribe();
            } else {
                this.prescricaoConsultaService.salvarPrescricaoConsulta(prescricaoData).pipe(
                    tap(response => {
                        if (response.success) {
                            this.alertService.success('Sucesso!', 'Prescrição salvo com sucesso.');
                            this.isEditing = true;
                            this.idConsulta = response.data.idConsulta;
                            this.idPrescricaoConsulta = response.data.id;
                        } else {
                            this.alertService.error('Erro!', 'Falha ao salvar o Prescrição.');
                        }
                    }),
                    catchError(() => {
                        this.alertService.error('Erro!', 'Erro ao salvar o Prescrição.');
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

        this.reloadConsultaId();
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
        if (this.isEditing) {
            this.resumoComponent.carregarResumo();
        }
    }

    loadPaciente(): void {
        this.carregarPaciente();
    }

    loadAnamnese(): void {
        this.carregarPaciente();
        this.carregarAnamnese();
    }

    loadDiagnostico(): void {
        this.carregarDiagnostico();

    }

    loadExame(): void {}

    loadPrescricao(): void {
        this.carregarPrescricao();

    }

    loadTratamento(): void {
        this.carregarTratamento();
    }

    loadAlergia(): void {
        this.idPaciente = this.selectedPaciente?.id;

    }

    loadArquivo(): void {
        if (this.uploadArquivoComponent) {
            this.uploadArquivoComponent.ngOnInit();
        }
    }

    private reloadConsultaId() {
        this.idConsulta = this.route.snapshot.paramMap.get('id');
    }
}
