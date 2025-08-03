import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TratamentoCadastroDTO } from '../models/tratamento-cadastro.model';

@Injectable({
    providedIn: 'root'
})
export class TratamentoService {
    private apiUrl = `${environment.apiUrl}tratamentos`;

    constructor(private http: HttpClient) { }

    salvarTratamento(Tratamento: TratamentoCadastroDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}`, Tratamento);
    }

    updateTratamento(idTratamento: number, Tratamento: TratamentoCadastroDTO): Observable<any> {
        return this.http.put<void>(`${this.apiUrl}/${idTratamento}`, Tratamento);
    }

    getTratamento(idConsulta: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/consulta/${idConsulta}`);
    }
}
