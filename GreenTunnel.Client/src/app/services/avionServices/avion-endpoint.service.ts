import { Injectable } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { EndpointBase } from '../endpoint-base.service';
import { AuthService } from '../auth.service';
import { EntityType } from 'src/app/models/enums';

@Injectable({
  providedIn: 'root'
})
export class AvionEndpointService  extends EndpointBase {

 

  constructor(private configurations: ConfigurationService, http: HttpClient,authService: AuthService) {
    super(http, authService)
  }

  get avionsUrl() { return this.configurations.baseUrl + '/api/avion'; }

  getDeleteAvionEndpoint<T>(avionId: string): Observable<T> {
    const endpointUrl = `${this.avionsUrl}/${avionId}`;

    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError<T, Observable<T>>(error => {
        return this.handleError(error, () => this.getDeleteAvionEndpoint(avionId));
      }));
  }
 
  getVolsByAvionAndPilote <T> (avionId?: string, piloteId?: string) : Observable<T>{
    const endpointUrl = `${this.avionsUrl}/VolByPiloteByAvion?avionId=${avionId}&piloteId=${piloteId}`;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError<T, Observable<T>>((error:any) => {
        return this.handleError(error, () => this.getVolsByAvionAndPilote(avionId, piloteId));
      }));
  }

    getAvionsEndpoint<T>(page?: number, pageSize?: number, searchTerm?: string, sortColumn?: string, sortOrder?: string): Observable<T> {
        const endpointUrl = page && pageSize ? `${this.avionsUrl}/Allavions?pageNumber=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortColumn=${sortColumn}/sortOrder?=${sortOrder}` : this.avionsUrl;
        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError<T, Observable<T>>((error: any) => {
                return this.handleError(error, () => this.getAvionsEndpoint(page, pageSize));
            }));
    }

  getAvionsListEndpoint<T>(): Observable<T> {
    const endpointUrl = `${this.avionsUrl}/avions`;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError<T, Observable<T>>((error:any) => {
        return this.handleError(error, () => this.getAvionsListEndpoint());
      }));
  }
}
