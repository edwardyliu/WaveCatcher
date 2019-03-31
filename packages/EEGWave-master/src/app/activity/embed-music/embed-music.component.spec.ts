import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedMusicComponent } from './embed-music.component';

describe('EmbedMusicComponent', () => {
  let component: EmbedMusicComponent;
  let fixture: ComponentFixture<EmbedMusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbedMusicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
