import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef, MatSnackBar } from '@angular/material';
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


let countriesList;
let statesList;
let districtsList;
let blocksList;
let panchayatsList;
let villagesList;

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
  states: Select[];
  districts: Select[];
  blocks: Select[];
  panchayats: Select[];
  villages: Select[];

  constructor(private bottomSheet: MatBottomSheet, private parseService: ParseService,
     public snackBar: MatSnackBar, private dataService: DataService) {
    Parse = parseService.Parse;
  }

  ngOnInit() {
    this.dataService.change.subscribe(className => {
      this.loadRecords(className);
    });
    this.loadRecords('Country');
  }

  openBottomSheet(className): void {
    newType = className;
    country = this.selectedCountry;
    state = this.selectedState;
    district = this.selectedDistrict;
    block = this.selectedBlock;
    panchayat = this.selectedPanchayat;
    village = this.selectedVillage;

    countriesList = this.countries;
    statesList = this.states;
    districtsList = this.districts;
    blocksList = this.blocks;
    panchayatsList = this.panchayats;
    villagesList = this.villages;

    this.bottomSheet.open(NewComponent);
  }

  deleteRecord(className): void {
    const $scope = this;

    const classObject = Parse.Object.extend(className);
    const recordsQuery = new Parse.Query(classObject);
    if (className === 'Country') {
      recordsQuery.equalTo('name', this.selectedCountry);
    } else if (className === 'State') {
      recordsQuery.equalTo('name', this.selectedState);
    } else if (className === 'District') {
      recordsQuery.equalTo('name', this.selectedDistrict);
    } else if (className === 'Block') {
      recordsQuery.equalTo('name', this.selectedBlock);
    } else if (className === 'Panchayat') {
      recordsQuery.equalTo('name', this.selectedPanchayat);
    } else if (className === 'Village') {
      recordsQuery.equalTo('name', this.selectedVillage);
    }
    recordsQuery.limit(1);
    this.isLoading = true;
    recordsQuery.find({
      success: function(results) {
        results[0].destroy({
          success: function(myObject) {
            $scope.isLoading = false;
            $scope.loadRecords(className);
            $scope.openSnackBar(className + ' Deleted.', '');
          },
          error: function(myObject, error) {
            $scope.isLoading = false;
            $scope.openSnackBar('Failed to delete ' + className + ', with error- ' + error.code + ' : ' + error.message, '');
          }
        });
      },
      error: function(error) {
        $scope.isLoading = false;
        $scope.openSnackBar('Failed to delete ' + className + ', with error- ' + error.code + ' : ' + error.message, '');
      }
    });
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
      recordsQuery.equalTo(classNameSelected.toLowerCase(), this.selectedCountry);
    } else if (className === 'District') {
      recordsQuery.equalTo(classNameSelected.toLowerCase(), this.selectedState);
    } else if (className === 'Block') {
      recordsQuery.equalTo(classNameSelected.toLowerCase(), this.selectedDistrict);
    } else if (className === 'Panchayat') {
      recordsQuery.equalTo(classNameSelected.toLowerCase(), this.selectedBlock);
    } else if (className === 'Village') {
      recordsQuery.equalTo(classNameSelected.toLowerCase(), this.selectedPanchayat);
    }

    this.isLoading = true;
    recordsQuery.find({
      success: function(results) {
        const records = [];
        for (let i = 0; i < results.length; i++) {
          records.push({
            value: results[i].get('name'),
            viewValue: results[i].get('name')
          });
        }
        $scope.setRecords(className, records);
      },
      error: function(error) {
        this.isLoading = false;
        $scope.openSnackBar('Failed to get ' + className + ' records, with error- ' + error.code + ' : ' + error.message, '');
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
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

  constructor(private bottomSheetRef: MatBottomSheetRef<NewComponent>, private parseService: ParseService,
    public snackBar: MatSnackBar, private dataService: DataService) {
    Parse = parseService.Parse;
  }

  ngOnInit() {
  }

  saveNew(): void {
    const $scope = this;
    // event.preventDefault();

    const NewObject = Parse.Object.extend(this.className);
    const newObject = new NewObject();
    if (this.formControl.value === '') {
      this.openSnackBar(this.className + ' Name required.', '');
      return;
    }
    if (this.className === 'Country') {
      if (this.isNameExists(countriesList, this.formControl.value)) { return; }
    } else if (this.className === 'State') {
      if (this.isNameExists(statesList, this.formControl.value)) { return; }
      newObject.set('country', country);
    } else if (this.className === 'District') {
      if (this.isNameExists(districtsList, this.formControl.value)) { return; }
      newObject.set('state', state);
    } else if (this.className === 'Block') {
      if (this.isNameExists(blocksList, this.formControl.value)) { return; }
      newObject.set('district', district);
    } else if (this.className === 'Panchayat') {
      if (this.isNameExists(panchayatsList, this.formControl.value)) { return; }
      newObject.set('block', block);
    } else if (this.className === 'Village') {
      if (this.isNameExists(villagesList, this.formControl.value)) { return; }
      newObject.set('panchayat', panchayat);
    }
    newObject.set('name', this.formControl.value);

    newObject.save(null, {
      success: function (response) {
        $scope.openSnackBar('New ' + $scope.className + ' saved.', '');
        $scope.dataService.loadRecords($scope.className);
        $scope.bottomSheetRef.dismiss();
      },
      error: function (response, error) {
        $scope.openSnackBar('Failed to create new object, with error- ' + error.code + ' : ' + error.message, '');
      }
    });
  }

  getClassObject(className, objectId): void {
    const ClassObject = Parse.Object.extend(className);
    const classObject = new ClassObject();
    classObject.id = objectId;
    return classObject;
  }

  isNameExists(objectList, name): boolean {
    for (const i in objectList) {
      if (objectList[i].value === name) {
        this.openSnackBar(this.className + ' Name already exists.', '');
        return true;
      }
    }
    return false;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }
}
