import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RawatInapRoutingModule } from './rawatinap-routing.module';
import { RawatinapComponent } from './rawatinap.component';

import { BoxModule } from 'angular-admin-lte';
import { ChartModule } from 'angular-highcharts';
import {MatInputModule, MatTableModule, MatToolbarModule,MatPaginatorModule  } from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RawatInapRoutingModule,
    BoxModule,
    ChartModule,
    MatInputModule, MatTableModule, MatToolbarModule,MatPaginatorModule,

  ],
  declarations: [RawatinapComponent],
  exports: [ MatToolbarModule, MatInputModule, MatTableModule],
})
export class RawatInapModule { }
