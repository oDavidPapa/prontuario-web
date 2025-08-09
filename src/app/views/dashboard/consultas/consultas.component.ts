import { Component } from '@angular/core';
import { Column } from '../base/grid/column';
import { Consulta } from '../../../models/consulta.model';
import { ConsultaService } from '../../../services/consulta.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { PaginatedResponse } from '../../../models/pagination.model';
import { FilterField } from '../../../models/filter-field.model';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent {

  consultas: Consulta[] = [];
  columns: Column[] = [
    { header: '#', field: 'id' },
    { header: 'Data', field: 'data', format: 'date' },
    { header: 'Médico', field: 'medico.pessoa.nome' },
    { header: 'Paciente', field: 'paciente.pessoa.nome' },
    { header: 'Tipo', field: 'tipo' }
  ];

  filters: any = {};

  filterFields: FilterField[] = [
    { label: 'ID Consulta', name: 'idConsulta', type: 'text' },
    { label: 'CPF Paciente', name: 'cpfPaciente', type: 'text' },
    { label: 'Nome Paciente', name: 'nomePaciente', type: 'text' },
    { label: 'Nome Médico', name: 'nomeMedico', type: 'text' },
    { label: 'Data Início', name: 'dataInicio', type: 'date' },
    { label: 'Data Fim', name: 'dataFim', type: 'date' },
  ];

  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private consultaService: ConsultaService, private router: Router) { }

  ngOnInit(): void {
    this.carregarConsultas(this.page);
  }

  carregarConsultas(page: number = 1): void {
    const apiPage = page - 1;
    this.consultaService.getConsultas(apiPage, this.pageSize, this.filters).pipe(
      catchError(error => {
        return of({
          data: {
            list: [],
            total: 0,
            page: apiPage,
            pageSize: this.pageSize
          },
          success: false
        } as PaginatedResponse<Consulta>);
      })
    ).subscribe(response => {
      if (response && response.success) {
        this.consultas = response.data.list;
        this.totalItems = response.data.total;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.page = page;
      }
    });
  }

  onFilterChange(newFilters: any) {
    this.filters = newFilters;
    this.page = 1;
    this.carregarConsultas(this.page);
  }

  onPageChange(newPage: number) {
    this.carregarConsultas(newPage);
  }


  editarConsulta(consulta: Consulta): void {
    this.router.navigate([`/prontuario/consultas/editar/${consulta.id}`]);
  }
}
