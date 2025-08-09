import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/pagination.model';
import { Paciente } from '../models/paciente.model';
import { environment } from '../../environments/environment';
import { PacienteCadastroDTO } from '../models/paciente-cadastro.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = environment.apiUrl + "pacientes";

  constructor(private http: HttpClient) { }

  getPacientes(page: number = 0, size: number = 10, filters?: any): Observable<PaginatedResponse<Paciente>> {
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

    return this.http.get<PaginatedResponse<Paciente>>(this.apiUrl, { params });
  }

  getPacienteById(id: number): Observable<any> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  updatePaciente(id: number, paciente: PacienteCadastroDTO): Observable<any> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, paciente);
  }

  cadastrarPaciente(paciente: PacienteCadastroDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, paciente);
  }

  getOptionsPaciente(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "/options");
  }

}
