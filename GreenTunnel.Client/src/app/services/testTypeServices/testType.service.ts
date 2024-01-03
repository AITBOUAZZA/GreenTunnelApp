import { Injectable } from '@angular/core';
import { RolesChangedEventArg, RolesChangedOperation } from '../account.service';
import { Observable, Subject, mergeMap } from 'rxjs';
import { TestTypeEndpointService } from './testType-endpoint.service';


import { TestTypeRequest } from '../../models/testType-request.model';
import { TestTypeList } from '../../models/testType-list.model';
import { TestType } from 'src/app/models/testType.model';
import { EntityType } from 'src/app/models/enums';
import { AvionList } from '../../models/avion-list.model';

@Injectable()
export class TestTypeService {
  public static readonly roleAddedOperation: RolesChangedOperation = 'add';
  public static readonly roleDeletedOperation: RolesChangedOperation = 'delete';
  public static readonly roleModifiedOperation: RolesChangedOperation = 'modify';

  private rolesChanged = new Subject<RolesChangedEventArg>();
  constructor( private testTypeEndpoint: TestTypeEndpointService) { }
  getTestTypes(page?: number, pageSize?: number,searchTerm?:string,sortColumn?:string,sortOrder?:string) {
    return this.testTypeEndpoint.getTestTypesEndpoint<TestType[]>(page, pageSize,searchTerm,sortColumn,sortOrder);
    }

    getAvionsListByAvion() {
        return this.testTypeEndpoint.getAvionsListEndpoint<AvionList[]>();
    }


  getTestTypesList() {
    return this.testTypeEndpoint.getTestTypesListEndpoint<TestTypeList[]>();
  }
  createTestType(testType: TestTypeRequest) {
    return this.testTypeEndpoint.getNewTestTypesEndpoint<TestType>(testType);
  }  
  updateTestType(testType: TestTypeRequest) {
    return this.testTypeEndpoint.getUpdateTestTypeEndpoint<TestType>(testType);
  }
  getTestType(testTypeId?: string) {  
    return this.testTypeEndpoint.getTestTypeEndpoint<TestType>(testTypeId);
  }
  deleteTestType(testTypeOrtestTypeId: string | TestType): Observable<TestType> {


    if (typeof testTypeOrtestTypeId === 'string' || testTypeOrtestTypeId instanceof String) {
      console.log("got into delete for real  ");
      console.log (testTypeOrtestTypeId);
      return this.testTypeEndpoint.getDeleteTestTypeEndpoint<TestType>(testTypeOrtestTypeId as string);
    } else {
      if (testTypeOrtestTypeId.id) {
        return this.deleteTestType(testTypeOrtestTypeId.id);
      } else {
        throw new Error("Invalid testTypeOrtestTypeId"); // Add this line to handle the case where id does not exist
      }
    }
  }

  getTestTypeDuplicateStatus(testTypeId:number,entityType:EntityType,testTypeName?: string) {
    return this.testTypeEndpoint.getTestTypeDuplicateStatusEndpoint<boolean>(testTypeId, entityType,testTypeName);
}
  
}
