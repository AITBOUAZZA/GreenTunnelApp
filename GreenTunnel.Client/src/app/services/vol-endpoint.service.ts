import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { EndpointBase } from './endpoint-base.service';
import { AuthService } from './auth.service';

@Injectable()
export class VolEndpointService extends EndpointBase {
    get volsUrl() { return this.configurations.baseUrl + '/api/vol'; }

    constructor(private configurations: ConfigurationService, http: HttpClient, authService: AuthService) {
        super(http, authService)
    }
    getVolsEndpoint<T>(volId?: number, page?: number, pageSize?: number, searchTerm?: string, sortColumn?: string, sortOrder?: string): Observable<T> {
        const endpointUrl = page && pageSize ? `${this.volsUrl}/Allworkspaces?pageNumber=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortColumn=${sortColumn}/sortOrder?=${sortOrder}&workplaceId=${volId}` : this.volsUrl;

        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError<T, Observable<T>>((error: any) => {
                return this.handleError(error, () => this.getVolsEndpoint(page, pageSize));
            }));
    }

    getVolEndpoint<T>(volId?: string): Observable<T> {
        const endpointUrl = `${this.volsUrl}/${volId}`;

        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
            catchError<T, Observable<T>>(error => {
                return this.handleError(error, () => this.getVolEndpoint(volId));
            })
        );

    }

    getVolsListEndpoint<T>(): Observable<T> {
        debugger
        const endpointUrl = `${this.volsUrl}/vol`;

        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError<T, Observable<T>>((error: any) => {
                return this.handleError(error, () => this.getVolsEndpoint());
            }));
    }
    getNewVolEndpoint<T>(volObject: any): Observable<T> {

        return this.http.post<T>(this.volsUrl, JSON.stringify(volObject), this.requestHeaders).pipe<T>(
            catchError<T, Observable<T>>(error => {
                return this.handleError(error, () => this.getNewVolEndpoint(volObject));
            }));
    }
   
    getUpdateVolEndpoint<T>(volObject: any, id?: number): Observable<T> {
        const endpointUrl = `${this.volsUrl}/${id}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(volObject), this.requestHeaders).pipe<T>(
            catchError<T, Observable<T>>(error => {
                return this.handleError(error, () => this.getUpdateVolEndpoint(volObject, id));
            }));
    }

}
