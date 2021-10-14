import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorySession } from '../model/story-session.model';
import { Storybook } from '../model/storybook.model';

@Component({
  selector: 'app-in-progress-story',
  templateUrl: './in-progress-story.component.html',
  styleUrls: ['./in-progress-story.component.scss']
})
export class InProgressStoryComponent implements OnInit {
  @Input() inProgressStory: StorySession;
  @Input() storybooks: Storybook[];
  storyReady: boolean = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.storyReady = true;
  }

  goToStory(): void{
    var storyId = this.inProgressStory.forStorybookId;
    for(var i = 0 ; i < this.storybooks.length ; i++){
      if(this.storybooks[i].storybookId == storyId){
        localStorage.setItem("storybook", JSON.stringify(this.storybooks[i]));
      }
    }
    localStorage.setItem("currentStorySessionId", this.inProgressStory.storySessionId.toString());
    localStorage.setItem("inProgressStorySession", JSON.stringify(this.inProgressStory));
    this.router.navigate([`/story/${storyId}`])
  }

}
