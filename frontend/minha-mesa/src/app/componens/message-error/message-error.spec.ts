import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageError } from './message-error';

describe('MessageError', () => {
  let component: MessageError;
  let fixture: ComponentFixture<MessageError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
