import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { volsList } from 'src/app/models/vols-List.model';
import { AvionList } from 'src/app/models/avion-list.model';
import { PiloteList } from 'src/app/models/pilote-list.model';
import { VolRequest } from 'src/app/models/vol-request.model';
import { Vol } from 'src/app/models/vol.model';
import { AvionService } from 'src/app/services/avionServices/avion.service';
import { PiloteService } from 'src/app/services/piloteServices/pilote.service';
import { VolService } from 'src/app/services/vol.service';

@Component({
  selector: 'app-add-edit-vol',
  templateUrl: './add-edit-vol.component.html',
  styleUrls: ['./add-edit-vol.component.scss']
})
export class AddEditVolComponent implements OnInit {

  loadingIndicator: boolean;
  volForm: FormGroup;
  isEditMode = false;
  volData: Vol;
  volRequest: VolRequest = new VolRequest();
  volId: number = 0;
  employeId: number;
  piloteList = new MatTableDataSource<PiloteList>([]);
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
      'numVol' ,
      'numPilote',
      'numAvion',      
      'VilleDep',
      'VilleArr',
      'HeureDep',
      'HeureArr'
    ];

    constructor(
      private fb: FormBuilder,
      private volService: VolService,
      private piloteService : PiloteService,
      private avionService : AvionService,
      private route: ActivatedRoute,
      private router: Router,
      private toasterService: ToastrService
  
      ) { }

      ngOnInit(): void {
        this.route.queryParams.subscribe((queryParams) => {
            if (queryParams['id']) {
                this.volId = queryParams['id'];
                this.isEditMode = true;
                this.loadClient(this.volId.toString());
                
            }
        });

        this.createForm();
        this.route.params.subscribe((params) => {
            if (params['volId']) {
                this.volId = Number(params['volId']);
                if (this.volId > 0)
                    this.volForm.get('volId').setValue(this.volId);
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
  this.volForm = this.fb.group({
    numPilote: [''],
    numAvion: [''],
    numVol: [''],
    villeDep :[''],
    villeArr:[''],
    heureDep :[''],
    heureArr:[''],
  });
}



private loadClient(id: string): void {
  // Load employe data from your API service
this.volService.getVol(id).subscribe((vol) => {
      this.volData = vol;
    this.volForm.patchValue(vol);
  });
}

save(): void {
  this.isLoading = true;

  if (this.volForm.valid) {
      if (this.inProgress) {
          return;
      }

      console.log("this.volForm.value",this.volForm.value);
      this.inProgress = true;
      const formData = this.volForm.value as Vol;
      this.volRequest.model = { ...this.volForm.value };

      console.log("this.volRequest.model",this.volRequest.model);
     // this.volRequest.model.numPilote= this.volId;
      //this.volRequest.model.numAvion = formData.volId;
      if (this.isEditMode) {
          // Update an existing factory
          this.volService.updateVol(this.volRequest, this.volId).subscribe(() => {
              this.isLoading = false;
              this.inProgress = false;
              this.toasterService.success(`Vol ${this.volRequest.model.numVol} has been updated.`, 'Vol Updated',);

              // Handle success or navigate to a different page
              this.router.navigate(['/add-edit-vol']);
          });
      } else {
          // Create a new factory
          this.volService.createVol(this.volRequest).subscribe(() => {
              this.isLoading = false;
              this.inProgress = false;
              this.toasterService.success(`Vol ${this.volRequest.model.numVol} has been created.`, 'Vol Created');
              

              // Handle success or navigate to a different page
              this.router.navigate(['/add-edit-vol']);
          });
      }
  } else {
      this.isLoading = false;
      this.inProgress = false;
  }

}


cancel() {
  this.router.navigate(['/add-edit-vol']);
}

}
