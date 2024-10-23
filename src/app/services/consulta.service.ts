import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConsultaCadastroDTO } from '../models/consulta-cadastro.model';

@Injectable({
    providedIn: 'root'
})
export class ConsultaService {
    private apiUrl = `${environment.apiUrl}consultas`;

    constructor(private http: HttpClient) { }

    salvarConsulta(consultaData: ConsultaCadastroDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}`, consultaData); // Ajuste a URL conforme necessário
    }
}
