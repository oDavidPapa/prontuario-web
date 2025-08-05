import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Column } from '../../base/grid/column';
import { catchError, of, tap } from 'rxjs';
import { PaginatedResponse } from '../../../../models/pagination.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../base/alert/alert.service';
import { MedicamentoConsultaDTO } from '../../../../models/medicamento-consulta.model';
import { PrescricaoConsultaService } from '../../../../services/prescricao-consulta.service';

@Component({
    selector: 'app-medicamento-cadastro',
    templateUrl: './cadastro-medicamento.component.html',
    styleUrls: ['./cadastro-medicamento.component.css']
})

export class MedicamentoCadastroComponent implements OnInit {
    medicamentoConsultaForm!: FormGroup;

    medicamentos: MedicamentoConsultaDTO[] = [];

    @Input() idPrescricaoConsulta!: number;

    columns: Column[] = [
        { header: 'Medicamento', field: 'medicamento', align: 'left' },
        { header: 'Instrução Uso', field: 'instrucaoUso', align: 'left' },
        { header: 'Observação', field: 'observacao', align: 'left' }
    ];

    constructor(
        private fb: FormBuilder,
        private prescricaoConsultaService: PrescricaoConsultaService,
        private alertService: AlertService) { }

    ngOnInit(): void {
        this.initializeForm();
        this.loadMedicamentos()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['idPrescricaoConsulta'] && this.idPrescricaoConsulta) {
            this.initializeForm();
            this.loadMedicamentos()
        }
    }

    private initializeForm(): void {
        this.medicamentoConsultaForm = this.fb.group({
            id: [],
            idPrescricao: [this.idPrescricaoConsulta, Validators.required],
            medicamento: ['', Validators.required],
            instrucaoUso: ['', Validators.required],
            observacao: [''],
        });
    }

    private loadMedicamentos(): void {
        this.prescricaoConsultaService.getMedicamentosByPrescricao(this.idPrescricaoConsulta).pipe(
            catchError(error => {
                console.error('Erro ao carregar medicamentos', error);
                return of({
                    data: {
                        list: [],
                        total: 0,
                        page: 0,
                        pageSize: 0
                    },
                    success: false
                } as PaginatedResponse<MedicamentoConsultaDTO>);
            })
        ).subscribe(response => {
            if (response && response.success) {
                this.medicamentos = response.data.list;
            }
        });
    }

    onAddMedicamento(): void {
        this.medicamentoConsultaForm.get('idPrescricaoConsulta')?.setValue(this.idPrescricaoConsulta);

        if (this.medicamentoConsultaForm.valid) {
            const novoMedicamento = this.medicamentoConsultaForm.value;

            this.prescricaoConsultaService.saveMedicamento(novoMedicamento).pipe(
                tap(response => {
                    this.alertService.success('Sucesso!', 'Medicamento cadastrado com sucesso!');
                    this.medicamentos.push(response.data);
                    this.medicamentoConsultaForm.reset();
                    this.idPrescricaoConsulta = response.data.prescricao.id;
                    this.initializeForm();
                }),
                catchError(error => {
                    this.alertService.error('Erro!', 'Erro ao cadastrar o medicamento.');
                    return of(null);
                })
            ).subscribe();
        }
    }

    onRemoveMedicamento(medicamento: MedicamentoConsultaDTO): void {
        this.medicamentos = this.medicamentos.filter(m => m !== medicamento);

        this.prescricaoConsultaService.delete(medicamento.id).subscribe(
            () => {
                this.alertService.success('Sucesso!', 'Medicamento removido com sucesso!');
                this.loadMedicamentos();
            },
            (error) => {
                console.error('Erro ao remover medicamento:', error);
            }
        );
    }
}
