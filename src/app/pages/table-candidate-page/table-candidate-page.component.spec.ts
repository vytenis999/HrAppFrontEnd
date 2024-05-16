import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCandidatePageComponent } from './table-candidate-page.component';

describe('TableCandidatePageComponent', () => {
  let component: TableCandidatePageComponent;
  let fixture: ComponentFixture<TableCandidatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableCandidatePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCandidatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
