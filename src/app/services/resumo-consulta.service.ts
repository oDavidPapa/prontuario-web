import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumoConsultaService {
  private apiUrl = `${environment.apiUrl}resumo-consulta`;

  constructor(private http: HttpClient) { }

  getResumoConsulta(idConsulta: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idConsulta}`);
  }
}
