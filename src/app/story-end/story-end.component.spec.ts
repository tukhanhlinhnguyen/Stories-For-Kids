import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ProgressBarModule } from 'angular-progress-bar';
import { HomeService } from '../home/home.service';
import { LevelManagerService } from '../level-manager/level-manager.service';
import { StoryService } from '../story/story.service';

import { StoryEndComponent } from './story-end.component';

// describe('StoryEndComponent', () => {
//   let component: StoryEndComponent;
//   let fixture: ComponentFixture<StoryEndComponent>;

//   beforeEach(async () => {
//     let store = {};
//     const mockLocalStorage = {
//       getItem: (key: string): string => {
//         return key in store ? store[key] : null;
//       },
//       setItem: (key: string, value: string) => {
//         store[key] = `${value}`;
//       },
//       removeItem: (key: string) => {
//         delete store[key];
//       },
//       clear: () => {
//         store = {};
//       }
//     };
//     spyOn(localStorage, 'setItem')
//     .and.callFake(mockLocalStorage.setItem);
//     spyOn(localStorage, 'getItem')
//     .and.callFake(mockLocalStorage.getItem);
//     spyOn(localStorage, 'removeItem')
//     .and.callFake(mockLocalStorage.removeItem);
//     spyOn(localStorage, 'clear')
//     .and.callFake(mockLocalStorage.clear);
//     localStorage.setItem("user", JSON.stringify(
//         {
//             expPoints: 41,
//             name: null,
//             studentId: "1",
//             studentReadingLevel: "aa",
//             userId: "1",
//             userType: "STUDENT",
//             username: "student"
//         })
//         )
//     localStorage.setItem("storybook", JSON.stringify(
//         {
//             coverImagePath: null,
//             hasAudio: true,
//             inProgressQuizSessionId: 2,
//             inProgressQuizSessionPageNumber: 2,
//             inProgressStorySessionId: 2,
//             inProgressStorySessionPageNumber: 3,
//             playable: true,
//             quizCompleted: true,
//             quizId: 1,
//             soundUploaded: true,
//             storyCompleted: true,
//             storyName: "Nahl_E2E_Test",
//             storyUploaded: true,
//             storybookId: 1,
//             storybookReadingLevel: "aa"

//         })
//     )
//     await TestBed.configureTestingModule({
//       imports: [
//           BrowserAnimationsModule,
//           HttpClientModule,
//           ProgressBarModule,
//           RouterTestingModule
//         ],
//       declarations: [ StoryEndComponent ],
//       providers: [
    
//      ]
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(StoryEndComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   })
// });
