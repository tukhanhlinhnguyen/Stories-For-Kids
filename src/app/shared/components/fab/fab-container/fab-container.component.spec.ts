import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabContainerComponent } from './fab-container.component';

describe('FabContainerComponent', () => {
  let component: FabContainerComponent;
  let fixture: ComponentFixture<FabContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FabContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
