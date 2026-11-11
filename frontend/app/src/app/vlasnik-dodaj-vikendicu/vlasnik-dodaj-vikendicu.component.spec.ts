import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikDodajVikendicuComponent } from './vlasnik-dodaj-vikendicu.component';

describe('VlasnikDodajVikendicuComponent', () => {
  let component: VlasnikDodajVikendicuComponent;
  let fixture: ComponentFixture<VlasnikDodajVikendicuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VlasnikDodajVikendicuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VlasnikDodajVikendicuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
