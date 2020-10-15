import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrySummaryComponent } from './entry-summary.component';

describe('EntrySummaryComponent', () => {
  let component: EntrySummaryComponent;
  let fixture: ComponentFixture<EntrySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
