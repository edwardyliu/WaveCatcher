import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedGameComponent } from './embed-game.component';

describe('EmbedGameComponent', () => {
  let component: EmbedGameComponent;
  let fixture: ComponentFixture<EmbedGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbedGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
