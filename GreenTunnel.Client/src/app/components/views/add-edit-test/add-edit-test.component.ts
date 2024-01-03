import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityType } from 'src/app/models/enums';
import { TestRequest } from 'src/app/models/test-request.model';
import { Test } from 'src/app/models/test.model';
import { TestTypeList } from 'src/app/models/testType-list.model';

import { TestTypeService } from 'src/app/services/testTypeServices/testType.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-test',
  templateUrl: './add-edit-test.component.html',
  styleUrls: ['./add-edit-test.component.scss']
})
export class AddEditTestComponent implements OnInit {
  testForm: FormGroup;
  isEditMode = false;
  testData: Test;
  testRequest: TestRequest = new TestRequest();
    testTypesList: TestTypeList[] = [];
    piloteList: TestTypeList[] = [];
    testId: number = 0;
    pilotId: number = 0;
  isLoading: boolean;
  inProgress: boolean;
  constructor(
    private fb: FormBuilder,
  
    private testTypeService : TestTypeService,
   
    private route: ActivatedRoute,
    private router: Router,
    private toasterService:ToastrService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams['id']) {
          //this.testId = queryParams['id'];
          this.pilotId = queryParams['id'];
        this.isEditMode = true;
         // this.loadTest(this.testId.toString());
          this.loadTest(this.pilotId.toString());
      }
    });


    this.route.params.subscribe((params) => {
      debugger
        if (params['pilotId']) {
          this.testId = Number(params['pilotId']);
        if (this.testId > 0)
            this.testForm.get('pilotId').setValue(this.pilotId);
         
      }
    });
    this.getTestTypesList();
  }
  getTestTypesList() {
    this.testTypeService.getTestTypesList().subscribe((data: any) => {
      this.testTypesList = data;
    })
  }

  private createForm(): void {
    this.testForm = this.fb.group({
      name: ['',[Validators.required]],
        nomPilote: [null, Validators.required],      
       description: [''],
        testTypeId: [null, Validators.required],
        piloteId: [null, Validators.required],
 
    });
  }

  private loadTest(id: string): void {
    debugger
    this.testService.getTest(id).subscribe((test) => {
      debugger
      this.testData = test;
      this.testForm.patchValue(test);
    });
  }



  save(): void {
    this.isLoading = true;

    if (this.testForm.valid) {
      if (this.inProgress) {
        return;
      }
      this.inProgress = true;
      const formData = this.testForm.value as Test;
      this.testRequest.model = { ...this.testForm.value };
      this.testRequest.model.id = this.testId;
      this.testRequest.model.tesTypeId = formData.tesTypeId;
      if (this.isEditMode) {
        // Update an existing test
        this.testService.updateTest(this.testRequest).subscribe(() => {
          this.isLoading = false;
          this.inProgress = false;
          // Handle success or navigate to a different page
          this.toasterService.success(`Test  ${this.testRequest.model.name} has been updated.`,'Test  Updated',);
           
          this.router.navigate(['/tests']);
        });
      } else {
        // Create a new test
        this.testService.createTest(this.testRequest).subscribe(() => {
          this.isLoading = false;
          this.inProgress = false;
          this.toasterService.success(`Test = ${this.testRequest.model.name} has been created.`,'Test  Created');
         
          // Handle success or navigate to a different page
          this.router.navigate(['/tests']);
        });
      }
    } else {
      this.isLoading = false;
      this.inProgress = false;
      this.toasterService.error(`Kindly fill the Test  form correctly.`,'Test  Failed');
    }

  }
  cancel() {
    this.router.navigate(['/tests']);
  }
}
