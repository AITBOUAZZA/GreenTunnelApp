import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolPiloteComponent } from './vol-pilote.component';

describe('VolPiloteComponent', () => {
  let component: VolPiloteComponent;
  let fixture: ComponentFixture<VolPiloteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VolPiloteComponent]
    });
    fixture = TestBed.createComponent(VolPiloteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
