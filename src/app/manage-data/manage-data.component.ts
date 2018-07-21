import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef, MatSnackBar } from '@angular/material';
import { ParseService } from '../parse.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

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
  id: string;
  value: string;
  viewValue: string;
}
export interface WeatherData {
  id: string;
  position: number;
  weatherDate: Date;
  rainfall: number;
  status: string;
  condition: string;
  createdDate: Date;
}

@Component({
  selector: 'app-manage-data',
  templateUrl: './manage-data.component.html',
  styleUrls: ['./manage-data.component.css']
})
export class ManageDataComponent implements OnInit {

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
  weatherConditions: Select[];

  weatherStatusControl = new FormControl('', [
    Validators.required
  ]);
  weatherDateControl = new FormControl('', [
    Validators.required
  ]);
  weatherRainfallControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.max(1000)
  ]);
  weatherConditionControl = new FormControl('', [
    Validators.required
  ]);

  weatherStatusColumns: string[] = ['position', 'weatherDate', 'rainfall', 'status', 'condition', 'createdDate', 'action'];
  weatherStatusData: WeatherData[];

  constructor(private bottomSheet: MatBottomSheet, private parseService: ParseService,
     public snackBar: MatSnackBar, private dataService: DataService, private router: Router) {
    Parse = parseService.Parse;
  }

  ngOnInit() {
    this.dataService.change.subscribe(className => {
      this.loadRecords(className);
    });
    this.loadRecords('Country');

    const $scope = this;
    Parse.Config.get().then(function (config) {
      $scope.weatherConditions = config.get('weatherConditions');
    }, function (error) {
      console.log('Failed to fetch. Using Cached Config.');
    });

    const response = prompt('Enter passcode?');
    if (response !== 'custom#2018') {
      this.router.navigate(['/']);
    }
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

  deleteRecord(className, recordData): void {
    const $scope = this;

    const classObject = Parse.Object.extend(className);
    const recordsQuery = new Parse.Query(classObject);
    if (className === 'Weather') {
      recordsQuery.equalTo('objectId', recordData);
    } else {
      recordsQuery.equalTo('name', recordData);
    }
    this.isLoading = true;
    recordsQuery.first({
      success: function(result) {
        result.destroy({
          success: function(myObject) {
            $scope.isLoading = false;
            if (className === 'Weather') {
              $scope.showWeatherStatusHistory();
              $scope.openSnackBar(className + ' Data Deleted.', '');
            } else {
              $scope.loadRecords(className);
              $scope.openSnackBar(className + ' Deleted.', '');
            }
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
            id: results[i].id,
            value: results[i].get('name'),
            viewValue: results[i].get('name')
          });
        }
        $scope.setRecords(className, records);
      },
      error: function(error) {
        $scope.isLoading = false;
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

  addWeatherStatus(): void {
    const $scope = this;

    if (this.selectedVillage === undefined || this.selectedVillage === null || this.selectedVillage === '') {
      this.openSnackBar('First select a village.', '');
      return;
    }

    if (this.weatherStatusControl.value === null || this.weatherStatusControl.value === ''
    || this.weatherDateControl.value === null || this.weatherDateControl.value === ''
    || this.weatherRainfallControl.value === null || this.weatherRainfallControl.value === ''
    || this.weatherConditionControl.value === null || this.weatherConditionControl.value === '') {
      this.openSnackBar('Please fill up all required fields.', '');
      return;
    }

    const Weather = Parse.Object.extend('Weather');
    const weather = new Weather();
    weather.set('status', this.weatherStatusControl.value);
    weather.set('weatherDate', this.weatherDateControl.value);
    weather.set('rainfall', this.weatherRainfallControl.value);
    weather.set('condition', this.weatherConditionControl.value);
    weather.set('village', this.getClassObject('Village', this.selectedVillage));
    weather.save(null, {
      success: function (response) {
        $scope.weatherStatusControl.setValue('');
        $scope.weatherDateControl.setValue('');
        $scope.weatherRainfallControl.setValue('');
        $scope.weatherConditionControl.setValue('');
        $scope.openSnackBar('Weather Status added.', '');
        $scope.showWeatherStatusHistory();
      },
      error: function (response, error) {
        $scope.openSnackBar('Failed to add Weather Status, with error- ' + error.code + ' : ' + error.message, '');
      }
    });
  }

  showWeatherStatusHistory(): void {
    const $scope = this;

    const Weather = Parse.Object.extend('Weather');
    const weatherQuery = new Parse.Query(Weather);
    weatherQuery.equalTo('village', this.getClassObject('Village', this.selectedVillage));
    weatherQuery.descending('weatherDate');

    this.isLoading = true;
    weatherQuery.find({
      success: function(results) {
        const records = [];
        for (let i = 0; i < results.length; i++) {
          records.push({
            id: results[i].id,
            position: i + 1,
            weatherDate: results[i].get('weatherDate'),
            rainfall: results[i].get('rainfall'),
            status: results[i].get('status'),
            condition: results[i].get('condition'),
            createdDate: results[i].get('createdAt'),
          });
        }
        $scope.weatherStatusData = records;
        $scope.isLoading = false;
      },
      error: function(error) {
        $scope.isLoading = false;
        $scope.openSnackBar('Failed to get Weather Status History records, with error- ' + error.code + ' : ' + error.message, '');
      }
    });
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
  templateUrl: 'new.html'
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
    // event.preventDefault();
    const $scope = this;

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
