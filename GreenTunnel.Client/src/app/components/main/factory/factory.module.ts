import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FactoryRoutingModule } from './factory-routing.module';
import { FactoryListComponent } from './factory-list/factory-list.component';


@NgModule({
  declarations: [FactoryListComponent],
  imports: [
    CommonModule,
    FactoryRoutingModule
  ]
})
export class FactoryModule { }
