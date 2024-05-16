import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCandidatePageComponent } from './add-candidate-page.component';

describe('AddCandidatePageComponent', () => {
  let component: AddCandidatePageComponent;
  let fixture: ComponentFixture<AddCandidatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCandidatePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCandidatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
