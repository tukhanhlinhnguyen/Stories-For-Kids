import { HttpClient } from '@angular/common/http';
import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AddQuestion } from '../model/add-question.model';
import { Story } from '../model/story.model';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { UploadQuestionService } from './upload-question.service';

@Component({
  selector: 'app-upload-question',
  templateUrl: './upload-question.component.html',
  styleUrls: ['./upload-question.component.scss']
})
export class UploadQuestionComponent implements OnInit {
  storybooks: Story[];
  addQuestionForm: FormGroup;
  addQuestionModel = new AddQuestion;
  answerOptions: string[] = ['Answer Option 1', 'Answer Option 2', 'Answer Option 3', 'Answer Option 4'];
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private uploadQuestionService: UploadQuestionService,
    private zone: NgZone,
    private cloudinary: Cloudinary,
    private toast: ToastrService,
    private router: Router,
    public cloudinaryService: CloudinaryService
    ) {
     }


  ngOnInit(): void {
    this.addQuestionForm = this.fb.group({
      storybookId: [this.addQuestionModel.storybookId, Validators.required],
      question: [this.addQuestionModel.question, Validators.required],
      answer1: [this.addQuestionModel.answer1, Validators.required],
      answer2: [this.addQuestionModel.answer2, Validators.required],
      answer3: [this.addQuestionModel.answer3, Validators.required],
      answer4: [this.addQuestionModel.answer4, Validators.required],
      correctAnswer: [this.addQuestionModel.correctAnswer, Validators.required],
      questionImage: [this.addQuestionModel.questionImage]
    });
    this.getAllStorybooks();
    this.cloudinaryService.responses = [];
    this.cloudinaryService.uploadToCloudinary();
  }

  getAllStorybooks(){
    this.http.get(environment.BACKEND_HOST + environment.BACKEND_STORYBOOK_ENDPOINT)
    .subscribe((response: Story[]) => {
      this.storybooks = response;
    })
  }

  onSubmit(addQuestionForm: FormGroup){
    this.addQuestionModel = {
      storybookId: addQuestionForm.controls.storybookId.value,
      question: addQuestionForm.controls.question.value,
      answer1: addQuestionForm.controls.answer1.value,
      answer2: addQuestionForm.controls.answer2.value,
      answer3: addQuestionForm.controls.answer3.value,
      answer4: addQuestionForm.controls.answer4.value,
      correctAnswer: addQuestionForm.controls.correctAnswer.value,
      questionImage: this.cloudinaryService.fileUploadUrl,
    }

    this.uploadQuestionService.saveNewQuestion(this.addQuestionModel).subscribe((response) => {
      this.toast.success("Question Upload Successfully! Feel free to upload more...");
      this.reloadComponent();
    });
   }

   reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/uploadQuestion']);
  }
}

