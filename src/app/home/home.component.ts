import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { ParseService } from '../parse.service';
import { DataService } from '../data.service';

let Parse;

let newType;

let country;
let state;
let district;
let block;
let panchayat;
let village;

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

  isLoading = false;

  selectedCountry: string;
  selectedState: string;
  selectedDistrict: string;
  selectedBlock: string;
  selectedPanchayat: string;
  selectedVillage: string;

  countries: Select[];
  countriesList: Parse.Object[];
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

  constructor(private bottomSheet: MatBottomSheet, private parseService: ParseService, private data: DataService) {
    Parse = parseService.Parse;
  }

  ngOnInit() {
    const $scope = this;
    const Country = Parse.Object.extend('Country');
    const countryQuery = new Parse.Query(Country);
    countryQuery.find({
      success: function(results) {
        $scope.countriesList = results;
        const cs = [];
        for (let i = 0; i < results.length; i++) {
          cs.push({
            value: results[i].id,
            viewValue: results[i].get('name')
          });
        }
        $scope.countries = cs;
      },
      error: function(error) {
        alert('Error: ' + error.code + ' ' + error.message);
      }
    });

    this.data.loadRecords.subscribe(className => {
      alert('hello');
      this.loadRecords(className);
    });
  }

  openBottomSheet(className): void {
    newType = className;
    country = this.selectedCountry;
    state = this.selectedState;
    district = this.selectedDistrict;
    block = this.selectedBlock;
    panchayat = this.selectedPanchayat;
    village = this.selectedVillage;
    this.bottomSheet.open(NewComponent);
  }

  loadRecords(className): void {
    let classNameSelected = '';
    if (className === 'State') {
      classNameSelected = 'Country';
    } else if (className === 'District') {
      classNameSelected = 'State';
    } else if (className === 'Block') {
      classNameSelected = 'District';
    } else if (className === 'Panchayat') {
      classNameSelected = 'Block';
    } else if (className === 'Village') {
      classNameSelected = 'Panchayat';
    }

    if (className === 'State') {
      this.selectedVillage = null;
      this.selectedPanchayat = null;
      this.selectedBlock = null;
      this.selectedDistrict = null;
      this.selectedState = null;
      if (this.selectedCountry == null) {
        return;
      }
    } else if (className === 'District') {
      this.selectedVillage = null;
      this.selectedPanchayat = null;
      this.selectedBlock = null;
      this.selectedDistrict = null;
      if (this.selectedState == null) {
        return;
      }
    } else if (className === 'Block') {
      this.selectedVillage = null;
      this.selectedPanchayat = null;
      this.selectedBlock = null;
      if (this.selectedDistrict == null) {
        return;
      }
    } else if (className === 'Panchayat') {
      this.selectedVillage = null;
      this.selectedPanchayat = null;
      if (this.selectedBlock == null) {
        return;
      }
    } else if (className === 'Village') {
      this.selectedVillage = null;
      if (this.selectedPanchayat == null) {
        return;
      }
    }

    const $scope = this;

    const ClassObjectSelected = Parse.Object.extend(classNameSelected);
    const classObjectSelected = new ClassObjectSelected();
    classObjectSelected.id = this.selectedCountry;

    const classObject = Parse.Object.extend(className);
    const recordsQuery = new Parse.Query(classObject);
    if (className === 'State') {
      recordsQuery.equalTo(classNameSelected.toLowerCase(), this.getClassObject(classNameSelected, this.selectedCountry));
    } else if (className === 'District') {
      recordsQuery.equalTo(classNameSelected.toLowerCase(), this.getClassObject(classNameSelected, this.selectedState));
    } else if (className === 'Block') {
      recordsQuery.equalTo(classNameSelected.toLowerCase(), this.getClassObject(classNameSelected, this.selectedDistrict));
    } else if (className === 'Panchayat') {
      recordsQuery.equalTo(classNameSelected.toLowerCase(), this.getClassObject(classNameSelected, this.selectedBlock));
    } else if (className === 'Village') {
      recordsQuery.equalTo(classNameSelected.toLowerCase(), this.getClassObject(classNameSelected, this.selectedPanchayat));
    }

    this.isLoading = true;
    recordsQuery.find({
      success: function(results) {
        const records = [];
        for (let i = 0; i < results.length; i++) {
          records.push({
            value: results[i].id,
            viewValue: results[i].get('name')
          });
        }
        $scope.setRecords(className, records);
      },
      error: function(error) {
        alert('Error: ' + error.code + ' ' + error.message);
      }
    });
  }

  setRecords(className, records): void {
    if (className === 'Country') {
      this.countries = records;
      this.selectedState = null;
    } else if (className === 'State') {
      this.states = records;
    } else if (className === 'District') {
      this.districts = records;
    } else if (className === 'Block') {
      this.blocks = records;
    } else if (className === 'Panchayat') {
      this.panchayats = records;
    } else if (className === 'Village') {
      this.villages = records;
    }
    this.isLoading = false;
  }

  getClassObject(className, objectId): void {
    const ClassObject = Parse.Object.extend(className);
    const classObject = new ClassObject();
    classObject.id = objectId;
    return classObject;
  }
}


@Component({
  selector: 'app-new',
  templateUrl: 'new.html',
})
export class NewComponent implements OnInit {

  formControl = new FormControl('', [
    Validators.required
  ]);

  className = newType;

  @Output() loadRecordsEvent = new EventEmitter<string>();

  constructor(private bottomSheetRef: MatBottomSheetRef<NewComponent>, private parseService: ParseService) {
    Parse = parseService.Parse;
  }

  ngOnInit() {
  }

  saveNew(): void {
    const $scope = this;
    this.bottomSheetRef.dismiss();
    // event.preventDefault();

    const NewObject = Parse.Object.extend(this.className);
    const newObject = new NewObject();
    if (this.className === 'State') {
      newObject.set('country', this.getClassObject('Country', country));
    } else if (this.className === 'District') {
      newObject.set('state', this.getClassObject('State', state));
    } else if (this.className === 'Block') {
      newObject.set('district', this.getClassObject('District', district));
    } else if (this.className === 'Panchayat') {
      newObject.set('block', this.getClassObject('Block', block));
    } else if (this.className === 'Village') {
      newObject.set('panchayat', this.getClassObject('Panchayat', panchayat));
    }
    newObject.set('name', this.formControl.value);

    newObject.save(null, {
      success: function (response) {
        // if (this.className === 'State') {

        // } else if (this.className === 'District') {
        //   newObject.set('state', this.getClassObject('State', state));
        // } else if (this.className === 'Block') {
        //   newObject.set('district', this.getClassObject('District', district));
        // } else if (this.className === 'Panchayat') {
        //   newObject.set('block', this.getClassObject('Block', block));
        // } else if (this.className === 'Village') {
        //   newObject.set('panchayat', this.getClassObject('Panchayat', panchayat));
        // }
        alert('New ' + $scope.className + ' saved.');
        this.loadRecordsEvent.emit(this.className);
      },
      error: function (response, error) {
        alert('Failed to create new object, with error code: ' + error.message);
      }
    });
  }

  getClassObject(className, objectId): void {
    const ClassObject = Parse.Object.extend(className);
    const classObject = new ClassObject();
    classObject.id = objectId;
    return classObject;
  }
}
