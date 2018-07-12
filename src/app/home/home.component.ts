import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { ParseService } from '../parse.service';

let Parse;

export interface Select {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  selectedCountry: string;
  selectedState: string;
  selectedDistrict: string;
  selectedBlock: string;
  selectedPanchayat: string;
  selectedVillage: string;

  countries: Select[];
  states: Select[];
  districts: Select[] = [
    { value: 'Sabarkantha', viewValue: 'Sabarkantha' },
    { value: 'Mehsana', viewValue: 'Mehsana' },
    { value: 'Gandhinagar', viewValue: 'Gandhinagar' }
  ];
  blocks: Select[] = [
    { value: 'Idar', viewValue: 'Idar' },
    { value: 'Himmatnagar', viewValue: 'Himmatnagar' },
    { value: 'Prantij', viewValue: 'Prantij' }
  ];
  panchayats: Select[] = [
    { value: 'Jawanpura', viewValue: 'Jawanpura' },
    { value: 'Daramali', viewValue: 'Daramali' },
    { value: 'Kamalpur', viewValue: 'Kamalpur' }
  ];
  villages: Select[] = [
    { value: 'Sadatpura', viewValue: 'Sadatpura' },
    { value: 'Sapavada', viewValue: 'Sapavada' }
  ];

  constructor(private bottomSheet: MatBottomSheet, private parseService: ParseService) {
    Parse = parseService.Parse;
  }

  ngOnInit() {
    const $scope = this;
    const Country = Parse.Object.extend('Country');
    const countryQuery = new Parse.Query(Country);
    countryQuery.find({
      success: function(results) {
        const cs = [];
        for (let i = 0; i < results.length; i++) {
          cs.push({
            value: results[i].get('name'),
            viewValue: results[i].get('name')
          });
        }
        $scope.countries = cs;
      },
      error: function(error) {
        alert('Error: ' + error.code + ' ' + error.message);
      }
    });
  }

  openBottomSheet(): void {
    this.bottomSheet.open(NewCountryComponent);
  }

}


@Component({
  selector: 'app-new-country',
  templateUrl: 'newCountry.html',
})
export class NewCountryComponent implements OnInit {

  countryFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private bottomSheetRef: MatBottomSheetRef<NewCountryComponent>, private parseService: ParseService) {
    Parse = parseService.Parse;
  }

  ngOnInit() {
  }

  saveCountry(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    // event.preventDefault();

    const Country = Parse.Object.extend('Country');
    const country = new Country();
    country.set('name', this.countryFormControl.value);

    country.save(null, {
      success: function (response) {
        alert('New object created with objectId: ' + response.id);
      },
      error: function (response, error) {
        alert('Failed to create new object, with error code: ' + error.message);
      }
    });
  }
}
