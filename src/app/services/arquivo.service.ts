import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Arquivo } from '../models/arquivo.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
    providedIn: 'root'
})
export class ArquivoService {
    private apiUrl = `${environment.apiUrl}arquivos`;

    constructor(private http: HttpClient) { }

    uploadArquivo(arquivo: File, descricao: string, nome: string, idConsulta: number): Observable<Arquivo> {
        const formData = new FormData();
        formData.append('arquivo', arquivo);
        formData.append('descricao', descricao);
        formData.append('nome', nome);
        formData.append('idConsulta', idConsulta.toString());

        return this.http.post<Arquivo>(`${this.apiUrl}/upload`, formData);
    }

    getArquivosByConsulta(idConsulta: number): Observable<PaginatedResponse<Arquivo>> {
        return this.http.get<PaginatedResponse<Arquivo>>(`${this.apiUrl}/consulta/${idConsulta}`);
    }

    deleteArquivo(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    downloadArquivo(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
}
}
