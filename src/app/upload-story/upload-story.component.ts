import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { StoryUploadDialogComponent } from './story-upload-dialog/story-upload-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadStory } from '../model/upload-story.model';
import { HomeService } from '../home/home.service';
import { StorybookService } from '../shared/services/storybook.service';
import { Storybook } from '../model/storybook.model';

@Component({
  selector: 'app-upload-story',
  templateUrl: './upload-story.component.html',
  styleUrls: ['./upload-story.component.scss'],
})
export class UploadStoryComponent implements OnInit {
  percentDone: number = 0
  uploadSuccess: boolean = false
  storyName: string = ''
  file: File = null
  stories: string[] = []
  storybooks: Storybook[] = [];
  uploadType: string = 'story'
  storyForSound: string = ''
  story: any = null
  audios: string[] = []
  images: string[] = []

  constructor(
    private http: HttpClient, 
    private dialog: MatDialog, 
    private snackBar: MatSnackBar,
    private storybookService: StorybookService
    ) {}

  ngOnInit(): void {
    this.getAllStorybooks();
    console.log('upload-story component');
  }

  getAllStorybooks(){
    this.storybookService.getAllStorybooks()
    .subscribe((response: Storybook[]) => {
      this.storybooks = response;
      console.log(this.storybooks);
    });
  }

  deleteStory(storyName){
    if(!confirm( `Are you sure you want to delete story '${storyName}'`)){
      return
    }
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        body: storyName
    };
    this.http
    .request('delete',environment.BACKEND_HOST+'/api/v1/file', httpOptions)
      .subscribe((response: Storybook[]) => {
          console.log(response);
          this.storybooks = response;
      })
  }
 
  onFileChange(event) {
    this.file = event.target.files[0];
  }

  sendUploadStoryRequest(uploadStory: UploadStory) {
    console.log(uploadStory);
    var formData = new FormData()
    formData.append('storyFileName', uploadStory.storyFileName)
    formData.append('storyFileUpload', uploadStory.storyFileUpload);
    formData.append('soundFileName', uploadStory.soundFileName)
    formData.append('soundFileUpload', uploadStory.soundFileUpload);
    formData.append('storyName', uploadStory.storyName);
    formData.append("storybookLevel", uploadStory.storybookLevel);
    formData.append("hasAudio", uploadStory.hasAudio.toString());
    if(uploadStory.coverImageFilePath){
      formData.append("coverImageFilePath", uploadStory.coverImageFilePath);
    }
    this.http
      .post(environment.BACKEND_HOST+'/api/v1/file/', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(
            (100 * event.loaded) / (event.total || 1)
          )
        } else if (event instanceof HttpResponse) {
          this.snackBar.open("Upload successful!", "", {duration: 2000});
          this.uploadSuccess = true
          console.log(event.body);
          this.storybooks = event.body as Storybook[];
        }
      })
  }

  uploadBook() {
    const dialogRef = this.dialog.open(StoryUploadDialogComponent, {
      minWidth: '400px',
      width: '60%',
      data: {stories: this.stories}
    });

    dialogRef.afterClosed().subscribe(data => {
      if (!data) {
        return;
      }

      this.sendUploadStoryRequest(data.uploadStory);        
    });
  }

}
