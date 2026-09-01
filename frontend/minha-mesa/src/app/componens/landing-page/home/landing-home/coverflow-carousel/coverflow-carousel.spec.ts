import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverflowCarousel } from './coverflow-carousel';

describe('CoverflowCarousel', () => {
  let component: CoverflowCarousel;
  let fixture: ComponentFixture<CoverflowCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverflowCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverflowCarousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
