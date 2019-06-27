import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BoxModule, TabsModule, DropdownModule, BoxInfoModule , BoxSmallModule,AlertModule} from 'angular-admin-lte';

import { HeaderInnerComponent } from './header-inner/header-inner.component';
import { SidebarLeftInnerComponent } from './sidebar-left-inner/sidebar-left-inner.component';
import { SidebarRightInnerComponent } from './sidebar-right-inner/sidebar-right-inner.component';
// import { AlertModule } from '../+alert/alert.module';
import { MatCardModule, MatFormFieldModule,MatCheckboxModule, MatProgressSpinnerModule, MatInputModule, MatButtonModule, MatToolbarModule } from '@angular/material';
import {ToastModule} from 'primeng/toast';
import { DialogModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    DropdownModule,
    TabsModule,
    BoxModule,
    BoxInfoModule,
    BoxSmallModule,
    AlertModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    ToastModule,
    // ToastModule.forRoot(),
    MatCheckboxModule,
    DialogModule,
    ButtonModule
  ],
  declarations: [HeaderInnerComponent, SidebarLeftInnerComponent, SidebarRightInnerComponent],
  exports: [BoxModule, TabsModule, HeaderInnerComponent,
     SidebarLeftInnerComponent, SidebarRightInnerComponent,
     BoxInfoModule, BoxSmallModule,AlertModule]
})
export class CoreModule { }
