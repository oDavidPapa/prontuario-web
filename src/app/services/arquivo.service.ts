import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Arquivo } from '../models/arquivo.model';

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

    getArquivosByExame(exameId: number): Observable<Arquivo[]> {
        return this.http.get<Arquivo[]>(`${this.apiUrl}/exame/${exameId}`);
    }

    deleteArquivo(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
