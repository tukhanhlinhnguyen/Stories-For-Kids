import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EditStory } from '../model/edit-story.model';

@Injectable({
  providedIn: 'root'
})
export class EditStoryService {

  constructor(private http: HttpClient) { }

  updateEditStory(editStory: EditStory){
    var formData = new FormData()
    formData.append("storybookId", editStory.storybookId.toString());
    formData.append("storyFileUpload", editStory.storyFileUpload);
    formData.append("soundFileUpload", editStory.soundFileUpload);
    formData.append("storyName", editStory.storyName);
    formData.append("storybookLevel", editStory.storybookReadingLevel);
    formData.append("hasAudio", editStory.hasAudio.toString());
    if(editStory.coverImageFilePath){
      formData.append("coverImageFilePath", editStory.coverImageFilePath);
    }
    return this.http.put(environment.BACKEND_HOST + environment.BACKEND_STORYBOOK_ENDPOINT, formData, 
      { 
        responseType: 'text',
        reportProgress: true,
        observe: 'events'
      }
    )
  }
}
