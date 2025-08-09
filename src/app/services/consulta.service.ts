import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConsultaCadastroDTO } from '../models/consulta-cadastro.model';
import { PaginatedResponse } from '../models/pagination.model';
import { Consulta } from '../models/consulta.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private apiUrl = `${environment.apiUrl}consultas`;

  constructor(private http: HttpClient) { }

  salvarConsulta(consultaData: ConsultaCadastroDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}`, consultaData);
  }

  updateConsulta(idConsulta: number, consultaData: ConsultaCadastroDTO): Observable<any> {
    return this.http.put<void>(`${this.apiUrl}/${idConsulta}`, consultaData);
  }

  getConsultas(page: number = 0, size: number = 10, filters?: any): Observable<PaginatedResponse<Consulta>> {
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

    return this.http.get<PaginatedResponse<Consulta>>(this.apiUrl, { params });
  }

  getConsultaById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
