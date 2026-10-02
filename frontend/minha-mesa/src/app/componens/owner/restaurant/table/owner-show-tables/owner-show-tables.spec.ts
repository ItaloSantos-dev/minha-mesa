import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerShowTables } from './owner-show-tables';

describe('OwnerShowTables', () => {
  let component: OwnerShowTables;
  let fixture: ComponentFixture<OwnerShowTables>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerShowTables]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerShowTables);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
