import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVolComponent } from './add-edit-test.component';

describe('AddEditVolComponent', () => {
  let component: AddEditVolComponent;
  let fixture: ComponentFixture<AddEditVolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditVolComponent]
    });
    fixture = TestBed.createComponent(AddEditVolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
