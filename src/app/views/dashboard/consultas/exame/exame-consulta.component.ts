import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { Column } from '../../base/grid/column';
import { AlertService } from '../../base/alert/alert.service';
import { PaginatedResponse } from '../../../../models/pagination.model';
import { ExameConsulta } from '../../../../models/exame-consulta.model';
import { ExameConsultaService } from '../../../../services/exame-consulta.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exame-consulta',
  templateUrl: './exame-consulta.component.html',
  styleUrls: ['./exame-consulta.component.css']
})
export class ExameConsultaComponent implements OnInit, OnChanges {
  exameConsultaForm!: FormGroup;

  exames: ExameConsulta[] = [];

  @Input() idConsulta!: any;
  @Output() examesAtualizados = new EventEmitter<any[]>();

  columns: Column[] = [
    { header: 'Descrição', field: 'descricao', align: 'left' }
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private exameConsultaService: ExameConsultaService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadExames()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idConsulta'] && this.idConsulta) {
      this.initializeForm();
      this.loadExames()
    }
  }

  private initializeForm(): void {
    this.exameConsultaForm = this.fb.group({
      id: [],
      idConsulta: [this.idConsulta, Validators.required],
      descricao: ['', Validators.required]
    });
  }

  private loadExames(): void {
    this.reloadConsultaId();
    this.exameConsultaService.getExameByConsulta(this.idConsulta).pipe(
      catchError(error => {
        console.error('Erro ao carregar exames', error);
        return of({
          data: {
            list: [],
            total: 0,
            page: 0,
            pageSize: 0
          },
          success: false
        } as PaginatedResponse<ExameConsulta>);
      })
    ).subscribe(response => {
      if (response && response.success) {
        this.exames = response.data.list;
      }
    });
  }

  onAddExame(): void {
    this.reloadConsultaId();
    if (this.exameConsultaForm.valid) {
      const novoExame = this.exameConsultaForm.value;

      this.exameConsultaService.saveExameConsulta(novoExame).pipe(
        tap(response => {
          this.alertService.success('Sucesso!', 'Solicitação de exame cadastrada com sucesso!');
          this.exames.push(response.data);
          this.exameConsultaForm.reset();
          this.initializeForm();
        }),
        catchError(error => {
          this.alertService.error('Erro!', 'Erro ao cadastrar a solicitação de exame.');
          return of(null);
        })
      ).subscribe();
    }
  }

  onRemoveExame(exame: ExameConsulta): void {
    this.exames = this.exames.filter(a => a !== exame);

    this.exameConsultaService.delete(exame.id).subscribe(
      () => {
        this.alertService.success('Sucesso!', 'Solicitação de exame removida com sucesso!');
        this.loadExames();
      },
      (error) => {
        console.error('Erro ao remover solicitação de exame:', error);
      }
    );
  }

  private reloadConsultaId() {
    this.idConsulta = this.route.snapshot.paramMap.get('id');
  }
}


