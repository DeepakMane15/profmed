import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MedicalListComponent } from './medical-list/medical-list.component';

const routes: Routes = [
  {
    path: '',
    component: MedicalListComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule]
})
export class MedicalModule {}
