import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerAuth } from './owner-auth';

describe('OwnerAuth', () => {
  let component: OwnerAuth;
  let fixture: ComponentFixture<OwnerAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerAuth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerAuth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
