import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FlightChainComponent } from './flight-chain/flight-chain.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  MatAutocompleteModule,
  MatButtonModule, MatCardModule,
  MatFormFieldModule,
  MatInputModule, MatProgressSpinnerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatTableModule,
   MatMenuModule, 
   MatGridListModule,
   MatStepperModule,
   MatNativeDateModule, MatPaginatorModule,MatIconModule, MatListModule,MatSortModule,MatIcon
} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


/**
 * Put all material module imports here
 */
@NgModule({
  declarations: [],
  exports: [
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatNativeDateModule, MatIconModule,
     MatListModule,MatTableModule,
     MatPaginatorModule ,
     MatSortModule,
     MatIconModule,
     MatMenuModule,
     MatGridListModule,
     MatStepperModule
   
  ],
  providers: [],
  bootstrap: []

})
export class AppMaterialModule { }
