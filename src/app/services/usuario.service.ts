import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/pagination.model';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { UsuarioCadastroDTO } from '../models/usuario-cadastro';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl + 'api/auth';

  constructor(private http: HttpClient) { }

  getUsuarios(page: number = 0, size: number = 10, filters?: any): Observable<PaginatedResponse<Usuario>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<PaginatedResponse<Usuario>>(this.apiUrl, { params });
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  updateUsuario(id: number, usuario: UsuarioCadastroDTO): Observable<any> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, usuario);
  }

  cadastrarUsuario(usuario: UsuarioCadastroDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, usuario);
  }

  alterarStatusUsuario(id: number): Observable<any> {
    return this.http.patch<void>(`${this.apiUrl}/alterar-status/${id}`, {});
  }
}
