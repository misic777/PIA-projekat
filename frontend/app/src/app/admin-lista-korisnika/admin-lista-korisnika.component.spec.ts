import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  AdminListaKorisnikaComponent } from './admin-lista-korisnika.component';

describe('AdminListaKorisnikaComponent', () => {
  let component: AdminListaKorisnikaComponent;
  let fixture: ComponentFixture<AdminListaKorisnikaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminListaKorisnikaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminListaKorisnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
