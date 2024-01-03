import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesManagementComponent } from './roles-management.component';

describe('RolesManagementComponent', () => {
  let component: RolesManagementComponent;
  let fixture: ComponentFixture<RolesManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolesManagementComponent]
    });
    fixture = TestBed.createComponent(RolesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
