import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolListComponent } from './vol-list.component';


describe('VolComponent', () => {
  let component: VolListComponent;
  let fixture: ComponentFixture<VolListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VolListComponent]
    });
    fixture = TestBed.createComponent(VolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
