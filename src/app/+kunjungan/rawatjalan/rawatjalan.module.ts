import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RawatJalanRoutingModule } from './rawatjalan-routing.module';
import { RawatJalanComponent } from './rawatjalan.component';
import { MatInputModule, MatTableModule, MatToolbarModule, MatPaginatorModule, MatDatepickerModule, MatNativeDateModule, MatChipsModule } from '@angular/material';
import { BoxModule } from 'angular-admin-lte';
import { ChartModule } from 'angular-highcharts';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    RawatJalanRoutingModule,
    BoxModule,
    ChartModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    FormsModule,
    CalendarModule,



  ],
  declarations: [RawatJalanComponent],
  exports: [MatToolbarModule, MatInputModule, MatTableModule],
})
export class RawatJalanModule { }
