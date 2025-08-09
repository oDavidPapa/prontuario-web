import { Component } from '@angular/core';
import { Medico } from '../../../models/medico.model';
import { Column } from '../base/grid/column';
import { MedicoService } from '../../../services/medico.service';
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

  page: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  constructor(private medicoService: MedicoService, private router: Router) { }

  ngOnInit(): void {
    this.loadMedicos(this.page);
  }

  loadMedicos(page: number = 0): void {
    const apiPage = page - 1; 
    this.medicoService.getMedicos(apiPage, this.pageSize).subscribe({
      next: response => {
        if (response.success) {
          this.medicos = response.data.list;
          this.totalItems = response.data.total;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.page = page;
        }
      },
      error: err => {
        console.error(err);
        this.medicos = [];
        this.totalItems = 0;
        this.totalPages = 1;
      }
    });
  }

  onPageChange(newPage: number) {
    this.loadMedicos(newPage);
  }

  editMedico(medico: Medico): void {
    this.router.navigate([`/prontuario/medicos/editar/${medico.id}`]);
  }

}
