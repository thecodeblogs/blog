import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryRendererWrapperComponent } from './entry-renderer-wrapper.component';

describe('EntryRendererWrapperComponent', () => {
  let component: EntryRendererWrapperComponent;
  let fixture: ComponentFixture<EntryRendererWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryRendererWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryRendererWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
