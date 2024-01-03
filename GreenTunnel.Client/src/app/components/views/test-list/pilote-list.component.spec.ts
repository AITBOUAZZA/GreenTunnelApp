import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiloteListComponent } from './pilote-list.component';

describe('PiloteListComponent', () => {
  let component: PiloteListComponent;
  let fixture: ComponentFixture<PiloteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiloteListComponent]
    });
    fixture = TestBed.createComponent(PiloteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
