import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReelPageComponent } from './reel-page.component';

describe('ReelPageComponent', () => {
  let component: ReelPageComponent;
  let fixture: ComponentFixture<ReelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReelPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
