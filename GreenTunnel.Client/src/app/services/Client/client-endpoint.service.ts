
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { EndpointBase } from '../endpoint-base.service';
import { ConfigurationService } from '../configuration.service';
import { AuthService } from '../auth.service';


@Injectable()
export class ClientEndpointService extends EndpointBase {
    get clientsUrl() { return this.configurations.baseUrl + '/api/client'; }

    constructor(private configurations: ConfigurationService, http: HttpClient, authService: AuthService) {
        super(http, authService)
    }
    getClientsEndpoint<T>(employeId?: number, page?: number, pageSize?: number, searchTerm?: string, sortColumn?: string, sortOrder?: string): Observable<T> {
        const endpointUrl = page && pageSize ? `${this.clientsUrl}/Allclient?pageNumber=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortColumn=${sortColumn}/sortOrder?=${sortOrder}&employeId=${employeId}` : this.clientsUrl;

        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError<T, Observable<T>>((error: any) => {
                return this.handleError(error, () => this.getClientsEndpoint(page, pageSize));
            }));
    }
    getClientsListEndpoint<T>(): Observable<T> {
        const endpointUrl = `${this.clientsUrl}/clients`;

        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError<T, Observable<T>>((error: any) => {
                return this.handleError(error, () => this.getClientEndpoint());
            }));
    }
    getNewClientEndpoint<T>(clientObject: any): Observable<T> {

        return this.http.post<T>(this.clientsUrl, JSON.stringify(clientObject), this.requestHeaders).pipe<T>(
            catchError<T, Observable<T>>(error => {
                return this.handleError(error, () => this.getNewClientEndpoint(clientObject));
            }));
    }
    getUpdateClientEndpoint<T>(clientObject: any, id?: number): Observable<T> {
        const endpointUrl = `${this.clientsUrl}/${id}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(clientObject), this.requestHeaders).pipe<T>(
            catchError<T, Observable<T>>(error => {
                return this.handleError(error, () => this.getUpdateClientEndpoint(clientObject, id));
            }));
    }
    getClientEndpoint<T>(clientId?: string): Observable<T> {
        const endpointUrl = `${this.clientsUrl}/${clientId}`;

        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
            catchError<T, Observable<T>>(error => {
                return this.handleError(error, () => this.getClientEndpoint(clientId));
            })
        );

    }
    //getDeleteWorkplaceEndpoint<T>(workplaceId: string): Observable<T> {
    //    const endpointUrl = `${this.workplacesUrl}/${workplaceId}`;

    //    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
    //        catchError<T, Observable<T>>(error => {
    //            return this.handleError(error, () => this.getDeleteWorkplaceEndpoint(workplaceId));
    //        }));
    //}
    //getWorkplaceDuplicateStatusEndpoint<T>(workplaceName?: string): Observable<T> {
    //    const endpointUrl = `${this.workplacesUrl}/validateDuplicateName/${workplaceName}`;

    //    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
    //        catchError<T, Observable<T>>(error => {
    //            return this.handleError(error, () => this.getWorkplaceDuplicateStatusEndpoint(workplaceName));
    //        })
    //    );

    //}
}
