import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlistaAlfabetComponent } from './llista-alfabet.component';

describe('LlistaAlfabetComponent', () => {
  let component: LlistaAlfabetComponent;
  let fixture: ComponentFixture<LlistaAlfabetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlistaAlfabetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LlistaAlfabetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
