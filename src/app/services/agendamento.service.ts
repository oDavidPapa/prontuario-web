import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/pagination.model';
import { environment } from '../../environments/environment';
import { Agendamento } from '../models/agendamento.model';
import { AgendamentoCadastroDTO } from '../models/agendamento-cadastro.model';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private apiUrl = environment.apiUrl + "agenda-consulta";

  constructor(private http: HttpClient) { }

  getAgendamentos(page: number = 0, size: number = 10, filters?: any): Observable<PaginatedResponse<Agendamento>> {
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
    return this.http.get<PaginatedResponse<Agendamento>>(this.apiUrl, { params });
  }

  getAgendamentoById(id: number): Observable<any> {
    return this.http.get<Agendamento>(`${this.apiUrl}/${id}`);
  }

  updateAgendamento(id: number, agendamento: AgendamentoCadastroDTO): Observable<any> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, agendamento);
  }

  cadastrarAgendamento(agendamento: AgendamentoCadastroDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, agendamento);
  }

  createConsulta(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/consulta`, null);
  }
}
