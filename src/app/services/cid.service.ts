import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginatedResponse } from '../models/pagination.model';
import { Cid } from '../models/cid.model';

@Injectable({
    providedIn: 'root'
})
export class CidService {

    private apiUrl = `${environment.apiUrl}cids`;

    constructor(private http: HttpClient) { }

    getCids(): Observable<Cid[]> {
        return this.http.get<Cid[]>(this.apiUrl);
    }

    getCidByDiagnostico(idDiagnostico: number, page: number = 0, size: number = 10): Observable<PaginatedResponse<Cid>> {
        if (!idDiagnostico) {
            return EMPTY;
        }
        const params = new HttpParams()
            .set('idDiagnostico', idDiagnostico.toString())
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PaginatedResponse<Cid>>(this.apiUrl, { params });
    }

    saveCid(cid: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, cid);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
