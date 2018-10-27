import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule, MatButtonModule, MatDialogModule, MatFormField, MatIconModule, MatInputModule,
   MatProgressSpinnerModule, MatSelectModule,
  MatSnackBar, MatCardModule, MatToolbarModule, MatBottomSheetModule,
  MatSnackBarModule,
  MatTableModule, MatDatepickerModule, MatNativeDateModule, MatTabsModule, MatTabGroup
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ParseService } from './parse.service';
import { ManageDataComponent, NewComponent } from './manage-data/manage-data.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewComponent,
    ManageDataComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
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
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'manage-data', component: ManageDataComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent }
    ])
  ],
  providers: [HomeComponent, ParseService, { provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent],
  entryComponents: [NewComponent]
})
export class AppModule { }
