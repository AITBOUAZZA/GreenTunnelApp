import { Injectable } from '@angular/core';
import { RolesChangedEventArg, RolesChangedOperation } from '../account.service';
import { Subject } from 'rxjs';
import { ClientEndpointService } from './client-endpoint.service';
import { client } from '../../models/client.model';
import { ClientList } from '../../models/client-list.model';
import { ClientRequest } from '../../models/client-request.model';
//import { RolesChangedEventArg, RolesChangedOperation } from './account.service';
//import { Observable, Subject, mergeMap } from 'rxjs';
//import { WorkplaceEndpointService } from './workplace-endpoint.service';
//import { WorkplaceRequest } from '../models/workplace-request.model';
//import { Workplace } from '../models/workplace.model';
//import { WorkplacesList } from '../models/workplaces-list.model';

@Injectable()
export class ClientService {
    public static readonly roleAddedOperation: RolesChangedOperation = 'add';
    public static readonly roleDeletedOperation: RolesChangedOperation = 'delete';
    public static readonly roleModifiedOperation: RolesChangedOperation = 'modify';

    private rolesChanged = new Subject<RolesChangedEventArg>();
    constructor(private clientEndpoint: ClientEndpointService) { }
    getClientes(employeId?: number, page?: number, pageSize?: number, searchTerm?: string, sortColumn?: string, sortOrder?: string) {
        return this.clientEndpoint.getClientsEndpoint<client[]>(employeId, page, pageSize, searchTerm, sortColumn, sortOrder);
    }
    getClientList() {
        return this.clientEndpoint.getClientsEndpoint<ClientList[]>();
    }
    createClient(employe: ClientRequest) {
        return this.clientEndpoint.getNewClientEndpoint<client>(employe);
    }
    updateClient(employe: ClientRequest, id: number) {
        return this.clientEndpoint.getUpdateClientEndpoint<client>(employe, id);
    }
    getClient(clientId?: string) {
        return this.clientEndpoint.getClientEndpoint<client>(clientId);
    }
    //deleteWorkplace(factoryOrWorkplaceId: string | Workplace): Observable<Workplace> {
    //    if (typeof factoryOrWorkplaceId === 'string' || factoryOrWorkplaceId instanceof String) {
    //        return this.clientEndpoint.getDeleteWorkplaceEndpoint<Workplace>(factoryOrWorkplaceId as string);
    //    } else {
    //        if (factoryOrWorkplaceId) {
    //            return this.deleteWorkplace(factoryOrWorkplaceId.id);
    //        } else {
    //            throw new Error("Invalid factoryOrWorkplaceId"); // Add this line to handle the case where id does not exist
    //        }
    //    }
    //}
    //getWorkplaceDuplicateStatus(factoryName?: string) {
    //    return this.clientEndpoint.getWorkplaceDuplicateStatusEndpoint<boolean>(factoryName);
    //}
}
