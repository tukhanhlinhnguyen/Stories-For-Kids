import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Story } from 'src/app/model/story.model';
import { UploadStory } from 'src/app/model/upload-story.model';
import { CloudinaryService } from 'src/app/shared/services/cloudinary.service';
import { Dialog } from 'src/app/shared/components/dialog/dialog';
import { StorybookService } from 'src/app/shared/services/storybook.service';

@Component({
  selector: 'app-story-upload-dialog',
  templateUrl: './story-upload-dialog.component.html',
  styleUrls: ['./story-upload-dialog.component.scss']
})
export class StoryUploadDialogComponent extends Dialog implements OnInit, OnDestroy {

  private file: File;
  form: FormGroup;
  currentStorybooks: Story[];
  fileName: string;
  uploadStory: UploadStory;
  type: 'story' | 'sound';
  fileChangeSub: Subscription;
  stories;
  isUploadStoryValid: boolean = false;
  previousStoryName: string = '';

  get storybookLevel() { return this.form.get('storybookLevel'); }

  get storyName() { return this.form.get('storyName'); }

  get storyForSound() { return this.form.get('storyForSound'); }

  get storyFileUpload() { return this.form.get('storyFileUpload'); }

  get soundFileUpload() { return this.form.get('soundFileUpload'); }

  get coverImageUpload() { return this.form.get('coverImageUpload'); };

  constructor(
    private dialogRef: MatDialogRef<StoryUploadDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: any,
    public cloudinaryService: CloudinaryService,
    private storybookService: StorybookService
    ) {
    super({}, dialogRef);
    
  }

  ngOnInit(): void {
    // get dialog data
    this.stories = this.data.stories;
    // init form
    this.form = new FormGroup({
      storybookLevel: new FormControl('', [Validators.required]),
      storyFileUpload: new FormControl('', [Validators.required]),
      soundFileUpload: new FormControl('', []),
      storyName: new FormControl('', [Validators.required]),
      coverImageUpload: new FormControl('', [])
    });
    this.storybookLevel.valueChanges.subscribe((val) => {
      this.uploadStory.storybookLevel = val;
      this.checkUploadStoryValid()
    });
    this.storyName.valueChanges.subscribe((val) => {
      this.uploadStory.storyName = val;
      this.checkUploadStoryValid();

    });
    this.storybookService.getAllStorybooks()
    .subscribe((response: Story[]) => {
      this.currentStorybooks = response;
    });
    this.uploadStory = new UploadStory;
    this.cloudinaryService.responses = [];
    this.cloudinaryService.uploadToCloudinary();
  }

  ngOnDestroy(): void {
    this.fileChangeSub?.unsubscribe();
  }

  onFileChange(event) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
  }

  onStoryFileChange(event){
    this.uploadStory.storyFileUpload = event.target.files[0];
    this.uploadStory.storyFileName = event.target.files[0]?.name;
    this.form.controls["storyFileUpload"].setValue(event.target.files[0]);
    this.form.controls["storyFileUpload"].markAsTouched();
    this.form.controls["storyFileUpload"].markAsDirty();

    if(event.target.files.length > 0){
      this.previousStoryName = this.form.controls["storyName"].value;
      this.form.controls["storyName"].setValue(this.uploadStory.storyFileName.split('.').slice(0, -1).join('.'));
      this.form.controls["storyName"].disable();
    }else{
      this.form.controls["storyName"].setValue(this.previousStoryName);
      this.form.controls["storyName"].enable();
    }
    this.checkUploadStoryValid();
  }

  onSoundFileChange(event){
    this.uploadStory.soundFileUpload = event.target.files[0];
    this.uploadStory.soundFileName = event.target.files[0]?.name;
    this.checkUploadStoryValid();
  }

  onCoverImageFileChange(event){
    this.uploadStory.coverImageFilePath = event.target.files[0]?.name;
    this.checkUploadStoryValid();
  }

  checkUploadStoryValid(){
    this.isUploadStoryValid = false;
    // this.isUniqueStoryName = true;
    if(this.uploadStory.storybookLevel && this.uploadStory.storyName && this.uploadStory.storyFileUpload && this.uploadStory.storyFileName){
      if(this.uploadStory.storyName != ""){
        this.isUploadStoryValid = true;
      }
    }
    if(this.form.controls["storyName"].value){
      var storyNameValue = this.form.controls["storyName"].value
      this.currentStorybooks.find((storybook) => {
        if(storybook.storyName == storyNameValue){
          this.storyName.setErrors({ isUniqueStoryName: false});
        }
      });
    }
  }

  submitAndClose() {
    if(this.cloudinaryService.imageUploaded){
      this.uploadStory.coverImageFilePath = this.cloudinaryService.fileUploadUrl;
    }
    this.uploadStory.storybookLevel = this.storybookLevel.value;
    this.uploadStory.storyName = this.storyName.value;
    if(this.uploadStory.soundFileUpload){
      this.uploadStory.hasAudio = true;
    }else{
      this.uploadStory.hasAudio = false;
    }
    this.dialogRef.close({
      uploadStory: this.uploadStory
    });
    this.cloudinaryService.imageUploaded = false;
    // this.cloudinaryService.fileUploadUrl = '';
  }

}
