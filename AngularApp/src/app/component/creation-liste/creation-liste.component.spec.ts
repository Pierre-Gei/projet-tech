import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationListeComponent } from './creation-liste.component';

describe('CreationListeComponent', () => {
  let component: CreationListeComponent;
  let fixture: ComponentFixture<CreationListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationListeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
