import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadStoryComponent } from './upload-story/upload-story.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListStoriesComponent } from './list-stories/list-stories.component';
import { ListStoryContentComponent } from './list-story-content/list-story-content.component';
import { HomeComponent } from './home/home.component';
import { StoryComponent } from './story/story.component';
import { SiteHeaderComponent } from './UI-components/site-header/site-header.component';
import { SharedModule } from './shared/shared.module';
import { CategoriesComponent } from './UI-components/categories/categories.component';
import { FooterComponent } from './UI-components/footer/footer.component';
import { StoryUploadDialogComponent } from './upload-story/story-upload-dialog/story-upload-dialog.component';
import { AuthInterceptor } from './login/auth-store/auth.interceptor';
import { LoginComponent } from './login/login.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { QuizComponent } from './quiz/quiz.component';
import { ToastrModule } from 'ngx-toastr';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';
import { TeacherComponent } from './teacher/teacher.component';
import { QuizSessionComponent } from './quiz-session/quiz-session.component';
import { InProgressQuizComponent } from './in-progress-quiz/in-progress-quiz.component';
import { UploadQuestionComponent } from './upload-question/upload-question.component';
import { CloudinaryConfiguration, CloudinaryModule } from '@cloudinary/angular-5.x';
import * as  Cloudinary from 'cloudinary-core';
import { Cloudinary as CloudinaryCore } from 'cloudinary-core';
import cloudinaryConfiguration from './config';
import { PhotoUploadComponent } from './photo-upload/photo-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { LevelManagerComponent } from './level-manager/level-manager.component';
import { QuizEndComponent } from './quiz-end/quiz-end.component';
import { ProgressBarModule } from 'angular-progress-bar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LevelUpModule } from './level-up/level-up.module';
import { JwPaginationModule } from 'jw-angular-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import {MatGridListModule} from '@angular/material/grid-list';
import { EditStoryComponent } from './edit-story/edit-story.component';
import { StoryEndComponent } from './story-end/story-end.component';
import { InProgressStoryComponent } from './in-progress-story/in-progress-story.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AlertComponent } from './alert/alert.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AvatarCreationComponent } from './avatar-creation/avatar-creation.component';
import { SVGToast } from './shared/extentions/svg.toast';
import { SVGToastSanitizePipe } from './shared/extentions/svg-toast-sanitize-pipe';
import { SafePipe } from './shared/extentions/safe-pipe';
import { ToastAlertComponent } from './toast-alert/toast-alert.component';

export const cloudinary = {
  Cloudinary: CloudinaryCore
};

export const config: CloudinaryConfiguration = cloudinaryConfiguration;

@NgModule({ 
  declarations: [
    AppComponent,
    UploadStoryComponent,
    ListStoriesComponent,
    ListStoryContentComponent,
    HomeComponent,
    StoryComponent,
    SiteHeaderComponent,
    CategoriesComponent,
    FooterComponent,
    StoryUploadDialogComponent,
    LoginComponent,
    QuizComponent,
    TeacherComponent,
    QuizSessionComponent,
    InProgressQuizComponent,
    UploadQuestionComponent,
    PhotoUploadComponent,
    LevelManagerComponent,
    QuizEndComponent,
    EditStoryComponent,
    StoryEndComponent,
    InProgressStoryComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    AlertComponent,
    ResetPasswordComponent,
    AvatarCreationComponent,
    // SVGToast,
    // SVGToastSanitizePipe,
    // SafePipe,
    ToastAlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule,
    CommonModule,
    ToastrModule.forRoot(
      // {
      // toastComponent: SVGToast
    // }
    ),
    CloudinaryModule.forRoot(cloudinary, config),
    FileUploadModule,
    ProgressBarModule,
    NgxChartsModule,
    LevelUpModule,
    JwPaginationModule,
    MatProgressSpinnerModule,
    // MatGridListModule,
    ToastModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    // SVGToastSanitizePipe,
    // SafePipe
],
  bootstrap: [AppComponent],
  entryComponents: [
    // SVGToast
  ], 
})
export class AppModule { }
