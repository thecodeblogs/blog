import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonRendererComponent } from './json-renderer.component';

describe('JsonRendererComponent', () => {
  let component: JsonRendererComponent;
  let fixture: ComponentFixture<JsonRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
