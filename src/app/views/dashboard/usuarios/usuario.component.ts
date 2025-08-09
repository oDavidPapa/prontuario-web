import { Component } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { Column } from '../base/grid/column';
import { PaginatedResponse } from '../../../models/pagination.model';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';
import { AlertService } from '../base/alert/alert.service';
import { FilterField } from '../../../models/filter-field.model';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {

  usuarios: Usuario[] = [];
  columns: Column[] = [
    { header: '#', field: 'id' },
    { header: 'Login', field: 'login' },
    { header: 'Perfil', field: 'role' },
    { header: 'Nome', field: 'pessoa.nome' },
    { header: 'Status', field: 'status', format: 'status' }];

  filters: any = {};

  filterFields: FilterField[] = [
    { label: 'Login', name: 'login', type: 'text' },
    { label: 'Nome', name: 'nome', type: 'text' }
  ];

  page: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.loadUsuarios(this.page);
  }

  loadUsuarios(page: number = 0): void {
    const apiPage = page - 1;
    this.usuarioService.getUsuarios(apiPage, this.pageSize, this.filters).pipe(
      catchError(error => {
        return of({
          data: {
            list: [],
            total: 0,
            page: apiPage,
            pageSize: this.pageSize
          },
          success: false
        } as PaginatedResponse<Usuario>);
      })
    ).subscribe(response => {
      if (response && response.success) {
        this.usuarios = response.data.list;
        this.totalItems = response.data.total;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.page = page;
      }
    });
  }

  onFilterChange(newFilters: any) {
    this.filters = newFilters;
    this.page = 1;
    this.loadUsuarios(this.page);
  }

  onPageChange(newPage: number) {
    this.loadUsuarios(newPage);
  }

  editUsuario(usuario: Usuario): void {
    this.router.navigate([`/prontuario/usuarios/editar/${usuario.id}`]);
  }

  toggleStatus(usuario: Usuario): void {
    this.usuarioService.alterarStatusUsuario(usuario.id).pipe(
      tap(() => {
        this.alertService.success('Sucesso!', 'Status do usuário alterado com sucesso!');
        this.loadUsuarios(this.page);
      }),
      catchError((error) => {
        this.alertService.error('Erro!', 'Erro ao alterar o status do usuário.');
        return of(null);
      })
    ).subscribe();
  }
}

