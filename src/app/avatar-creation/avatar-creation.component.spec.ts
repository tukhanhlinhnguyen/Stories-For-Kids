import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarCreationComponent } from './avatar-creation.component';

describe('AvatarCreationComponent', () => {
  let component: AvatarCreationComponent;
  let fixture: ComponentFixture<AvatarCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
