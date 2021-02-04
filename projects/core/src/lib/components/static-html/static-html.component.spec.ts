import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticHtmlComponent } from './static-html.component';

describe('StaticHtmlComponent', () => {
  let component: StaticHtmlComponent;
  let fixture: ComponentFixture<StaticHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticHtmlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
