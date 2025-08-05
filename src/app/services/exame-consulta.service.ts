import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginatedResponse } from '../models/pagination.model';
import { ExameConsulta } from '../models/exame-consulta.model';

@Injectable({
    providedIn: 'root'
})
export class ExameConsultaService {
    private apiUrl = `${environment.apiUrl}exame-consulta`;

    constructor(private http: HttpClient) { }

    saveExameConsulta(exameConsulta: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, exameConsulta);
    }

    getExameByConsulta(idConsulta: any, page: number = 0, size: number = 10): Observable<PaginatedResponse<ExameConsulta>> {
        const params = new HttpParams()
            .set('idConsulta', idConsulta.toString())
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PaginatedResponse<ExameConsulta>>(this.apiUrl, { params });
    }

    delete(id: any): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
