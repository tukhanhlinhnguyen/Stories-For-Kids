import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { CloudinaryService } from 'src/app/shared/services/cloudinary.service';

import { StoryUploadDialogComponent } from './story-upload-dialog.component';

// describe('StoryUploadDialogComponent', () => {
//   let component: StoryUploadDialogComponent;
//   let fixture: ComponentFixture<StoryUploadDialogComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ 
//           MatDialogModule,
//           HttpClientModule
//         ],
//       declarations: [ StoryUploadDialogComponent ],
//       providers: [ 
//           MatDialog, 
//           {
//             provide: Cloudinary,
//             useValue: {}
//           },

//         {
//             provide: MatDialogRef,
//             useValue: {}
//           },
//         { 
//             provide: MAT_DIALOG_DATA, 
//             useValue: {} 
//         }
//     ]
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(StoryUploadDialogComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
