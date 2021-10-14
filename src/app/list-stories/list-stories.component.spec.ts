import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStoriesComponent } from './list-stories.component';

describe('ListStoriesComponent', () => {
  let component: ListStoriesComponent;
  let fixture: ComponentFixture<ListStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListStoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
