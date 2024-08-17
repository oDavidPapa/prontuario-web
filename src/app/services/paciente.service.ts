import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/pagination.model';
import { Paciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://localhost:8080/pacientes'; // Ajuste conforme necessário

  constructor(private http: HttpClient) {}

  getPacientes(page: number = 0, size: number = 10): Observable<PaginatedResponse<Paciente>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
            
    return this.http.get<PaginatedResponse<Paciente>>(this.apiUrl, { params });
  }
}
