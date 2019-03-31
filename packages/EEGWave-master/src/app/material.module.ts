import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule,
  MatCardModule,
  MatIconModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatSliderModule,
  MatRadioModule,
  MatInputModule,
  MatTabsModule,
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSliderModule,
    MatRadioModule,
    MatInputModule,
    MatTabsModule,
  ],
  exports: [
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSliderModule,
    MatRadioModule,
    MatInputModule,
    MatTabsModule,
  ],
})
export class MaterialModule {}
