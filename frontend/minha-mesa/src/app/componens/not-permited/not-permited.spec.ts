import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotPermited } from './not-permited';

describe('NotPermited', () => {
  let component: NotPermited;
  let fixture: ComponentFixture<NotPermited>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotPermited]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotPermited);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
