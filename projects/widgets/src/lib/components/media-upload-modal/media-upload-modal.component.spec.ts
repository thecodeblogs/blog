import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaUploadModalComponent } from './media-upload-modal.component';

describe('MediaUploadModalComponent', () => {
  let component: MediaUploadModalComponent;
  let fixture: ComponentFixture<MediaUploadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaUploadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
