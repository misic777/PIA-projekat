import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAzuriranjeKorisnikaComponent } from './admin-azuriranje-korisnika.component';

describe('AdminAzuriranjeKorisnikaComponent', () => {
  let component: AdminAzuriranjeKorisnikaComponent;
  let fixture: ComponentFixture<AdminAzuriranjeKorisnikaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAzuriranjeKorisnikaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAzuriranjeKorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
