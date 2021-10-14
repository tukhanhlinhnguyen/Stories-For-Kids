import {NgModule} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LevelUpComponent } from './level-up.component';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { ProgressBarModule } from 'angular-progress-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
    declarations: [
        LevelUpComponent
    ],
    exports: [
        MatExpansionModule,
        NgxChartsModule,
        MatIconModule,
        MatCardModule,
        MatProgressBarModule,
        ProgressBarModule
    ],
    imports: [
        MatExpansionModule,
        NgxChartsModule,
        MatTableModule,
        MatIconModule,
        MatCardModule,
        MatProgressBarModule,
        ProgressBarModule

    ]
})
export class LevelUpModule {}