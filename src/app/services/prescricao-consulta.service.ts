import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PrescricaoConsultaCadastroDTO } from '../models/prescricao-consulta-cadastro.model';
import { MedicamentoConsultaDTO } from '../models/medicamento-consulta.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
    providedIn: 'root'
})
export class PrescricaoConsultaService {
    private apiUrl = `${environment.apiUrl}prescricoes`;

    constructor(private http: HttpClient) { }

    salvarPrescricaoConsulta(prescricaoConsulta: PrescricaoConsultaCadastroDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}`, prescricaoConsulta);
    }

    updatePrescricaoConsulta(idPrescricaoConsulta: number, prescricaoConsulta: PrescricaoConsultaCadastroDTO): Observable<any> {
        return this.http.put<void>(`${this.apiUrl}/${idPrescricaoConsulta}`, prescricaoConsulta);
    }

    getPrescricaoConsulta(idConsulta: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/consulta/${idConsulta}`);
    }


    // ---- //

    getMedicamentosByPrescricao(idPrescricao: number, page: number = 0, size: number = 10): Observable<PaginatedResponse<MedicamentoConsultaDTO>> {
        if (!idPrescricao) {
            return EMPTY;
        }

        const params = new HttpParams()
            .set('idPrescricao', idPrescricao.toString())
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PaginatedResponse<MedicamentoConsultaDTO>>(`${this.apiUrl}/medicamentos`, { params });
    }

    saveMedicamento(medicamento: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/medicamentos`, medicamento);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/medicamentos/${id}`);
    }
}
