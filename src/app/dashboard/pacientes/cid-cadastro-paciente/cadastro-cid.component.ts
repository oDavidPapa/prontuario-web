import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Column } from '../../base/grid/column';
import { CidService } from '../../../services/cid.service';
import { Cid } from '../../../models/cid.model';
import { catchError, of, tap } from 'rxjs';
import { PaginatedResponse } from '../../../models/pagination.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../base/alert/alert.service';

@Component({
    selector: 'app-cid-cadastro',
    templateUrl: './cadastro-cid.component.html',
    styleUrls: ['./cadastro-cid.component.css']
})

export class CidCadastroComponent implements OnInit {
    cidPacienteForm!: FormGroup;

    cids: Cid[] = [];

    @Input() idPaciente!: number;
    @Input() idDiagnostico!: number;

    @Output() alergiasAtualizadas = new EventEmitter<any[]>();

    columns: Column[] = [
        { header: 'Código', field: 'codigo', align: 'left' },
        { header: 'Descrição', field: 'descricao', align: 'left' }
    ];

    constructor(
        private fb: FormBuilder,
        private cidService: CidService,
        private alertService: AlertService) { }

    ngOnInit(): void {
        this.initializeForm();
        this.loadCids()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['idDiagnostico'] && this.idDiagnostico) {
            this.initializeForm();
            this.loadCids()
        }
    }

    private initializeForm(): void {
        this.cidPacienteForm = this.fb.group({
            id: [],
            idDiagnostico: [this.idDiagnostico, Validators.required],
            descricao: ['', Validators.required],
            codigo: ['', Validators.required]
        });
    }

    private loadCids(): void {
        this.cidService.getCidByDiagnostico(this.idDiagnostico).pipe(
            catchError(error => {
                console.error('Erro ao carregar cids', error);
                return of({
                    data: {
                        list: [],
                        total: 0,
                        page: 0,
                        pageSize: 0
                    },
                    success: false
                } as PaginatedResponse<Cid>);
            })
        ).subscribe(response => {
            if (response && response.success) {
                this.cids = response.data.list;
            }
        });
    }

    onAddCid(): void {
        this.cidPacienteForm.get('idDiagnostico')?.setValue(this.idDiagnostico);

        if (this.cidPacienteForm.valid) {
            const novoCid = this.cidPacienteForm.value;

            this.cidService.saveCid(novoCid).pipe(
                tap(response => {
                    this.alertService.success('Sucesso!', 'Cid cadastrado com sucesso!');
                    this.cids.push(response.data);
                    this.cidPacienteForm.reset();
                    this.initializeForm();
                }),
                catchError(error => {
                    this.alertService.error('Erro!', 'Erro ao cadastrar o cid.');
                    return of(null); // Retorna um Observable vazio para continuar o fluxo
                })
            ).subscribe();
        }
    }

    onRemoveCid(cid: Cid): void {
        this.cids = this.cids.filter(a => a !== cid);

        this.cidService.delete(cid.id).subscribe(
            () => {
                this.alertService.success('Sucesso!', 'Cid removido com sucesso!');
                this.loadCids();
            },
            (error) => {
                console.error('Erro ao remover cid:', error);
            }
        );
    }
}
