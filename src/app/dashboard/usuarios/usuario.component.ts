import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Column } from '../base/grid/column';
import { PaginatedResponse } from '../../models/pagination.model';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

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

  totalItems: number = 0; // Para paginação
  page: number = 0; // Página atual
  pageSize: number = 10; // Tamanho da página
  totalPages: number = 1; // Total de páginas

  constructor(private pacienteService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(page: number = 0): void {
    this.pacienteService.getUsuarios(page, this.pageSize).pipe(
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
        } as PaginatedResponse<Usuario>);
      })
    ).subscribe(response => {
      if (response && response.success) {
        this.usuarios = response.data.list;
        this.totalItems = response.data.total; // Atualize o totalItems conforme necessário
        this.totalPages = Math.ceil(this.totalItems / this.pageSize); // Calcule o total de páginas
      }
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadUsuarios(this.page);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadUsuarios(this.page);
    }
  }

  editUsuario(usuario: Usuario): void {
    this.router.navigate([`/prontuario/usuarios/editar/${usuario.id}`]);
  }
}

