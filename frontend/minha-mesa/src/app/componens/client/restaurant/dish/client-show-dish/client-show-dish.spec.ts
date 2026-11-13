import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientShowDish } from './client-show-dish';

describe('ClientShowDish', () => {
  let component: ClientShowDish;
  let fixture: ComponentFixture<ClientShowDish>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientShowDish]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientShowDish);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
