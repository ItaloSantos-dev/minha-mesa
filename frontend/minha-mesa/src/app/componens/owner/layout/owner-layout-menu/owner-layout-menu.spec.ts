import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerLayoutMenu } from './owner-layout-menu';

describe('OwnerLayoutMenu', () => {
  let component: OwnerLayoutMenu;
  let fixture: ComponentFixture<OwnerLayoutMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerLayoutMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerLayoutMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
