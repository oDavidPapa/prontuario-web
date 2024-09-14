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

  getUsuarios(page: number = 0, size: number = 10): Observable<PaginatedResponse<Usuario>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Usuario>>(this.apiUrl, { params });
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get<Usuario>(`${this.apiUrl}api/auth/${id}`);
  }

  updateUsuario(id: number, usuario: UsuarioCadastroDTO): Observable<any> {
    return this.http.put<void>(`${this.apiUrl}api/auth/${id}`, usuario);
  }

  cadastrarUsuario(usuario: UsuarioCadastroDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, usuario);
  }

}
