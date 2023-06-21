import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargementComponent } from './chargement.component';

describe('ChargementComponent', () => {
  let component: ChargementComponent;
  let fixture: ComponentFixture<ChargementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
