import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { EditStory, RequestEditStory } from '../model/edit-story.model';
import { Story } from '../model/story.model';
import { UploadStory } from '../model/upload-story.model';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { StorybookService } from '../shared/services/storybook.service';
import { EditStoryService } from './edit-story.service';

@Component({
  selector: 'app-edit-story',
  templateUrl: './edit-story.component.html',
  styleUrls: ['./edit-story.component.scss']
})
export class EditStoryComponent implements OnInit {
  percentDone: number = 0;
  editStoryForm: FormGroup;
  storybooks: RequestEditStory[];
  storybookSelected: boolean = false;
  selectedStorybook: EditStory;
  storyFileUploadName: string;
  soundFileUploadName: string;
  get storybookLevel() { return this.editStoryForm.get('storybookLevel'); }

  get storyName() { return this.editStoryForm.get('storyName'); }

  get storyForSound() { return this.editStoryForm.get('storyForSound'); }

  get storyFileUpload() { return this.editStoryForm.get('storyFileUpload'); }

  get soundFileUpload() { return this.editStoryForm.get('soundFileUpload'); }

  get coverImageUpload() { return this.editStoryForm.get('coverImageUpload'); };

  constructor(
    public cloudinaryService: CloudinaryService,
    private http: HttpClient,
    public editStoryService: EditStoryService,
    private toast: ToastrService,
    private storybookService: StorybookService
    ) { }

  ngOnInit(): void {
    this.setEditStoryForm();
    this.getAllStorybooks();
    this.cloudinaryService.responses = [];
    this.cloudinaryService.uploadToCloudinary();
  }

  getAllStorybooks(){
    this.storybookService.getAllStorybooks()
    .subscribe((response: RequestEditStory[]) => {
      this.storybooks = response;
    })
  }

  setSelectedStorybook(event: MatSelectChange){
    var selectedStorybookId = event.value;
    this.storybookSelected = false;
    for(var i = 0; i < this.storybooks.length; i++){
      if(this.storybooks[i].storybookId == selectedStorybookId){
        this.selectedStorybook = this.storybooks[i];
        this.storybookSelected = true;
        this.setEditStoryForm();
      }
    }
  }

  setEditStoryForm(){
    if(this.selectedStorybook){
      this.editStoryForm = new FormGroup({
        storybookLevel: new FormControl(this.selectedStorybook.storybookReadingLevel, [Validators.required]),
        storyFileUpload: new FormControl('', []),
        soundFileUpload: new FormControl('', []),
        storyName: new FormControl(this.selectedStorybook.storyName, [Validators.required]),
        coverImageUpload: new FormControl('', [])
      });
    }else{
      this.editStoryForm = new FormGroup({
      });
    }

  }

  setStorybookLevel(event: MatSelectChange){
    this.selectedStorybook.storybookReadingLevel = event.value;
  }

  onStoryFileChange(event){
    this.selectedStorybook.storyFileUpload = event.target.files[0];
    this.storyFileUploadName = event.target.files[0]?.name;
    if(event.target.files.length > 0){
      this.editStoryForm.controls["storyName"].setValue(this.storyFileUploadName.split('.').slice(0, -1).join('.'));
      this.editStoryForm.controls["storyName"].disable();
    }else{
      this.editStoryForm.controls["storyName"].setValue(this.selectedStorybook.storyName);
      this.editStoryForm.controls["storyName"].enable();
    }
  }

  onSoundFileChange(event){
    this.selectedStorybook.soundFileUpload = event.target.files[0];
    this.soundFileUploadName = event.target.files[0]?.name;
  }

  checkUniqueStorybookName(storybookValue: string){
    console.log(storybookValue);
  }

  onSubmit(){
    this.selectedStorybook.storyName = this.editStoryForm.controls["storyName"]?.value;
    this.selectedStorybook.storybookReadingLevel = this.editStoryForm.controls["storybookLevel"].value;
    if(this.cloudinaryService.imageUploaded){
      this.selectedStorybook.coverImageFilePath = this.cloudinaryService.fileUploadUrl;
    }

    this.editStoryService.updateEditStory(this.selectedStorybook)
    .subscribe((response) => {
      if(response.type === HttpEventType.UploadProgress){
        this.percentDone = Math.round(
          (100 * response.loaded) / (response.total || 1)
        )
      } else if(response instanceof HttpResponse){
        console.log(response);
        this.toast.success("Storybook updated successfully!");
      }
      
    })
  }

}
