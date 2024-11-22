import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginatedResponse } from '../models/pagination.model';
import { AlergiaPaciente } from '../models/alergia-paciente.model';

@Injectable({
    providedIn: 'root'
})
export class AlergiaPacienteService {
    private apiUrl = `${environment.apiUrl}alergias-paciente`;

    constructor(private http: HttpClient) { }

    saveAlergia(alergiaPaciente: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, alergiaPaciente);
    }

    getAlergiasByPaciente(idPaciente: number, page: number = 0, size: number = 10): Observable<PaginatedResponse<AlergiaPaciente>> {
        const params = new HttpParams()
            .set('idPaciente', idPaciente.toString())
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PaginatedResponse<AlergiaPaciente>>(this.apiUrl, { params });
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
