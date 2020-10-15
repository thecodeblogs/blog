import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryCreatorComponent } from './entry-creator.component';

describe('EntryCreatorComponent', () => {
  let component: EntryCreatorComponent;
  let fixture: ComponentFixture<EntryCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
