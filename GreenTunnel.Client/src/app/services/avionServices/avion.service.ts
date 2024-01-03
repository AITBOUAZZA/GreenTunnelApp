import { Injectable } from '@angular/core';
import { AvionEndpointService } from './avion-endpoint.service';
import { AvionList } from 'src/app/models/avion-list.model';
import { Avion } from '../../models/avion.model';
import { Observable } from 'rxjs';

//import { volsList } from 'src/app/models/Vols-List.model';
//import { VolsList } from 'src/app/models/Vols-List.model';
import { volsList } from 'src/app/models/vols-List.model';
@Injectable({
  providedIn: 'root'
})
export class AvionService {
  AvionEndpoint: any;

  constructor(private AvionEndpointService :AvionEndpointService) { }

    getAvion(page?: number, pageSize?: number, searchTerm?: string, sortColumn?: string, sortOrder?: string) {
        return this.AvionEndpointService.getAvionsEndpoint<Avion[]>(page, pageSize, searchTerm, sortColumn, sortOrder);
    }
    deleteAvion(pilopteOrAvionId: string | Avion): Observable<Avion> {
      if (typeof pilopteOrAvionId === 'string' || pilopteOrAvionId instanceof String) {
        console.log ("got to delete section");
        return this.AvionEndpointService.getDeleteAvionEndpoint<Avion>(pilopteOrAvionId as string);
      } else {
        if (pilopteOrAvionId.numAvion) {
          return this.deleteAvion(pilopteOrAvionId.numAvion);
        } else {
          throw new Error("Invalid AvionAvionId"); // Add this line to handle the case where id does not exist
        }
      }
    }


    getVolsByAvionAndPilote(avionId?: string, piloteId?: string): Observable<volsList[]> {
      return this.AvionEndpointService.getVolsByAvionAndPilote<volsList[]>(avionId,piloteId);
    }


  getAvionsListByAvion() {
    return this.AvionEndpointService.getAvionsListEndpoint<AvionList[]>();
  }
}


