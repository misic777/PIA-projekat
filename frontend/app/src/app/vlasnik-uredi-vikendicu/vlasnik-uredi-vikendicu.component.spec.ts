import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikUrediVikendicuComponent } from './vlasnik-uredi-vikendicu.component';

describe('VlasnikUrediVikendicuComponent', () => {
  let component: VlasnikUrediVikendicuComponent;
  let fixture: ComponentFixture<VlasnikUrediVikendicuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VlasnikUrediVikendicuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VlasnikUrediVikendicuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
