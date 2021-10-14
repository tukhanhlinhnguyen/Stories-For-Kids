import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { FabComponent } from './components/fab/fab/fab.component';
import { FabContainerComponent } from './components/fab/fab-container/fab-container.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LevelUpComponent } from '../level-up/level-up.component';


@NgModule({
  declarations: [BookListComponent, FormFieldComponent, FabComponent, FabContainerComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    NgxChartsModule
  ],
  exports: [
    RouterModule,
    MaterialModule,
    BookListComponent,
    FormFieldComponent,
    FabContainerComponent,
    FabComponent,
    NgxChartsModule
  ]
})
export class SharedModule { }
