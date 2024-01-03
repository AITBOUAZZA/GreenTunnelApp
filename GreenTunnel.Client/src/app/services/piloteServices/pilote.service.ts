import { Injectable } from '@angular/core';
import { PiloteEndpointService } from './pilote-endpoint.service';
import { Pilote } from 'src/app/models/pilote.model';
import { PiloteList } from 'src/app/models/pilote-list.model';
import { EntityType } from 'src/app/models/enums';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PiloteService {

  constructor(private piloteEndpoint: PiloteEndpointService) { }

  getPilotes(page?: number, pageSize?: number,searchTerm?:string,sortColumn?:string,sortOrder?:string) {
    return this.piloteEndpoint.getPilotesEndpoint<Pilote[]>(page, pageSize,searchTerm,sortColumn,sortOrder);
  }
  getPilotesList() {
    return this.piloteEndpoint.getPilotesListEndpoint<PiloteList[]>();
  }
  createPilote(pilote: PiloteList) {
    return this.piloteEndpoint.getNewPiloteEndpoint<Pilote>(Pilote);
  }  
  updatePilote(pilote: PiloteList) {
    return this.piloteEndpoint.getUpdatePiloteEndpoint<Pilote>(pilote);
  }
  getPilote(piloteId?: string) {  
    return this.piloteEndpoint.getPiloteEndpoint<Pilote>(piloteId);
  }
  deletePilote(pilopteOrPiloteId: string | Pilote): Observable<Pilote> {
    if (typeof pilopteOrPiloteId === 'string' || pilopteOrPiloteId instanceof String) {
      console.log ("got to delete section");
      return this.piloteEndpoint.getDeletePiloteEndpoint<Pilote>(pilopteOrPiloteId as string);
    } else {
      if (pilopteOrPiloteId.numPilote) {
        return this.deletePilote(pilopteOrPiloteId.numPilote);
      } else {
        throw new Error("Invalid PilotePiloteId"); // Add this line to handle the case where id does not exist
      }
    }
  }
//   getPiloteDuplicateStatus(piloteId:number,entityType:EntityType,piloteName?: string) {
//     return this.piloteEndpoint.getPiloteDuplicateStatusEndpoint<boolean>(numPilote, entityType,nomPilote);
// }
}
