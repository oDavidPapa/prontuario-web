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
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPacientes(page: number = 0, size: number = 10): Observable<PaginatedResponse<Paciente>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Paciente>>(this.apiUrl + "pacientes", { params });
  }

  getPacienteById(id: number): Observable<any> {
    return this.http.get<Paciente>(`${this.apiUrl}pacientes/${id}`);
  }

  updatePaciente(id: number, paciente: PacienteCadastroDTO): Observable<any> {
    return this.http.put<void>(`${this.apiUrl}pacientes/${id}`, paciente);
  }

  cadastrarPaciente(paciente: PacienteCadastroDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}pacientes`, paciente);
  }

}
