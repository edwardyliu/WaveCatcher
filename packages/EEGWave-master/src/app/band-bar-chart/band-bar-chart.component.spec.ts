import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandBarChartComponent } from './band-bar-chart.component';

describe('BandBarChartComponent', () => {
  let component: BandBarChartComponent;
  let fixture: ComponentFixture<BandBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
