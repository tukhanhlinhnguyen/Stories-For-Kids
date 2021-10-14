import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-story-content',
  templateUrl: './list-story-content.component.html',
  styleUrls: ['./list-story-content.component.scss']
})
export class ListStoryContentComponent implements OnInit {

  backendHost: string = environment.BACKEND_HOST

  @Input() 
  storyName: any

  @Input() 
  images: any

  @Input() 
  audios: any

  constructor() { }

  ngOnInit(): void {
  }

}
