import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLayoutMenu } from './client-layout-menu';

describe('ClientLayoutMenu', () => {
  let component: ClientLayoutMenu;
  let fixture: ComponentFixture<ClientLayoutMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientLayoutMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientLayoutMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
