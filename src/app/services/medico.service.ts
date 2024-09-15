import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/pagination.model';
import { environment } from '../../environments/environment';
import { Medico } from '../models/medico.model';
import { MedicoCadastroDTO } from '../models/medico-cadastro.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMedicos(page: number = 0, size: number = 10): Observable<PaginatedResponse<Medico>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Medico>>(this.apiUrl + "medicos", { params });
  }

  getOptionsMedico(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "medicos/options");
  }

  getMedicoById(id: number): Observable<any> {
    return this.http.get<Medico>(`${this.apiUrl}medicos/${id}`);
  }

  updateMedico(id: number, medico: MedicoCadastroDTO): Observable<any> {
    return this.http.put<void>(`${this.apiUrl}medicos/${id}`, medico);
  }

  cadastrarMedico(medico: MedicoCadastroDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}medicos`, medico);
  }

}
