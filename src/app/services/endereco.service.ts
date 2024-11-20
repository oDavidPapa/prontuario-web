import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConsultaCadastroDTO } from '../models/consulta-cadastro.model';
import { PaginatedResponse } from '../models/pagination.model';
import { Consulta } from '../models/consulta.model';
import { DiagnosticoCadastroDTO } from '../models/diagnostico-cadastro.model';
import { EnderecoCadastroDTO } from '../models/endereco-cadastro.model';

@Injectable({
    providedIn: 'root'
})
export class EnderecoService {
    private apiUrl = `${environment.apiUrl}enderecos`;

    constructor(private http: HttpClient) { }

    salvarEndereco(endereco: EnderecoCadastroDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}`, endereco);
    }

    updateEndereco(idEndereco: number, endereco: EnderecoCadastroDTO): Observable<any> {
        return this.http.put<void>(`${this.apiUrl}/${idEndereco}`, endereco);
    }

    getEnderecoPessoa(idPessoa: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/pessoa/${idPessoa}`);
    }
}
