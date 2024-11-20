import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConsultaCadastroDTO } from '../models/consulta-cadastro.model';
import { PaginatedResponse } from '../models/pagination.model';
import { Consulta } from '../models/consulta.model';
import { DiagnosticoCadastroDTO } from '../models/diagnostico-cadastro.model';

@Injectable({
    providedIn: 'root'
})
export class DiagnosticoService {
    private apiUrl = `${environment.apiUrl}diagnosticos`;

    constructor(private http: HttpClient) { }

    salvarDiagnostico(diagnostico: DiagnosticoCadastroDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}`, diagnostico);
    }

    updateDiagnostico(idDiagnostico: number, diagnostico: DiagnosticoCadastroDTO): Observable<any> {
        return this.http.put<void>(`${this.apiUrl}/${idDiagnostico}`, diagnostico);
    }

    getConsultas(page: number = 0, size: number = 10): Observable<PaginatedResponse<Consulta>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PaginatedResponse<Consulta>>(this.apiUrl, { params });
    }

    getDiagnostico(idConsulta: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/consulta/${idConsulta}`);
    }
}
