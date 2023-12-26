import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LletraComponent } from './lletra.component';

describe('LletraComponent', () => {
  let component: LletraComponent;
  let fixture: ComponentFixture<LletraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LletraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LletraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
