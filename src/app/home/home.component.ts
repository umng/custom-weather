import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef, MatSnackBar } from '@angular/material';
import { ParseService } from '../parse.service';
import { HttpClient } from '@angular/common/http';

let Parse;

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
  rainfallPercentage: number;
  status: string;
  condition: string;
  conditionImageUrl: string;
  createdDate: Date;
}

export interface WeatherAPI {
  temp: number;
  humidity: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @ViewChild('content') content: ElementRef;

  isLoading = false;

  selectedCountry: string;
  selectedState: string;
  selectedDistrict: string;
  selectedBlock: string;
  selectedPanchayat: string;
  selectedVillage: string;
  todayWeather: WeatherData;
  forecastWeather: WeatherData[];
  conditonImageUrlMap = new Map<string, string>();
  weatherAPI: WeatherAPI;

  countries: Select[];
  states: Select[];
  districts: Select[];
  blocks: Select[];
  panchayats: Select[] = [];
  villages: Select[];

  constructor(private parseService: ParseService, public snackBar: MatSnackBar, private http: HttpClient) {
    Parse = parseService.Parse;
  }

  ngOnInit() {
    this.loadRecords('Country');
    const imgUrlPrefix = 'assets/img/';
    this.conditonImageUrlMap.set('Cloudy', imgUrlPrefix + 'cloudy.png');
    this.conditonImageUrlMap.set('Sunny', imgUrlPrefix + 'sunny.png');
    this.conditonImageUrlMap.set('Rain', imgUrlPrefix + 'rain.png');
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

  showWeatherData(): void {
    const $scope = this;

    if (this.selectedVillage === undefined || this.selectedVillage === null || this.selectedVillage === '') {
      return;
    }

    $scope.todayWeather = null;
    $scope.forecastWeather = [];

    const Weather = Parse.Object.extend('Weather');
    const weatherQuery = new Parse.Query(Weather);
    weatherQuery.equalTo('village', this.getClassObject('Village', this.selectedVillage));
    const today = new Date();
    weatherQuery.greaterThanOrEqualTo('weatherDate', new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    weatherQuery.ascending('weatherDate');
    weatherQuery.limit(5);

    this.isLoading = true;
    weatherQuery.find({
      success: function(results) {
        if (results !== undefined && results !== null && results.length !== 0) {
          $scope.todayWeather = {
            id: results[0].id,
            position: 0,
            weatherDate: results[0].get('weatherDate'),
            rainfall: results[0].get('rainfall'),
            rainfallPercentage: results[0].get('rainfallPercentage'),
            status: results[0].get('status'),
            condition: results[0].get('condition'),
            conditionImageUrl: $scope.conditonImageUrlMap.get(results[0].get('condition')),
            createdDate: results[0].get('createdAt')
          };

          for (let i = 1; i < results.length; i++) {
            $scope.forecastWeather.push({
              id: results[i].id,
              position: i,
              weatherDate: results[i].get('weatherDate'),
              rainfall: results[i].get('rainfall'),
              rainfallPercentage: results[i].get('rainfallPercentage'),
              status: results[i].get('status'),
              condition: results[i].get('condition'),
              conditionImageUrl: $scope.conditonImageUrlMap.get(results[i].get('condition')),
              createdDate: results[i].get('createdAt')
            });
          }
        } else {
          $scope.todayWeather = {
            id: null,
            position: null,
            weatherDate: null,
            rainfall: null,
            rainfallPercentage: null,
            status: 'No Weather Data available.',
            condition: null,
            conditionImageUrl: null,
            createdDate: null
          };
        }
        $scope.isLoading = false;
      },
      error: function(error) {
        $scope.isLoading = false;
        $scope.openSnackBar('Failed to get Weather Status History records, with error- ' + error.code + ' : ' + error.message, '');
      }
    });
    $scope.weatherAPI = null;
    const apiQuery = 'https://query.yahooapis.com/v1/public/yql?q='
    + 'select item.condition, atmosphere.humidity from weather.forecast where woeid in '
    + '(select woeid from geo.places(1) where text=\''
    + this.getVillageName(this.selectedVillage) + ',' + this.selectedPanchayat + ',' + this.selectedBlock + ','
    + this.selectedDistrict + ',' + this.selectedState + ',' + this.selectedCountry
    + '\')&format=json&env=store://datatables.org/alltableswithkeys';
    this.http.get(apiQuery).subscribe(data => {
      const dataJSON = JSON.parse(JSON.stringify(data));
      $scope.weatherAPI = {
        temp: (Math.round((dataJSON.query.results.channel.item.condition.temp - 32) * (5 / 9))),
        humidity: dataJSON.query.results.channel.atmosphere.humidity
      };
    },
    err => {
      console.log('Weather Yahoo API: Error occured.');
    });
  }

  getVillageName(objectId: string): string {
    for (const i in this.villages) {
      if (this.villages[i].id === objectId) {
        return this.villages[i].viewValue;
      }
    }
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
