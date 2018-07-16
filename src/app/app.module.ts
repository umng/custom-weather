import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule, MatButtonModule, MatDialogModule, MatFormField, MatIconModule, MatInputModule,
   MatProgressSpinnerModule, MatSelectModule,
  MatSnackBar, MatCardModule, MatToolbarModule, MatBottomSheetModule,
  MatSnackBarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent, NewComponent } from './home/home.component';
import { ParseService } from './parse.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewComponent
  ],
  imports: [
    BrowserModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    MatBottomSheetModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent }
    ])
  ],
  providers: [HomeComponent, ParseService],
  bootstrap: [AppComponent],
  entryComponents: [NewComponent]
})
export class AppModule { }
