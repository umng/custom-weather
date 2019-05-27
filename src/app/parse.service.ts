import {Injectable, Output, EventEmitter} from '@angular/core';
import * as Parse from 'parse';


@Injectable()
export class ParseService {
  Parse;
  IsLoggedIn;

  constructor() {
    this.Parse = Parse;
    this.Parse.initialize('2erHkvAoNlxz9KS70GpJtogDqu5dntSnH5wpgq76', 'VFstENs9mihDqCmWRCaP8XytcxqzQOojHOR2QZ7n');
    this.Parse.serverURL = 'https://parseapi.back4app.com';
    this.IsLoggedIn = false;
  }

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  loggedIn() {
    this.IsLoggedIn = true;
    this.change.emit(this.IsLoggedIn);
  }

  getLoggedUserIfAny() {
    return Parse.User.current();
  }
}
