import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { Column } from '../../base/grid/column';
import { AlertService } from '../../base/alert/alert.service';
import { PaginatedResponse } from '../../../models/pagination.model';
import { AlergiaPaciente } from '../../../models/alergia-paciente.model';
import { AlergiaPacienteService } from '../../../services/alergia-paciente.service';

@Component({
  selector: 'app-alergia-paciente',
  templateUrl: './alergia-paciente.component.html',
  styleUrls: ['./alergia-paciente.component.css']
})
export class AlergiaPacienteComponent implements OnInit, OnChanges {
  alergiaPacienteForm!: FormGroup;

  alergias: AlergiaPaciente[] = [];

  @Input() idPaciente!: number;

  @Output() contatosAtualizados = new EventEmitter<any[]>();
  @Output() alergiasAtualizadas = new EventEmitter<any[]>();


  columns: Column[] = [
    { header: 'Id', field: 'id' },
    { header: 'Descrição', field: 'descricao' }
  ];

  constructor(
    private fb: FormBuilder,
    private alergiaPacienteService: AlergiaPacienteService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadAlergias()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idPaciente'] && this.idPaciente) {
      this.initializeForm();
      this.loadAlergias()
    }
  }

  private initializeForm(): void {
    this.alergiaPacienteForm = this.fb.group({
      id: [],
      idPaciente: [this.idPaciente, Validators.required],
      descricao: ['', Validators.required]
    });
  }

  private loadAlergias(): void {
    this.alergiaPacienteService.getAlergiasByPaciente(this.idPaciente).pipe(
      catchError(error => {
        console.error('Erro ao carregar alergias', error);
        return of({
          data: {
            list: [],
            total: 0,
            page: 0,
            pageSize: 0
          },
          success: false
        } as PaginatedResponse<AlergiaPaciente>);
      })
    ).subscribe(response => {
      if (response && response.success) {
        this.alergias = response.data.list;
      }
    });
  }

  onAddAlergia(): void {
    if (this.alergiaPacienteForm.valid) {
      const novaAlergia = this.alergiaPacienteForm.value;

      this.alergiaPacienteService.saveAlergia(novaAlergia).pipe(
        tap(response => {
          this.alertService.success('Sucesso!', 'Alergia cadastrada com sucesso!');
          this.alergias.push(response.data);
          this.alergiaPacienteForm.reset();
          this.initializeForm();
        }),
        catchError(error => {
          this.alertService.error('Erro!', 'Erro ao cadastrar a alergia.');
          return of(null); // Retorna um Observable vazio para continuar o fluxo
        })
      ).subscribe();
    }
  }

  onRemoveAlergia(alergia: AlergiaPaciente): void {
    this.alergias = this.alergias.filter(a => a !== alergia);

    this.alergiaPacienteService.delete(alergia.id).subscribe(
      () => {
        this.alertService.success('Sucesso!', 'Alergia removida com sucesso!');
        this.loadAlergias();
      },
      (error) => {
        console.error('Erro ao remover alergia:', error);
      }
    );
  }
}
