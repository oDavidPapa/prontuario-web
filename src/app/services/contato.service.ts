import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginatedResponse } from '../models/pagination.model';
import { Contato } from '../models/contato.model';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  private apiUrl = `${environment.apiUrl}contatos`;

  constructor(private http: HttpClient) { }

  saveContato(contato: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, contato);
  }

  getContatosByPessoa(idPessoa: number, page: number = 0, size: number = 10): Observable<PaginatedResponse<Contato>> {
    const params = new HttpParams()
      .set('idPessoa', idPessoa.toString())
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Contato>>(this.apiUrl, { params });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
