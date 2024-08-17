import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { PacienteService } from '../../services/paciente.service';
import { PaginatedResponse } from '../../models/pagination.model';
import { Paciente } from '../../models/paciente.model';
import { Column } from '../base/column';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  columns: Column[] = [
    { header: '#', field: 'id' },
    { header: 'CPF', field: 'pessoa.cpf', format: 'cpf' },
    { header: 'Nome', field: 'pessoa.nome' },
    { header: 'Data Nascimento', field: 'pessoa.dataNascimento', format: 'date' }
  ];

  totalItems: number = 0; // Para paginação
  page: number = 1; // Página atual
  pageSize: number = 10; // Tamanho da página
  totalPages: number = 1; // Total de páginas

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(page: number = 0): void {
    this.pacienteService.getPacientes(page, this.pageSize).pipe(
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
        } as PaginatedResponse<Paciente>);
      })
    ).subscribe(response => {
      if (response && response.success) {
        this.pacientes = response.data.list;
        this.totalItems = response.data.total; // Atualize o totalItems conforme necessário
        this.totalPages = Math.ceil(this.totalItems / this.pageSize); // Calcule o total de páginas
      }
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadPacientes(this.page);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadPacientes(this.page);
    }
  }
}
