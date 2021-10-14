import { NgModule } from '@angular/core';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [],
  imports: [
    MatCheckboxModule, 
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRippleModule,
    MatTableModule,
    MatButtonToggleModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  exports: [
    MatCheckboxModule, 
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRippleModule,
    MatTableModule,
    MatButtonToggleModule,
    MatIconModule,
    MatProgressBarModule,
  ]
})
export class MaterialModule { }
