import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeuristicChartComponent } from './heuristic-chart.component';

describe('HeuristicChartComponent', () => {
  let component: HeuristicChartComponent;
  let fixture: ComponentFixture<HeuristicChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeuristicChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeuristicChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
