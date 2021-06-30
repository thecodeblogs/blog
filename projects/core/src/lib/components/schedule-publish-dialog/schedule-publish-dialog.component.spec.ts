import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePublishDialogComponent } from './schedule-publish-dialog.component';

describe('SchedulePublishDialogComponent', () => {
  let component: SchedulePublishDialogComponent;
  let fixture: ComponentFixture<SchedulePublishDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulePublishDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePublishDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
