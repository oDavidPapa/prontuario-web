import { Component } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { Column } from '../base/grid/column';
import { MedicoService } from '../../services/medico.service';
import { catchError, of } from 'rxjs';
import { PaginatedResponse } from '../../models/pagination.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrl: './medicos.component.css'
})
export class MedicosComponent {

  medicos: Medico[] = [];
  columns: Column[] = [
    { header: '#', field: 'id' },
    { header: 'CPF', field: 'pessoa.cpf', format: 'cpf' },
    { header: 'CRM', field: 'crm' },
    { header: 'Nome', field: 'pessoa.nome' },
    { header: 'Data Nascimento', field: 'pessoa.dataNascimento', format: 'date' }
  ];

  totalItems: number = 0; // Para paginação
  page: number = 0; // Página atual
  pageSize: number = 10; // Tamanho da página
  totalPages: number = 1; // Total de páginas

  constructor(private medicoService: MedicoService, private router: Router) { }

  ngOnInit(): void {
    this.loadMedicos();
  }

  loadMedicos(page: number = 0): void {
    this.medicoService.getMedicos(page, this.pageSize).pipe(
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
        } as PaginatedResponse<Medico>);
      })
    ).subscribe(response => {
      if (response && response.success) {
        this.medicos = response.data.list;
        this.totalItems = response.data.total; // Atualize o totalItems conforme necessário
        this.totalPages = Math.ceil(this.totalItems / this.pageSize); // Calcule o total de páginas
      }
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadMedicos(this.page);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadMedicos(this.page);
    }
  }

  editMedico(medico: Medico): void {
    this.router.navigate([`/prontuario/medicos/editar/${medico.id}`]);
  }

}
