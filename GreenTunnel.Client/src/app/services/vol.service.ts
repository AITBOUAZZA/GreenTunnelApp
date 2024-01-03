import { Injectable } from '@angular/core';
import { RolesChangedEventArg, RolesChangedOperation } from './account.service';
import { Observable, Subject, mergeMap } from 'rxjs';

import { VolEndpointService } from './vol-endpoint.service';
import { Vol } from '../models/vol.model';
import { VolRequest } from '../models/vol-request.model';

@Injectable()
export class VolService {
    public static readonly roleAddedOperation: RolesChangedOperation = 'add';
    public static readonly roleDeletedOperation: RolesChangedOperation = 'delete';
    public static readonly roleModifiedOperation: RolesChangedOperation = 'modify';

    private rolesChanged = new Subject<RolesChangedEventArg>();
    constructor(private volEndpoint: VolEndpointService) { }

   
    getVols(volId?: number, page?: number, pageSize?: number, searchTerm?: string, sortColumn?: string, sortOrder?: string) {
        return this.volEndpoint.getVolsEndpoint<Vol[]>(volId, page, pageSize, searchTerm, sortColumn, sortOrder);
    }

    getVol(volId?: string) {
        return this.volEndpoint.getVolEndpoint<Vol>(volId);
    }

   getVolsList() {
        return this.volEndpoint.getVolsListEndpoint<Vol[]>();
    }



    createVol(vol: VolRequest) {

        console.log("vol", vol);
        return this.volEndpoint.getNewVolEndpoint<Vol>(vol);
    }
 
    updateVol(vol: VolRequest, id: number) {
        return this.volEndpoint.getUpdateVolEndpoint<Vol>(vol, id);
    }

}
