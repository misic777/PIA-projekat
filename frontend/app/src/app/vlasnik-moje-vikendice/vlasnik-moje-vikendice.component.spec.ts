import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikMojeVikendiceComponent } from './vlasnik-moje-vikendice.component';

describe('VlasnikMojeVikendiceComponent', () => {
  let component: VlasnikMojeVikendiceComponent;
  let fixture: ComponentFixture<VlasnikMojeVikendiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VlasnikMojeVikendiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VlasnikMojeVikendiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
