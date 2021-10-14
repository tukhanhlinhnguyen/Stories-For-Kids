import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStoryContentComponent } from './list-story-content.component';

describe('ListStoryContentComponent', () => {
  let component: ListStoryContentComponent;
  let fixture: ComponentFixture<ListStoryContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListStoryContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStoryContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
