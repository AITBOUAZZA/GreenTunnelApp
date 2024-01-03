import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkplaceRoutingModule } from './workplace-routing.module';
import { WorkplaceListComponent } from './workplace-list/workplace-list.component';


@NgModule({
  declarations: [
    WorkplaceListComponent
  ],
  imports: [
    CommonModule,
    WorkplaceRoutingModule
  ]
})
export class WorkplaceModule { }
