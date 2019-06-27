import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RawatJalanComponent } from './rawatjalan.component';

const routes: Routes = [{
  path: '',
  component: RawatJalanComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RawatJalanRoutingModule { }
