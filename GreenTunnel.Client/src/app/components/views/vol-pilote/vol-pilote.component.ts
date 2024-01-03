import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { client } from '../../../models/client.model';
import { ClientRequest } from '../../../models/client-request.model';
import { EmployeList } from '../../../models/employes-list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../../../services/Client/client.service';
import { EntityType } from '../../../models/enums';
import { EntityTypee } from '../../../models/enumss';
import { PiloteList } from 'src/app/models/pilote-list.model';
import { AvionList } from 'src/app/models/avion-list.model';
import { PiloteService } from 'src/app/services/piloteServices/pilote.service';
import { AvionService } from 'src/app/services/avionServices/avion.service';
import { volsList } from 'src/app/models/vols-List.model';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
//import { VolsList } from '../../../models/Vols-List.model';

@Component({
  selector: 'vol-pilote',
  templateUrl: './vol-pilote.component.html',
  styleUrls: ['./vol-pilote.component.scss']
})
export class VolPiloteComponent implements OnInit{
    loadingIndicator: boolean;
    clientForm: FormGroup;
    isEditMode = false;
    clientData: client;
    clientRequest: ClientRequest = new ClientRequest();
    clientId: number = 0;
    employeId: number;
    piloteList: PiloteList[] = [];
    avionList= new MatTableDataSource<AvionList>([]);
    
    inProgress: boolean;
    isLoading: boolean;
    volsList = new MatTableDataSource<volsList>([]);

    totalRows = 0;
    pageSize = 5;
    currentPage = 0;
    defaultPageSize = 10;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    displayedColumns: string[] = [
        'VilleDep',
        'VilleArr',
        'HeureDep',
        'HeureArr'
    ];
    //volsList: BehaviorSubject<VolsList[]> = new BehaviorSubject<VolsList[]>([]);

   
    constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private piloteService : PiloteService,
    private avionService : AvionService,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService

    ) { }


    ngOnInit(): void {
        this.route.queryParams.subscribe((queryParams) => {
            if (queryParams['id']) {
                this.clientId = queryParams['id'];
                this.isEditMode = true;
                this.loadClient(this.clientId.toString());
                
            }
        });

      

        this.createForm();
        this.route.params.subscribe((params) => {
            if (params['employeId']) {
                this.employeId = Number(params['employeId']);
                if (this.employeId > 0)
                    this.clientForm.get('employeId').setValue(this.employeId);
            }
        });
        this.getEmployesList();
        this.getAvionsListByPilote();
    
    }

    getAvionsListByPilote()
    {

        this.avionService.getAvionsListByAvion().subscribe((data: any) => {      
            this.avionList = data;
        })

    }

    getEmployesList() {
        this.piloteService.getPilotesList().subscribe((data: any) => {      
            this.piloteList = data;
        })
    }

 


    private createForm(): void {
        this.clientForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            employeId: [null, Validators.required],
            avionId :[''],
            piloteId:[''],
            //avionList:[]
        });
    }

    

private loadClient(id: string): void {
        // Load employe data from your API service
      this.clientService.getClient(id).subscribe((client) => {
            this.clientData = client;
          this.clientForm.patchValue(client);
        });
    }

    save(): void {
        this.isLoading = true;

        if (this.clientForm.valid) {
            if (this.inProgress) {
                return;
            }
            this.inProgress = true;
            const formData = this.clientForm.value as client;
            this.clientRequest.model = { ...this.clientForm.value };
            this.clientRequest.model.id = this.clientId;
            this.clientRequest.model.employeId = formData.employeId;
            if (this.isEditMode) {
                // Update an existing factory
                this.clientService.updateClient(this.clientRequest, this.clientId).subscribe(() => {
                    this.isLoading = false;
                    this.inProgress = false;
                    this.toasterService.success(`Client ${this.clientRequest.model.name} has been updated.`, 'Client Updated',);

                    // Handle success or navigate to a different page
                    this.router.navigate(['/add-edit-client']);
                });
            } else {
                // Create a new factory
                this.clientService.createClient(this.clientRequest).subscribe(() => {
                    this.isLoading = false;
                    this.inProgress = false;
                    this.toasterService.success(`Client ${this.clientRequest.model.name} has been created.`, 'Client Created');
                    

                    // Handle success or navigate to a different page
                    this.router.navigate(['/add-edit-client']);
                });
            }
        } else {
            this.isLoading = false;
            this.inProgress = false;
        }

    }


    cancel() {
        this.router.navigate(['/add-edit-client']);
    }

    onPiloteSelectionChange(selectedPilote: string) {
      
        this.getVolsByPilote(selectedPilote, this.clientForm.get('avionId').value);
    }
    //piloteId

    
    onAvionSelectionChange(selectedAvion: string) {
    
        this.getVolsByAvion(selectedAvion, this.clientForm.get('piloteId').value);
    }

    

  

    getVolsByPilote(piloteId: string, avionId: string) {
        this.avionService.getVolsByAvionAndPilote(avionId, piloteId).subscribe({
            next: (data: volsList[]) => {
                console.log("Data reçue :", data);
                // Assurez-vous que les données reçues correspondent à la structure attendue
                this.volsList.data = data; // Assurez-vous que les données sont correctement assignées à this.volsList.data
                console.log("VolsList :", this.volsList.data);
            },
            error: (error) => {
                console.error('Erreur lors de la récupération des vols par pilote et avion :', error);
            }
        });
    }


 

    getVolsByAvion(avionId: string, piloteId: string) {
      
        this.avionService.getVolsByAvionAndPilote(avionId, piloteId).subscribe({
            next: (data: volsList[]) => {
                console.log("data", data);
                this.volsList.data = data;
            

              console.log("this.volsList",this.volsList.data)
            },
            error: (error) => {
              console.error('Erreur lors de la récupération des vols par avion et pilote :', error);
            }
          });
    }


   


}
