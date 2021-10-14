import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Storybook } from '../model/storybook.model';

@Component({
  selector: 'app-list-stories',
  templateUrl: './list-stories.component.html',
  styleUrls: ['./list-stories.component.scss']
})
export class ListStoriesComponent implements OnInit, OnChanges {

  selectedStory: string = null

  // @Input()
  // stories: {storyName: string, hasAudio: boolean}[];

  @Input()
  storybooks: Storybook[];

  @Output()
  getStory = new EventEmitter<String>();

  @Output()
  deleteStory = new EventEmitter<String>();
  
  // dataSource: {storyName: string, hasAudio: boolean}[] = [];
  storybookDataSource: Storybook[] = [];
  displayedColumns: string[] = ['storyName', 'hasAudio', 'coverImagePath', 'action'];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['storybooks']){
      this.storybookDataSource = changes['storybooks'].currentValue;
    }
  }

  callDeleteStory(storyName){
    this.deleteStory.emit(storyName)
  }

  ngOnInit(): void {
    console.log(this.storybooks);
  }

}