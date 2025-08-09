import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { PacienteService } from '../../../services/paciente.service';
import { PaginatedResponse } from '../../../models/pagination.model';
import { Paciente } from '../../../models/paciente.model';
import { Router } from '@angular/router';
import { Column } from '../base/grid/column';

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

  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private pacienteService: PacienteService, private router: Router) { }

  ngOnInit(): void {
    this.loadPacientes(this.page);
  }

  loadPacientes(page: number = 1): void {
    const apiPage = page - 1; 
    this.pacienteService.getPacientes(apiPage, this.pageSize).pipe(
      catchError(error => {
        console.error(error);
        return of({
          data: {
            list: [],
            total: 0,
            page: apiPage,
            pageSize: this.pageSize
          },
          success: false
        } as PaginatedResponse<Paciente>);
      })
    ).subscribe(response => {
      if (response && response.success) {
        this.pacientes = response.data.list;
        this.totalItems = response.data.total;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.page = page;
      }
    });
  }

  onPageChange(newPage: number) {
    this.loadPacientes(newPage);
  }


  editPaciente(paciente: Paciente): void {
    this.router.navigate([`/prontuario/pacientes/editar/${paciente.id}`]);
  }
}
