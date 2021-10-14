import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { StoryService } from './story.service';

// describe('StoryService', () => {
//   let service: StoryService;

//   beforeEach(() => {
//     let store = {};
    // const mockLocalStorage = {
    //   getItem: (key: string): string => {
    //     return key in store ? store[key] : null;
    //   },
    //   setItem: (key: string, value: string) => {
    //     store[key] = `${value}`;
    //   },
    //   removeItem: (key: string) => {
    //     delete store[key];
    //   },
    //   clear: () => {
    //     store = {};
    //   }
    // };
    // spyOn(localStorage, 'setItem')
    // .and.callFake(mockLocalStorage.setItem);
    // spyOn(localStorage, 'getItem')
    // .and.callFake(mockLocalStorage.getItem);
    // spyOn(localStorage, 'removeItem')
    // .and.callFake(mockLocalStorage.removeItem);
    // spyOn(localStorage, 'clear')
    // .and.callFake(mockLocalStorage.clear);
    // spyOn(localStorage, 'getItem').andCallFake(function (key) {
    //   return store[key];
    // });
    // spyOn(localStorage, 'setItem').andCallFake(function (key, value) {
    //   return store[key] = value + '';
    // });
    // spyOn(localStorage, 'clear').andCallFake(function () {
    //     store = {};
    // });

//     function storageMock() {
//       let storage = {};
  
//       return {
//         setItem: function(key, value) {
//           storage[key] = value || '';
//         },
//         getItem: function(key) {
//           return key in storage ? storage[key] : null;
//         },
//         removeItem: function(key) {
//           delete storage[key];
//         },
//         get length() {
//           return Object.keys(storage).length;
//         },
//         key: function(i) {
//           const keys = Object.keys(storage);
//           return keys[i] || null;
//         }
//       };
//     }
//     window.localStorage = storageMock()

//     TestBed.configureTestingModule({
//       imports: [HttpClientModule]
//     });
//     service = TestBed.inject(StoryService);
//   });

//   it('should be created', () => {
 
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
//     expect(service).toBeTruthy();
//   });
// });


