import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuristaVikendiceDetaljnoComponent } from './turista-vikendice-detaljno.component';

describe('TuristaVikendiceDetaljnoComponent', () => {
  let component: TuristaVikendiceDetaljnoComponent;
  let fixture: ComponentFixture<TuristaVikendiceDetaljnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TuristaVikendiceDetaljnoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TuristaVikendiceDetaljnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
