import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRoleComponent } from './delete-role.component';

describe('DeleteRoleComponent', () => {
  let component: DeleteRoleComponent;
  let fixture: ComponentFixture<DeleteRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteRoleComponent]
    });
    fixture = TestBed.createComponent(DeleteRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
