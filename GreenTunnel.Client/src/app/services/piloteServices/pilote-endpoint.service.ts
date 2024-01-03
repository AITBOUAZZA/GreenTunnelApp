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
export class PiloteEndpointService extends EndpointBase {

  get pilotesUrl() { return this.configurations.baseUrl + '/api/pilote'; }

  constructor(private configurations: ConfigurationService, http: HttpClient,authService: AuthService) {
    super(http, authService)
  }

  getPilotesEndpoint<T>(page?: number, pageSize?: number,searchTerm?:string,sortColumn?:string,sortOrder?:string): Observable<T> {
    const endpointUrl = page && pageSize ? `${this.pilotesUrl}/Allpilotes?pageNumber=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortColumn=${sortColumn}/sortOrder?=${sortOrder}` : this.pilotesUrl;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError<T, Observable<T>>((error:any) => {
        return this.handleError(error, () => this.getPilotesEndpoint(page, pageSize));
      }));
  }
  getPilotesListEndpoint<T>(): Observable<T> {
    const endpointUrl = `${this.pilotesUrl}/pilotes`;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError<T, Observable<T>>((error:any) => {
        return this.handleError(error, () => this.getPilotesEndpoint());
      }));
  }
  getNewPiloteEndpoint<T>(piloteObject: any): Observable<T> {

    return this.http.post<T>(this.pilotesUrl, JSON.stringify(piloteObject), this.requestHeaders).pipe<T>(
      catchError<T, Observable<T>>(error => {
        return this.handleError(error, () => this.getNewPiloteEndpoint(piloteObject));
      }));
  }
  getUpdatePiloteEndpoint<T>(piloteObject: any): Observable<T> {debugger
    const endpointUrl = `${this.pilotesUrl}`;

    return this.http.put<T>(endpointUrl, JSON.stringify(piloteObject), this.requestHeaders).pipe<T>(
      catchError<T, Observable<T>>(error => {
        return this.handleError(error, () => this.getUpdatePiloteEndpoint(piloteObject));
      }));
  }
  getPiloteEndpoint<T>(piloteId?: string): Observable<T> {
    const endpointUrl = `${this.pilotesUrl}/${piloteId}`;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
      catchError<T, Observable<T>>(error => {
        return this.handleError(error, () => this.getPiloteEndpoint(piloteId));
      })
    );
    
  }
  getDeletePiloteEndpoint<T>(piloteId: string): Observable<T> {
    const endpointUrl = `${this.pilotesUrl}/${piloteId}`;

    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError<T, Observable<T>>(error => {
        return this.handleError(error, () => this.getDeletePiloteEndpoint(piloteId));
      }));
  }

  
//   getPiloteDuplicateStatusEndpoint<T>(piloteId:number,entityType:EntityType,piloteName?: string): Observable<T> {
//     let endpointUrl: string;

//     //switch (entityType) {
//       //  case EntityType.TestType:
//             endpointUrl = `${this.pilotesUrl}/validateDuplicateName/${piloteName}/numPilote/${piloteId}`;
//         //    break;
//         //default:
//             // Handle a default case if needed
//           //  break;
//    //}
//     return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
//         catchError<T, Observable<T>>(error => {
//             return this.handleError(error, () => this.getPiloteDuplicateStatusEndpoint(piloteId,entityType,piloteName));
//         })
//     );

// }
}
