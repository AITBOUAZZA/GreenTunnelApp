import { Injectable } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { EndpointBase } from '../endpoint-base.service';
import { AuthService } from '../auth.service';
import { EntityType } from 'src/app/models/enums';

@Injectable()
export class TestTypeEndpointService extends EndpointBase  {
  get testTypesUrl() { return this.configurations.baseUrl + '/api/testType'; }

  constructor(private configurations: ConfigurationService, http: HttpClient,authService: AuthService) {
    super(http, authService)
  }
  getTestTypesEndpoint<T>(page?: number, pageSize?: number,searchTerm?:string,sortColumn?:string,sortOrder?:string): Observable<T> {
    const endpointUrl = page && pageSize ? `${this.testTypesUrl}/AlltestTypes?pageNumber=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}&sortColumn=${sortColumn}/sortOrder?=${sortOrder}` : this.testTypesUrl;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError<T, Observable<T>>((error:any) => {
        return this.handleError(error, () => this.getTestTypesEndpoint(page, pageSize));
      }));
    }

    getAvionsListEndpoint<T>(): Observable<T> {
        const endpointUrl = `${this.testTypesUrl}/avions`;

        return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
            catchError<T, Observable<T>>((error: any) => {
                return this.handleError(error, () => this.getAvionsListEndpoint());
            }));
    }

  getTestTypesListEndpoint<T>(): Observable<T> {
    const endpointUrl = `${this.testTypesUrl}/testTypes`;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError<T, Observable<T>>((error:any) => {
        return this.handleError(error, () => this.getTestTypesEndpoint());
      }));
    }


  getNewTestTypesEndpoint<T>(testTypeObject: any): Observable<T> {

    return this.http.post<T>(this.testTypesUrl, JSON.stringify(testTypeObject), this.requestHeaders).pipe<T>(
      catchError<T, Observable<T>>(error => {
        return this.handleError(error, () => this.getNewTestTypesEndpoint(testTypeObject));
      }));
  }
  getUpdateTestTypeEndpoint<T>(testTypeObject: any): Observable<T> {debugger
    const endpointUrl = `${this.testTypesUrl}`;

    return this.http.put<T>(endpointUrl, JSON.stringify(testTypeObject), this.requestHeaders).pipe<T>(
      catchError<T, Observable<T>>(error => {
        return this.handleError(error, () => this.getUpdateTestTypeEndpoint(testTypeObject));
      }));
  }
  getTestTypeEndpoint<T>(testTypeId?: string): Observable<T> {
    const endpointUrl = `${this.testTypesUrl}/${testTypeId}`;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
      catchError<T, Observable<T>>(error => {
        return this.handleError(error, () => this.getTestTypeEndpoint(testTypeId));
      })
    );
    
  }
  getDeleteTestTypeEndpoint<T>(testTypeId: string): Observable<T> {
    const endpointUrl = `${this.testTypesUrl}/${testTypeId}`;

    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError<T, Observable<T>>(error => {
        return this.handleError(error, () => this.getDeleteTestTypeEndpoint(testTypeId));
      }));
  }

  getTestTypeDuplicateStatusEndpoint<T>(testTypeId:number,entityType:EntityType,testTypeName?: string): Observable<T> {
    let endpointUrl: string;

    //switch (entityType) {
      //  case EntityType.TestType:
            endpointUrl = `${this.testTypesUrl}/validateDuplicateName/${testTypeName}/testTypeId/${testTypeId}`;
        //    break;
        //default:
            // Handle a default case if needed
          //  break;
   //}
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe(
        catchError<T, Observable<T>>(error => {
            return this.handleError(error, () => this.getTestTypeDuplicateStatusEndpoint(testTypeId,entityType,testTypeName));
        })
    );

}
}
