import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login/login.guard';
import { StoryComponent } from './story/story.component';
import { UploadStoryComponent } from './upload-story/upload-story.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizSessionComponent } from './quiz-session/quiz-session.component';
import { UploadQuestionComponent } from './upload-question/upload-question.component';
import { PhotoUploadComponent } from './photo-upload/photo-upload.component';
import { LevelUpComponent } from './level-up/level-up.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EditStoryComponent } from './edit-story/edit-story.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AvatarCreationComponent } from './avatar-creation/avatar-creation.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'upload', component: UploadStoryComponent, canActivate: [LoginGuard]/* , data: { roles: ['ROLE_ADMIN'] } */},
  { path: 'home', component: HomeComponent, canActivate: [LoginGuard] },
  { path: 'story/:id/quiz', component: QuizComponent, canActivate: [LoginGuard]},
  { path: 'story/:id', component: StoryComponent , canActivate: [LoginGuard]},
  { path: 'quizSessions', component: QuizSessionComponent, canActivate: [LoginGuard]},
  { path: 'uploadQuestion', component: UploadQuestionComponent, canActivate: [LoginGuard]},
  { path: 'photoUpload', component: PhotoUploadComponent, canActivate: [LoginGuard]},
  { path: 'levelUp', component: LevelUpComponent, canActivate: [LoginGuard]},
  { path: 'editStory', component: EditStoryComponent, canActivate: [LoginGuard]},
  { path: 'profile', component: ProfileComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile/avatarCreation', component: AvatarCreationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), NgxChartsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
