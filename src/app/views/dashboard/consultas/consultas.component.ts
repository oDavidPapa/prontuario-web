import { Component } from '@angular/core';
import { Column } from '../base/grid/column';
import { Consulta } from '../../../models/consulta.model';
import { ConsultaService } from '../../../services/consulta.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { PaginatedResponse } from '../../../models/pagination.model';

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

  totalItems: number = 0; // Para paginação
  page: number = 0; // Página atual
  pageSize: number = 10; // Tamanho da página
  totalPages: number = 1; // Total de páginas

  constructor(private consultaService: ConsultaService, private router: Router) { }


  ngOnInit(): void {
    this.carregarConsultas();
  }

  carregarConsultas(page: number = 0): void {
    this.consultaService.getConsultas(page, this.pageSize).pipe(
      catchError(error => {
        console.error(error);
        // Ajuste a resposta para o formato esperado em caso de erro
        return of({
          data: {
            list: [],
            total: 0,
            page: page,
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
      }
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.carregarConsultas(this.page);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.carregarConsultas(this.page);
    }
  }

  editarConsulta(consulta: Consulta): void {
    this.router.navigate([`/prontuario/consultas/editar/${consulta.id}`]);
  }
}
