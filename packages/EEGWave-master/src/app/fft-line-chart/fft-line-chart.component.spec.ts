import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FftLineChartComponent } from './fft-line-chart.component';

describe('FftLineChartComponent', () => {
  let component: FftLineChartComponent;
  let fixture: ComponentFixture<FftLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FftLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FftLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
