import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionGallery } from './accordion-gallery';

describe('AccordionGallery', () => {
  let component: AccordionGallery;
  let fixture: ComponentFixture<AccordionGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionGallery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccordionGallery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
